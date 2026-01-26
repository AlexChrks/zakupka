-- ============================================
-- B2B RFQ Platform - Row Level Security Policies
-- ============================================

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get user's company IDs
CREATE OR REPLACE FUNCTION get_user_company_ids(uid UUID)
RETURNS SETOF UUID AS $$
  SELECT company_id FROM company_members WHERE user_id = uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is member of a specific company
CREATE OR REPLACE FUNCTION is_company_member(uid UUID, cid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM company_members 
    WHERE user_id = uid AND company_id = cid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user belongs to a buyer-enabled company
CREATE OR REPLACE FUNCTION user_has_buyer_company(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM company_members cm
    JOIN companies c ON c.id = cm.company_id
    WHERE cm.user_id = uid 
      AND c.buyer_enabled = true 
      AND c.deleted_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user belongs to a supplier-enabled company
CREATE OR REPLACE FUNCTION user_has_supplier_company(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM company_members cm
    JOIN companies c ON c.id = cm.company_id
    WHERE cm.user_id = uid 
      AND c.supplier_enabled = true 
      AND c.deleted_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get user's buyer company ID (first one if multiple)
CREATE OR REPLACE FUNCTION get_user_buyer_company_id(uid UUID)
RETURNS UUID AS $$
  SELECT cm.company_id FROM company_members cm
  JOIN companies c ON c.id = cm.company_id
  WHERE cm.user_id = uid 
    AND c.buyer_enabled = true 
    AND c.deleted_at IS NULL
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get user's supplier company ID (first one if multiple)
CREATE OR REPLACE FUNCTION get_user_supplier_company_id(uid UUID)
RETURNS UUID AS $$
  SELECT cm.company_id FROM company_members cm
  JOIN companies c ON c.id = cm.company_id
  WHERE cm.user_id = uid 
    AND c.supplier_enabled = true 
    AND c.deleted_at IS NULL
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- PROFILES RLS
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY profiles_select_own ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY profiles_update_own ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert is handled by trigger on auth.users creation

-- ============================================
-- COMPANIES RLS
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Members can read their own company
CREATE POLICY companies_select_member ON companies FOR SELECT
  USING (
    deleted_at IS NULL 
    AND is_company_member(auth.uid(), id)
  );

-- Anyone authenticated can create a company (for registration)
-- The application logic ensures proper setup
CREATE POLICY companies_insert ON companies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Members can update their company
CREATE POLICY companies_update ON companies FOR UPDATE
  USING (is_company_member(auth.uid(), id))
  WITH CHECK (is_company_member(auth.uid(), id));

-- Soft delete only - members can set deleted_at
CREATE POLICY companies_soft_delete ON companies FOR UPDATE
  USING (is_company_member(auth.uid(), id))
  WITH CHECK (is_company_member(auth.uid(), id));

-- ============================================
-- COMPANY MEMBERS RLS
-- ============================================

ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

-- Members can see other members of their company
CREATE POLICY company_members_select ON company_members FOR SELECT
  USING (
    company_id IN (SELECT get_user_company_ids(auth.uid()))
  );

-- Allow insert for registration (user creates their own membership as owner)
CREATE POLICY company_members_insert ON company_members FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
  );

-- Only owners can add other members (future feature)
CREATE POLICY company_members_insert_by_owner ON company_members FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM company_members 
      WHERE company_id = company_members.company_id 
        AND user_id = auth.uid() 
        AND role = 'owner'
    )
  );

-- ============================================
-- CATEGORIES RLS
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read categories
CREATE POLICY categories_select ON categories FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only admins can insert/update categories (handled by service role)
-- No INSERT/UPDATE policies for regular users

-- ============================================
-- RFQS RLS
-- ============================================

ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read non-deleted RFQs (public browsing)
CREATE POLICY rfqs_select_public ON rfqs FOR SELECT
  USING (
    deleted_at IS NULL 
    AND auth.uid() IS NOT NULL
  );

-- Buyer company members can create RFQs for their company
CREATE POLICY rfqs_insert ON rfqs FOR INSERT
  WITH CHECK (
    is_company_member(auth.uid(), company_id)
    AND EXISTS(
      SELECT 1 FROM companies 
      WHERE id = company_id 
        AND buyer_enabled = true 
        AND deleted_at IS NULL
    )
  );

