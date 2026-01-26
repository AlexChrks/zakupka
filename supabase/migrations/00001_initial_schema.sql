-- ============================================
-- B2B RFQ Platform - Initial Schema Migration
-- ============================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE company_role AS ENUM ('owner', 'member');
CREATE TYPE rfq_status AS ENUM ('open', 'completed', 'cancelled');

-- ============================================
-- TABLES
-- ============================================

-- Profiles - Links to auth.users, optional app-specific fields
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

-- Company Members - Junction table linking users to companies with roles
CREATE TABLE company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role company_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- Categories - Predefined + extensible RFQ categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RFQs - Request for Quotations
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
  
  -- Ensure budget_max >= budget_min if both are set
  CONSTRAINT budget_range_check CHECK (
    budget_min IS NULL OR budget_max IS NULL OR budget_max >= budget_min
  )
);

-- RFQ Files - Attachments for RFQs
CREATE TABLE rfq_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Offers - Supplier offers on RFQs
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
  
  -- One offer per supplier per RFQ
  UNIQUE(rfq_id, company_id),
  
  -- Price must be positive
  CONSTRAINT price_positive CHECK (price > 0),
  
  -- Delivery days must be positive if set
  CONSTRAINT delivery_days_positive CHECK (delivery_days IS NULL OR delivery_days > 0)
);

-- Terms Acceptances - Track T&C acceptance
CREATE TABLE terms_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

-- Companies indexes
CREATE INDEX idx_companies_deleted ON companies(deleted_at) WHERE deleted_at IS NULL;

-- Company members indexes
CREATE INDEX idx_company_members_company ON company_members(company_id);
CREATE INDEX idx_company_members_user ON company_members(user_id);

-- RFQs indexes for filtering
CREATE INDEX idx_rfqs_status ON rfqs(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_rfqs_company ON rfqs(company_id);
CREATE INDEX idx_rfqs_deadline ON rfqs(deadline) WHERE deleted_at IS NULL;
CREATE INDEX idx_rfqs_category ON rfqs(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_rfqs_created ON rfqs(created_at DESC) WHERE deleted_at IS NULL;

-- RFQ files indexes
CREATE INDEX idx_rfq_files_rfq ON rfq_files(rfq_id);

-- Offers indexes
CREATE INDEX idx_offers_rfq ON offers(rfq_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_offers_company ON offers(company_id);

-- Ensure only one winner per RFQ (partial unique index)
CREATE UNIQUE INDEX idx_offers_single_winner 
  ON offers(rfq_id) 
  WHERE is_selected = true AND deleted_at IS NULL;

-- Terms acceptances index
CREATE INDEX idx_terms_acceptances_user ON terms_acceptances(user_id);

-- ============================================
-- TRIGGERS - Auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
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

-- ============================================
-- TRIGGER - Auto-create profile on user signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
