-- ============================================
-- B2B Платформа закупок - Полная миграция
-- Скопируйте весь этот файл в Supabase SQL Editor и выполните
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE company_role AS ENUM ('owner', 'member');
CREATE TYPE rfq_status AS ENUM ('open', 'completed', 'cancelled');

-- ============================================
-- TABLES
-- ============================================

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  location TEXT,
  buyer_enabled BOOLEAN NOT NULL DEFAULT false,
  supplier_enabled BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Company Members
CREATE TABLE company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role company_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RFQs
CREATE TABLE rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  quantity TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  deadline TIMESTAMPTZ NOT NULL,
  status rfq_status NOT NULL DEFAULT 'open',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT budget_range_check CHECK (
    budget_min IS NULL OR budget_max IS NULL OR budget_max >= budget_min
  )
);

-- RFQ Files
CREATE TABLE rfq_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Offers
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BYN',
  delivery_days INTEGER,
  notes TEXT,
  is_selected BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(rfq_id, company_id),
  CONSTRAINT price_positive CHECK (price > 0),
  CONSTRAINT delivery_days_positive CHECK (delivery_days IS NULL OR delivery_days > 0)
);

-- Terms Acceptances
CREATE TABLE terms_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_companies_deleted ON companies(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_company_members_company ON company_members(company_id);
CREATE INDEX idx_company_members_user ON company_members(user_id);
CREATE INDEX idx_rfqs_status ON rfqs(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_rfqs_company ON rfqs(company_id);
CREATE INDEX idx_rfqs_deadline ON rfqs(deadline) WHERE deleted_at IS NULL;
CREATE INDEX idx_rfqs_category ON rfqs(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_rfqs_created ON rfqs(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_rfq_files_rfq ON rfq_files(rfq_id);
CREATE INDEX idx_offers_rfq ON offers(rfq_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_offers_company ON offers(company_id);
CREATE UNIQUE INDEX idx_offers_single_winner ON offers(rfq_id) WHERE is_selected = true AND deleted_at IS NULL;
CREATE INDEX idx_terms_acceptances_user ON terms_acceptances(user_id);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_companies_updated_at 
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_rfqs_updated_at 
  BEFORE UPDATE ON rfqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_offers_updated_at 
  BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- RLS HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION get_user_company_ids(uid UUID)
RETURNS SETOF UUID AS $$
  SELECT company_id FROM company_members WHERE user_id = uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_company_member(uid UUID, cid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM company_members 
    WHERE user_id = uid AND company_id = cid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

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

CREATE OR REPLACE FUNCTION get_user_buyer_company_id(uid UUID)
RETURNS UUID AS $$
  SELECT cm.company_id FROM company_members cm
  JOIN companies c ON c.id = cm.company_id
  WHERE cm.user_id = uid 
    AND c.buyer_enabled = true 
    AND c.deleted_at IS NULL
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_supplier_company_id(uid UUID)
RETURNS UUID AS $$
  SELECT cm.company_id FROM company_members cm
  JOIN companies c ON c.id = cm.company_id
  WHERE cm.user_id = uid 
    AND c.supplier_enabled = true 
    AND c.deleted_at IS NULL
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper to check if company is a valid supplier (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION is_valid_supplier_company(cid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM companies 
    WHERE id = cid 
      AND supplier_enabled = true 
      AND deleted_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper to check if RFQ is open and valid for offers (bypasses RLS)
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

-- Helper to check if RFQ belongs to a company (bypasses RLS)
CREATE OR REPLACE FUNCTION is_rfq_owned_by_company(rid UUID, cid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM rfqs
    WHERE id = rid 
      AND company_id = cid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY profiles_insert_own ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_update_own ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- COMPANIES
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- User can see their own companies
CREATE POLICY companies_select_member ON companies FOR SELECT
  USING (
    deleted_at IS NULL 
    AND is_company_member(auth.uid(), id)
  );

-- Buyer can see supplier companies that made offers on their RFQs
CREATE POLICY companies_select_offer_supplier ON companies FOR SELECT
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM offers o
      JOIN rfqs r ON r.id = o.rfq_id
      WHERE o.company_id = companies.id
        AND o.deleted_at IS NULL
        AND is_company_member(auth.uid(), r.company_id)
    )
  );

CREATE POLICY companies_insert ON companies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY companies_update ON companies FOR UPDATE
  USING (is_company_member(auth.uid(), id))
  WITH CHECK (is_company_member(auth.uid(), id));

-- COMPANY MEMBERS
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY company_members_select ON company_members FOR SELECT
  USING (
    company_id IN (SELECT get_user_company_ids(auth.uid()))
  );

CREATE POLICY company_members_insert ON company_members FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
  );

CREATE POLICY company_members_insert_by_owner ON company_members FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM company_members 
      WHERE company_id = company_members.company_id 
        AND user_id = auth.uid() 
        AND role = 'owner'
    )
  );

-- CATEGORIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_select ON categories FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- RFQS
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY rfqs_select_public ON rfqs FOR SELECT
  USING (
    deleted_at IS NULL 
    AND auth.uid() IS NOT NULL
  );

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

CREATE POLICY rfqs_update ON rfqs FOR UPDATE
  USING (is_company_member(auth.uid(), company_id))
  WITH CHECK (is_company_member(auth.uid(), company_id));

-- RFQ FILES
ALTER TABLE rfq_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY rfq_files_select ON rfq_files FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND r.deleted_at IS NULL 
        AND auth.uid() IS NOT NULL
    )
  );

CREATE POLICY rfq_files_insert ON rfq_files FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND is_company_member(auth.uid(), r.company_id)
    )
  );

