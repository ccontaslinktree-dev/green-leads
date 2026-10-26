-- Credential content is provisioned separately into encrypted Supabase Vault.
-- Never put a token into a migration, VITE_* variable, or a browser component.
create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;
grant usage on schema app_private to service_role;

create or replace function app_private.office_meta_token()
returns text language sql stable security definer set search_path = ''
as $$
  select decrypted_secret from vault.decrypted_secrets
  where name = 'office_ia_meta_access_token' limit 1;
$$;
revoke all on function app_private.office_meta_token() from public, anon, authenticated;
grant execute on function app_private.office_meta_token() to service_role;

create or replace function public.office_meta_token()
returns text language sql stable security invoker set search_path = ''
as $$ select app_private.office_meta_token(); $$;
revoke all on function public.office_meta_token() from public, anon, authenticated;
grant execute on function public.office_meta_token() to service_role;
