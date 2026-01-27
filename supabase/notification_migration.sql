-- ============================================
-- Notifications - Migration for tracking new offers/RFQs
-- Добавьте этот файл в Supabase SQL Editor и выполните
-- ============================================

-- Table to track when user last viewed notifications
CREATE TABLE IF NOT EXISTS user_notification_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  last_offers_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_rfqs_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_notification_state_user ON user_notification_state(user_id);

-- Trigger for updated_at
CREATE TRIGGER trg_user_notification_state_updated_at 
  BEFORE UPDATE ON user_notification_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE user_notification_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_notification_state_select ON user_notification_state FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY user_notification_state_insert ON user_notification_state FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_notification_state_update ON user_notification_state FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- RPC Functions for notification counts
-- ============================================

-- Get count of new offers for buyer (offers on their RFQs since last seen)
CREATE OR REPLACE FUNCTION get_new_offers_count(p_user_id UUID)
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_last_seen TIMESTAMPTZ;
  v_count INTEGER;
BEGIN
  -- Get user's buyer company
  SELECT cm.company_id INTO v_company_id
  FROM company_members cm
  JOIN companies c ON c.id = cm.company_id
  WHERE cm.user_id = p_user_id 
    AND c.buyer_enabled = true 
    AND c.deleted_at IS NULL
  LIMIT 1;
  
  IF v_company_id IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Get last seen timestamp
  SELECT last_offers_seen_at INTO v_last_seen
  FROM user_notification_state
  WHERE user_id = p_user_id;
  
  -- If no record, use very old date to count all
  IF v_last_seen IS NULL THEN
    v_last_seen := '1970-01-01'::TIMESTAMPTZ;
  END IF;
  
  -- Count new offers on user's RFQs
  SELECT COUNT(*) INTO v_count
  FROM offers o
  JOIN rfqs r ON r.id = o.rfq_id
  WHERE r.company_id = v_company_id
    AND r.deleted_at IS NULL
    AND o.deleted_at IS NULL
    AND o.created_at > v_last_seen;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Get count of new RFQs for supplier (new RFQs since last seen)
CREATE OR REPLACE FUNCTION get_new_rfqs_count(p_user_id UUID)
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_last_seen TIMESTAMPTZ;
  v_count INTEGER;
BEGIN
  -- Get user's supplier company
  SELECT cm.company_id INTO v_company_id
  FROM company_members cm
  JOIN companies c ON c.id = cm.company_id
  WHERE cm.user_id = p_user_id 
    AND c.supplier_enabled = true 
    AND c.deleted_at IS NULL
  LIMIT 1;
  
  IF v_company_id IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Get last seen timestamp
  SELECT last_rfqs_seen_at INTO v_last_seen
  FROM user_notification_state
  WHERE user_id = p_user_id;
  
  -- If no record, use very old date to count all
  IF v_last_seen IS NULL THEN
    v_last_seen := '1970-01-01'::TIMESTAMPTZ;
  END IF;
  
  -- Count new open RFQs (excluding own company's RFQs)
  SELECT COUNT(*) INTO v_count
  FROM rfqs r
  WHERE r.deleted_at IS NULL
    AND r.status = 'open'
    AND r.deadline > now()
    AND r.company_id != v_company_id
    AND r.created_at > v_last_seen;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Mark offers as seen (for buyers)
CREATE OR REPLACE FUNCTION mark_offers_seen(p_user_id UUID)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_notification_state (user_id, last_offers_seen_at, last_rfqs_seen_at)
  VALUES (p_user_id, now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET last_offers_seen_at = now();
END;
$$ LANGUAGE plpgsql;

-- Mark RFQs as seen (for suppliers)
CREATE OR REPLACE FUNCTION mark_rfqs_seen(p_user_id UUID)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_notification_state (user_id, last_offers_seen_at, last_rfqs_seen_at)
  VALUES (p_user_id, now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET last_rfqs_seen_at = now();
END;
$$ LANGUAGE plpgsql;

-- Get RFQ IDs with new offers (for highlighting)
CREATE OR REPLACE FUNCTION get_rfqs_with_new_offers(p_user_id UUID)
RETURNS TABLE(rfq_id UUID)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_last_seen TIMESTAMPTZ;
BEGIN
  -- Get user's buyer company
  SELECT cm.company_id INTO v_company_id
  FROM company_members cm
  JOIN companies c ON c.id = cm.company_id
  WHERE cm.user_id = p_user_id 
    AND c.buyer_enabled = true 
    AND c.deleted_at IS NULL
  LIMIT 1;
  
  IF v_company_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Get last seen timestamp
  SELECT last_offers_seen_at INTO v_last_seen
  FROM user_notification_state
  WHERE user_id = p_user_id;
  
  IF v_last_seen IS NULL THEN
    v_last_seen := '1970-01-01'::TIMESTAMPTZ;
  END IF;
  
  -- Return distinct RFQ IDs with new offers
  RETURN QUERY
  SELECT DISTINCT r.id
  FROM offers o
  JOIN rfqs r ON r.id = o.rfq_id
  WHERE r.company_id = v_company_id
    AND r.deleted_at IS NULL
    AND o.deleted_at IS NULL
    AND o.created_at > v_last_seen;
END;
$$ LANGUAGE plpgsql;
