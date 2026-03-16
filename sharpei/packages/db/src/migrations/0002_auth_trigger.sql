-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR (Dashboard → SQL Editor)
-- The pooler connection cannot access auth schema.
-- ============================================================

-- Trigger: When public.users row changes, sync claims to auth.users.raw_app_meta_data
-- This ensures the JWT always has up-to-date org_id, role, vendor_id

CREATE OR REPLACE FUNCTION public.sync_user_claims()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object(
      'org_id', NEW.org_id::text,
      'role', NEW.role,
      'vendor_id', NEW.vendor_id::text
    )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_change_sync_claims ON public.users;
CREATE TRIGGER on_user_change_sync_claims
  AFTER INSERT OR UPDATE OF org_id, role, vendor_id
  ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_claims();
