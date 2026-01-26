-- ============================================
-- Winner Notifications - Migration
-- Добавляет нотификации для поставщиков о победе в тендере
-- ============================================

-- Add new column to track wins
ALTER TABLE user_notification_state 
ADD COLUMN IF NOT EXISTS last_wins_seen_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- ============================================
-- RPC Function to count new wins
-- ============================================

-- Get count of new wins for supplier (their offers selected since last seen)
CREATE OR REPLACE FUNCTION get_new_wins_count(p_user_id UUID)
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
  SELECT last_wins_seen_at INTO v_last_seen
  FROM user_notification_state
  WHERE user_id = p_user_id;
  
  -- If no record, use very old date to count all
  IF v_last_seen IS NULL THEN
    v_last_seen := '1970-01-01'::TIMESTAMPTZ;
  END IF;
  
  -- Count offers where we were selected as winner since last seen
  SELECT COUNT(*) INTO v_count
  FROM offers o
  WHERE o.company_id = v_company_id
    AND o.deleted_at IS NULL
    AND o.is_selected = true
    AND o.updated_at > v_last_seen;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Mark wins as seen (for suppliers)
CREATE OR REPLACE FUNCTION mark_wins_seen(p_user_id UUID)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_notification_state (user_id, last_offers_seen_at, last_rfqs_seen_at, last_wins_seen_at)
  VALUES (p_user_id, now(), now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET last_wins_seen_at = now();
END;
$$ LANGUAGE plpgsql;