CREATE POLICY rfq_files_delete ON rfq_files FOR DELETE
  USING (
    EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND is_company_member(auth.uid(), r.company_id)
    )
  );

-- OFFERS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY offers_select_own ON offers FOR SELECT
  USING (
    deleted_at IS NULL 
    AND is_company_member(auth.uid(), company_id)
  );

CREATE POLICY offers_select_buyer ON offers FOR SELECT
  USING (
    deleted_at IS NULL
    AND EXISTS(
      SELECT 1 FROM rfqs r
      WHERE r.id = rfq_id 
        AND is_company_member(auth.uid(), r.company_id)
    )
  );

CREATE POLICY offers_insert ON offers FOR INSERT
  WITH CHECK (
    is_company_member(auth.uid(), company_id)
    AND is_valid_supplier_company(company_id)
    AND is_rfq_open_for_offers(rfq_id)
    AND NOT is_rfq_owned_by_company(rfq_id, company_id)
  );

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

-- TERMS ACCEPTANCES
ALTER TABLE terms_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY terms_acceptances_select ON terms_acceptances FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY terms_acceptances_insert ON terms_acceptances FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- RPC FUNCTIONS
-- ============================================

-- Complete registration: create company and add user as owner
-- Called after auth.signUp() to bypass RLS issues
CREATE OR REPLACE FUNCTION complete_registration(
  p_user_id UUID,
  p_company_name TEXT,
  p_company_description TEXT DEFAULT NULL,
  p_industry TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
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
  INSERT INTO companies (name, description, industry, location, buyer_enabled, supplier_enabled)
  VALUES (p_company_name, p_company_description, p_industry, p_location, p_buyer_enabled, p_supplier_enabled)
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

-- ============================================
-- SEED DATA - Categories
-- ============================================

INSERT INTO categories (name) VALUES
  ('Электроника и комплектующие'),
  ('Сырьё и материалы'),
  ('Производственное оборудование'),
  ('Офисные товары'),
  ('IT-услуги'),
  ('Профессиональные услуги'),
  ('Строительные материалы'),
  ('Упаковка и логистика'),
  ('Продукты питания'),
  ('Текстиль и одежда'),
  ('Химическая продукция'),
  ('Автозапчасти'),
  ('Медицинские товары'),
  ('Промышленный инструмент'),
  ('Энергетика и коммунальные услуги'),
  ('Транспорт и перевозки'),
  ('Маркетинг и реклама'),
  ('Программное обеспечение'),
  ('Техническое обслуживание'),
  ('Другое')
ON CONFLICT (name) DO NOTHING;
