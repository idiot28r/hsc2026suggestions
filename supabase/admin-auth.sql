-- ─────────────────────────────────────────────────────────────────────────────
--  Custom admin authentication (no Supabase Auth).
--  Admins are stored in `admin_users` (username + bcrypt password hash). Login
--  issues a session token (admin_sessions). Content writes go through the
--  SECURITY DEFINER functions below, which verify the token before touching the
--  whitelisted content tables — so RLS can block ALL direct writes from the anon
--  key while admins still edit through these vetted functions.
--
--  Run once (after schema.sql). Create the first admin with:
--    select admin_create_user('myusername', 'my-strong-password');
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

create table if not exists admin_users (
  username      text primary key,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

create table if not exists admin_sessions (
  token      uuid primary key default gen_random_uuid(),
  username   text not null references admin_users(username) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
);

-- RLS on, NO policies → the anon/authenticated roles get ZERO direct access to
-- these tables. Only the SECURITY DEFINER functions below can read/write them.
alter table admin_users    enable row level security;
alter table admin_sessions enable row level security;

-- ── Account management (call from the SQL editor / service role) ──────────────
create or replace function admin_create_user(p_username text, p_password text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into admin_users(username, password_hash)
  values (p_username, extensions.crypt(p_password, extensions.gen_salt('bf')))
  on conflict (username) do update set password_hash = excluded.password_hash;
end; $$;

-- ── Login / session ───────────────────────────────────────────────────────────
create or replace function admin_login(p_username text, p_password text)
returns text language plpgsql security definer set search_path = public as $$
declare v_hash text; v_token uuid;
begin
  select password_hash into v_hash from admin_users where username = p_username;
  if v_hash is null or v_hash <> extensions.crypt(p_password, v_hash) then
    return null;
  end if;
  insert into admin_sessions(username) values (p_username) returning token into v_token;
  return v_token::text;
end; $$;

create or replace function admin_valid(p_token text)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from admin_sessions where token = p_token::uuid and expires_at > now());
$$;

create or replace function admin_logout(p_token text)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from admin_sessions where token = p_token::uuid;
end; $$;

create or replace function _admin_require(p_token text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists(
    select 1 from admin_sessions where token = p_token::uuid and expires_at > now()
  ) then
    raise exception 'unauthorized';
  end if;
end; $$;

-- ── Content writes (token-gated, whitelisted tables) ──────────────────────────
create or replace function admin_insert(p_token text, p_table text, p_data jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform _admin_require(p_token);
  if p_table not in ('subjects','sections','chapters','topics') then raise exception 'invalid table'; end if;
  execute (
    select format('insert into %I (%s) values (%s)', p_table,
                  string_agg(quote_ident(key), ','),
                  string_agg(quote_nullable(value), ','))
    from jsonb_each_text(p_data)
  );
end; $$;

create or replace function admin_update(p_token text, p_table text, p_id text, p_patch jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare v_set text;
begin
  perform _admin_require(p_token);
  if p_table not in ('subjects','sections','chapters','topics') then raise exception 'invalid table'; end if;
  select string_agg(format('%I = %s', key, quote_nullable(value)), ', ') into v_set
  from jsonb_each_text(p_patch);
  if v_set is null then return; end if;
  execute format('update %I set %s where id = %L', p_table, v_set, p_id);
end; $$;

create or replace function admin_delete(p_token text, p_table text, p_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform _admin_require(p_token);
  if p_table not in ('subjects','sections','chapters','topics') then raise exception 'invalid table'; end if;
  execute format('delete from %I where id = %L', p_table, p_id);
end; $$;

-- The anon role may CALL these; the in-function token check is the real gate.
-- admin_create_user is intentionally NOT granted to anon (service-role only).
grant execute on function admin_login(text, text)            to anon, authenticated;
grant execute on function admin_valid(text)                  to anon, authenticated;
grant execute on function admin_logout(text)                 to anon, authenticated;
grant execute on function admin_insert(text, text, jsonb)    to anon, authenticated;
grant execute on function admin_update(text, text, text, jsonb) to anon, authenticated;
grant execute on function admin_delete(text, text, text)     to anon, authenticated;