-- Buyer company members can update their RFQs
CREATE POLICY rfqs_update ON rfqs FOR UPDATE
  USING (
    is_company_member(auth.uid(), company_id)
  )
  WITH CHECK (
    is_company_member(auth.uid(), company_id)
  );

-- Note: Soft delete is done via UPDATE (setting deleted_at)
-- Actual DELETE is not allowed via RLS

-- ============================================
-- RFQ FILES RLS
-- ============================================

ALTER TABLE rfq_files ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read file metadata for accessible RFQs
CREATE POLICY rfq_files_select ON rfq_files FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND r.deleted_at IS NULL 
        AND auth.uid() IS NOT NULL
    )
  );

-- Buyer company members can insert files for their RFQs
CREATE POLICY rfq_files_insert ON rfq_files FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND is_company_member(auth.uid(), r.company_id)
    )
  );

-- Buyer company members can delete files for their RFQs
CREATE POLICY rfq_files_delete ON rfq_files FOR DELETE
  USING (
    EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND is_company_member(auth.uid(), r.company_id)
    )
  );

-- ============================================
-- OFFERS RLS
-- ============================================

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Suppliers can read their own company's offers
CREATE POLICY offers_select_own ON offers FOR SELECT
  USING (
    deleted_at IS NULL 
    AND is_company_member(auth.uid(), company_id)
  );

-- Buyers can read all offers for their RFQs
CREATE POLICY offers_select_buyer ON offers FOR SELECT
  USING (
    deleted_at IS NULL
    AND EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND is_company_member(auth.uid(), r.company_id)
    )
  );

-- Suppliers can insert offers (RFQ must be open + not past deadline)
CREATE POLICY offers_insert ON offers FOR INSERT
  WITH CHECK (
    is_company_member(auth.uid(), company_id)
    AND EXISTS(
      SELECT 1 FROM companies 
      WHERE id = company_id 
        AND supplier_enabled = true 
        AND deleted_at IS NULL
    )
    AND EXISTS(
      SELECT 1 FROM rfqs
      WHERE id = rfq_id 
        AND status = 'open' 
        AND deadline > now() 
        AND deleted_at IS NULL
    )
    -- Supplier cannot bid on their own company's RFQ
    AND NOT EXISTS(
      SELECT 1 FROM rfqs
      WHERE id = rfq_id 
        AND company_id = offers.company_id
    )
  );

-- Suppliers can update their offers (same conditions, and not already selected)
CREATE POLICY offers_update_supplier ON offers FOR UPDATE
  USING (
    is_company_member(auth.uid(), company_id)
    AND is_selected = false
    AND EXISTS(
      SELECT 1 FROM rfqs
      WHERE id = rfq_id 
        AND status = 'open' 
        AND deadline > now()
    )
  )
  WITH CHECK (
    is_company_member(auth.uid(), company_id)
    AND is_selected = false
  );

-- Buyers can update is_selected on offers for their RFQs
CREATE POLICY offers_update_buyer ON offers FOR UPDATE
  USING (
    EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND is_company_member(auth.uid(), r.company_id)
    )
  )
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND is_company_member(auth.uid(), r.company_id)
    )
  );

-- ============================================
-- TERMS ACCEPTANCES RLS
-- ============================================

ALTER TABLE terms_acceptances ENABLE ROW LEVEL SECURITY;

-- Users can read their own acceptances
CREATE POLICY terms_acceptances_select ON terms_acceptances FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own acceptances
CREATE POLICY terms_acceptances_insert ON terms_acceptances FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- STORAGE POLICIES (for rfq-files bucket)
-- ============================================

-- Note: These need to be run separately in Supabase dashboard or via
-- storage policies API. The bucket should be created as private.

-- Example storage policy structure (to be configured in Supabase dashboard):
-- 
-- Bucket: rfq-files (private)
-- 
-- SELECT policy: Allow authenticated users to read files for RFQs they can access
-- INSERT policy: Allow buyer company members to upload files for their RFQs
-- DELETE policy: Allow buyer company members to delete files for their RFQs
--
-- Actual file access should be via signed URLs generated server-side
