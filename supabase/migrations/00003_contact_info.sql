-- ============================================
-- Migration: Add contact information to companies
-- ============================================

-- Add contact columns to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS contact_person TEXT;

-- Update complete_registration function to include contact fields
CREATE OR REPLACE FUNCTION complete_registration(
  p_user_id UUID,
  p_company_name TEXT,
  p_company_description TEXT DEFAULT NULL,
  p_industry TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_contact_phone TEXT DEFAULT NULL,
  p_contact_email TEXT DEFAULT NULL,
  p_contact_person TEXT DEFAULT NULL,
  p_buyer_enabled BOOLEAN DEFAULT false,
  p_supplier_enabled BOOLEAN DEFAULT false,
  p_terms_version TEXT DEFAULT '1.0'
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
BEGIN
  -- Create company
  INSERT INTO companies (name, description, industry, location, contact_phone, contact_email, contact_person, buyer_enabled, supplier_enabled)
  VALUES (p_company_name, p_company_description, p_industry, p_location, p_contact_phone, p_contact_email, p_contact_person, p_buyer_enabled, p_supplier_enabled)
  RETURNING id INTO v_company_id;

  -- Add user as company owner
  INSERT INTO company_members (company_id, user_id, role)
  VALUES (v_company_id, p_user_id, 'owner');

  -- Record terms acceptance
  INSERT INTO terms_acceptances (user_id, version)
  VALUES (p_user_id, p_terms_version);

  RETURN v_company_id;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policy: Supplier can see buyer company when their offer is selected as winner
-- This allows suppliers to see buyer contact info after winning
CREATE POLICY companies_select_winner_buyer ON companies FOR SELECT
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM offers o
      JOIN rfqs r ON r.id = o.rfq_id
      WHERE r.company_id = companies.id
        AND o.is_selected = true
        AND o.deleted_at IS NULL
        AND r.deleted_at IS NULL
        AND EXISTS (
          SELECT 1 FROM company_members cm
          WHERE cm.company_id = o.company_id
            AND cm.user_id = auth.uid()
        )
    )
  );

-- Add function to get RFQ IDs with new offers (for notification highlighting)
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

-- Add function to get RFQ IDs where supplier won (for navigation from notifications)
CREATE OR REPLACE FUNCTION get_won_rfqs(p_user_id UUID)
RETURNS TABLE(rfq_id UUID)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_last_seen TIMESTAMPTZ;
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
    RETURN;
  END IF;
  
  -- Get last seen timestamp
  SELECT last_wins_seen_at INTO v_last_seen
  FROM user_notification_state
  WHERE user_id = p_user_id;
  
  IF v_last_seen IS NULL THEN
    v_last_seen := '1970-01-01'::TIMESTAMPTZ;
  END IF;
  
  -- Return RFQ IDs where supplier won (offer selected) since last seen
  RETURN QUERY
  SELECT DISTINCT o.rfq_id
  FROM offers o
  JOIN rfqs r ON r.id = o.rfq_id
  WHERE o.company_id = v_company_id
    AND o.deleted_at IS NULL
    AND r.deleted_at IS NULL
    AND o.is_selected = true
    AND o.updated_at > v_last_seen
  ORDER BY o.updated_at DESC;
END;
$$ LANGUAGE plpgsql;
