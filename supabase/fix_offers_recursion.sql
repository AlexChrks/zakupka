-- ============================================
-- Fix: Infinite recursion in offers RLS policies
-- Проблема: offers_insert -> companies -> companies_select_offer_supplier -> offers
-- Решение: SECURITY DEFINER функции для проверок без RLS
-- ============================================

-- Function to check if company is a valid supplier (bypasses RLS)
CREATE OR REPLACE FUNCTION is_valid_supplier_company(cid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM companies 
    WHERE id = cid 
      AND supplier_enabled = true 
      AND deleted_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to check if RFQ is open and valid for offers (bypasses RLS)
CREATE OR REPLACE FUNCTION is_rfq_open_for_offers(rid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM rfqs
    WHERE id = rid 
      AND status = 'open' 
      AND deadline > now() 
      AND deleted_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to check if RFQ belongs to a company (bypasses RLS)
CREATE OR REPLACE FUNCTION is_rfq_owned_by_company(rid UUID, cid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM rfqs
    WHERE id = rid 
      AND company_id = cid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Drop old offers_insert policy
DROP POLICY IF EXISTS offers_insert ON offers;

-- Create new offers_insert policy using SECURITY DEFINER functions
CREATE POLICY offers_insert ON offers FOR INSERT
  WITH CHECK (
    is_company_member(auth.uid(), company_id)
    AND is_valid_supplier_company(company_id)
    AND is_rfq_open_for_offers(rfq_id)
    AND NOT is_rfq_owned_by_company(rfq_id, company_id)
  );
