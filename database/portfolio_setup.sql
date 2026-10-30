-- Área independente para o portfólio; não altera workspaces nem workos-media.
begin;
create table public.portfolio_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
create policy portfolio_admin_self on public.portfolio_admins for select to authenticated
 using (user_id = (select auth.uid()));
insert into public.portfolio_admins(user_id)
 select id from auth.users where lower(email)='davi.ayressouza@gmail.com' and email_confirmed_at is not null;
do $$ begin
 if not exists (select 1 from public.portfolio_admins) then raise exception 'Administrador confirmado não encontrado.'; end if;
end $$;

create table public.portfolio_projects (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 title text not null check(char_length(btrim(title)) between 1 and 80),
 category text not null check(category in ('Posts','Carrosséis','Identidades','Vídeos','Digital')),
 year integer not null check(year between 2000 and 2100),
 description text not null default '' check(char_length(description)<=1500),
 media jsonb not null check(jsonb_typeof(media)='array' and jsonb_array_length(media) between 1 and 20),
 published boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index portfolio_projects_published_date on public.portfolio_projects(published,created_at desc);
create index portfolio_projects_owner on public.portfolio_projects(owner_id);
alter table public.portfolio_projects enable row level security;
revoke all on public.portfolio_projects from anon, authenticated;
grant select on public.portfolio_projects to anon;
grant select,insert,update on public.portfolio_projects to authenticated;
create policy portfolio_public_read on public.portfolio_projects for select to anon,authenticated using (published);
create policy portfolio_owner_read on public.portfolio_projects for select to authenticated
 using (owner_id=(select auth.uid()) and exists(select 1 from public.portfolio_admins where user_id=(select auth.uid())));
create policy portfolio_owner_insert on public.portfolio_projects for insert to authenticated
 with check (owner_id=(select auth.uid()) and exists(select 1 from public.portfolio_admins where user_id=(select auth.uid())));
create policy portfolio_owner_update on public.portfolio_projects for update to authenticated
 using (owner_id=(select auth.uid()) and exists(select 1 from public.portfolio_admins where user_id=(select auth.uid())))
 with check (owner_id=(select auth.uid()) and exists(select 1 from public.portfolio_admins where user_id=(select auth.uid())));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('portfolio-media','portfolio-media',false,52428800,array['image/jpeg','image/png','image/webp','video/mp4','video/webm','application/pdf']);
create policy portfolio_media_public_read on storage.objects for select to anon,authenticated
 using (bucket_id='portfolio-media' and exists(
 select 1 from public.portfolio_projects p where p.published
 and p.media @> jsonb_build_array(jsonb_build_object('path',storage.objects.name))));
create policy portfolio_media_owner_read on storage.objects for select to authenticated
 using (bucket_id='portfolio-media' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.portfolio_admins where user_id=(select auth.uid())));
create policy portfolio_media_owner_insert on storage.objects for insert to authenticated
 with check (bucket_id='portfolio-media' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.portfolio_admins where user_id=(select auth.uid())));
-- Exclusão serve apenas para desfazer uploads que falharem antes de salvar o projeto.
create policy portfolio_media_owner_delete on storage.objects for delete to authenticated
 using (bucket_id='portfolio-media' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.portfolio_admins where user_id=(select auth.uid())));
commit;
