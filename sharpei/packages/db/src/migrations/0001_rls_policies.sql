-- Sharpei RLS Policies
-- Phase 1: Auth + RBAC
-- NOTE: Helper functions (public.get_org_id, etc.) use auth.jwt() which is built into Supabase.
-- The trigger and auth schema functions are in 0002_auth_functions.sql (must be run via Supabase SQL Editor).

-- ============================================================
-- 1. Helper functions in PUBLIC schema (accessible via pooler)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_org_id()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'viewer'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_vendor_id()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'vendor_id')::uuid;
$$;

-- ============================================================
-- 2. Enable RLS on all tables
-- ============================================================

ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_types_config ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. RLS Policies — Org Isolation + Vendor Scoping
-- ============================================================

-- ORGS: users can only see their own org
CREATE POLICY orgs_select ON public.orgs FOR SELECT
  USING (id = public.get_org_id());

CREATE POLICY orgs_update ON public.orgs FOR UPDATE
  USING (id = public.get_org_id());

-- USERS: org isolation
CREATE POLICY users_select ON public.users FOR SELECT
  USING (org_id = public.get_org_id());

CREATE POLICY users_insert ON public.users FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

CREATE POLICY users_update ON public.users FOR UPDATE
  USING (org_id = public.get_org_id());

CREATE POLICY users_delete ON public.users FOR DELETE
  USING (org_id = public.get_org_id());

-- VENDORS: org isolation
CREATE POLICY vendors_select ON public.vendors FOR SELECT
  USING (org_id = public.get_org_id());

CREATE POLICY vendors_insert ON public.vendors FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

CREATE POLICY vendors_update ON public.vendors FOR UPDATE
  USING (org_id = public.get_org_id());

CREATE POLICY vendors_delete ON public.vendors FOR DELETE
  USING (org_id = public.get_org_id());

-- CUSTOMERS: org isolation
CREATE POLICY customers_select ON public.customers FOR SELECT
  USING (org_id = public.get_org_id());

CREATE POLICY customers_insert ON public.customers FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

CREATE POLICY customers_update ON public.customers FOR UPDATE
  USING (org_id = public.get_org_id());

CREATE POLICY customers_delete ON public.customers FOR DELETE
  USING (org_id = public.get_org_id());

-- APPLICATIONS: org isolation + vendor scoping
CREATE POLICY applications_select ON public.applications FOR SELECT
  USING (
    org_id = public.get_org_id()
    AND (
      public.get_vendor_id() IS NULL
      OR vendor_id = public.get_vendor_id()
    )
  );

CREATE POLICY applications_insert ON public.applications FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

CREATE POLICY applications_update ON public.applications FOR UPDATE
  USING (org_id = public.get_org_id());

CREATE POLICY applications_delete ON public.applications FOR DELETE
  USING (org_id = public.get_org_id());

-- DOCUMENTS: org isolation + vendor scoping via application
CREATE POLICY documents_select ON public.documents FOR SELECT
  USING (
    org_id = public.get_org_id()
    AND (
      public.get_vendor_id() IS NULL
      OR application_id IN (
        SELECT id FROM public.applications
        WHERE vendor_id = public.get_vendor_id()
      )
    )
  );

CREATE POLICY documents_insert ON public.documents FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

CREATE POLICY documents_update ON public.documents FOR UPDATE
  USING (org_id = public.get_org_id());

CREATE POLICY documents_delete ON public.documents FOR DELETE
  USING (org_id = public.get_org_id());

-- AUTOMATIONS: org isolation (no vendor access)
CREATE POLICY automations_select ON public.automations FOR SELECT
  USING (
    org_id = public.get_org_id()
    AND public.get_vendor_id() IS NULL
  );

CREATE POLICY automations_insert ON public.automations FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

CREATE POLICY automations_update ON public.automations FOR UPDATE
  USING (org_id = public.get_org_id());

CREATE POLICY automations_delete ON public.automations FOR DELETE
  USING (org_id = public.get_org_id());

-- AUTOMATION EXECUTIONS: org isolation (no vendor access)
CREATE POLICY automation_executions_select ON public.automation_executions FOR SELECT
  USING (
    org_id = public.get_org_id()
    AND public.get_vendor_id() IS NULL
  );

-- AUDIT LOG: org isolation (no vendor access)
CREATE POLICY audit_log_select ON public.audit_log FOR SELECT
  USING (
    org_id = public.get_org_id()
    AND public.get_vendor_id() IS NULL
  );

CREATE POLICY audit_log_insert ON public.audit_log FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

-- INVITATIONS: org isolation
CREATE POLICY invitations_select ON public.invitations FOR SELECT
  USING (org_id = public.get_org_id());

CREATE POLICY invitations_insert ON public.invitations FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

CREATE POLICY invitations_update ON public.invitations FOR UPDATE
  USING (org_id = public.get_org_id());

CREATE POLICY invitations_delete ON public.invitations FOR DELETE
  USING (org_id = public.get_org_id());

-- KNOWLEDGE BASE: org isolation (no vendor access)
CREATE POLICY knowledge_base_select ON public.knowledge_base FOR SELECT
  USING (
    org_id = public.get_org_id()
    AND public.get_vendor_id() IS NULL
  );

CREATE POLICY knowledge_base_insert ON public.knowledge_base FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

CREATE POLICY knowledge_base_update ON public.knowledge_base FOR UPDATE
  USING (org_id = public.get_org_id());

CREATE POLICY knowledge_base_delete ON public.knowledge_base FOR DELETE
  USING (org_id = public.get_org_id());

-- AI INTERACTIONS: org isolation
CREATE POLICY ai_interactions_select ON public.ai_interactions FOR SELECT
  USING (org_id = public.get_org_id());

CREATE POLICY ai_interactions_insert ON public.ai_interactions FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

-- APPLICATION TYPES CONFIG: org isolation
CREATE POLICY app_types_config_select ON public.application_types_config FOR SELECT
  USING (org_id = public.get_org_id());

CREATE POLICY app_types_config_insert ON public.application_types_config FOR INSERT
  WITH CHECK (org_id = public.get_org_id());

CREATE POLICY app_types_config_update ON public.application_types_config FOR UPDATE
  USING (org_id = public.get_org_id());

CREATE POLICY app_types_config_delete ON public.application_types_config FOR DELETE
  USING (org_id = public.get_org_id());
