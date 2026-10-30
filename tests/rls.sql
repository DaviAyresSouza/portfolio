-- Teste de integração: transação revertida, sem dados persistentes.
begin;
insert into public.portfolio_projects(id,owner_id,title,category,year,media,published)
values
 ('00000000-0000-4000-a000-000000000011','1d77534c-632a-42a7-ae4e-cbb9e136c8c7','TESTE RLS publicado','Posts',2026,'[{"path":"1d77534c-632a-42a7-ae4e-cbb9e136c8c7/00000000-0000-4000-a000-000000000011/00000000-0000-4000-a000-000000000001.png","type":"image/png"}]',true),
 ('00000000-0000-4000-a000-000000000012','1d77534c-632a-42a7-ae4e-cbb9e136c8c7','TESTE RLS oculto','Posts',2026,'[{"path":"1d77534c-632a-42a7-ae4e-cbb9e136c8c7/00000000-0000-4000-a000-000000000012/00000000-0000-4000-a000-000000000002.png","type":"image/png"}]',false);
insert into storage.objects(bucket_id,name) values
 ('portfolio-media','1d77534c-632a-42a7-ae4e-cbb9e136c8c7/00000000-0000-4000-a000-000000000011/00000000-0000-4000-a000-000000000001.png'),
 ('portfolio-media','1d77534c-632a-42a7-ae4e-cbb9e136c8c7/00000000-0000-4000-a000-000000000012/00000000-0000-4000-a000-000000000002.png');
set local role anon;
do $$ begin
 if (select count(*) from public.portfolio_projects where title like 'TESTE RLS%')<>1 then raise exception 'Anon viu rascunho'; end if;
 if (select count(*) from storage.objects where bucket_id='portfolio-media' and name like '%00000000-0000-4000-a000-%')<>1 then raise exception 'Anon leu mídia oculta'; end if;
 begin
  insert into public.portfolio_projects(title,category,year,media) values('negado','Posts',2026,'[{}]');
  raise exception 'Anon conseguiu escrever';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-a000-000000000099","role":"authenticated"}',true);
do $$ declare affected integer; begin
 if (select count(*) from public.portfolio_admins)<>0 then raise exception 'Não-admin viu admin'; end if;
 update public.portfolio_projects set title='invasor' where id='00000000-0000-4000-a000-000000000011';
 get diagnostics affected=row_count;if affected<>0 then raise exception 'Não-admin alterou projeto'; end if;
 begin
  insert into public.portfolio_projects(owner_id,title,category,year,media) values('1d77534c-632a-42a7-ae4e-cbb9e136c8c7','negado','Posts',2026,'[{}]');
  raise exception 'Não-admin inseriu projeto';
 exception when insufficient_privilege then null; end;
 begin
  insert into storage.objects(bucket_id,name) values('portfolio-media','00000000-0000-4000-a000-000000000099/test.png');
  raise exception 'Não-admin enviou mídia';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims','{"sub":"1d77534c-632a-42a7-ae4e-cbb9e136c8c7","role":"authenticated"}',true);
do $$ declare affected integer; begin
 if (select count(*) from public.portfolio_admins)<>1 then raise exception 'Admin não reconhecido'; end if;
 if (select count(*) from public.portfolio_projects where title like 'TESTE RLS%')<>2 then raise exception 'Admin não viu oculto'; end if;
 update public.portfolio_projects set published=true where id='00000000-0000-4000-a000-000000000012';
 get diagnostics affected=row_count;if affected<>1 then raise exception 'Admin não publicou'; end if;
 begin
  update public.portfolio_projects set owner_id='00000000-0000-4000-a000-000000000099' where id='00000000-0000-4000-a000-000000000012';
  raise exception 'Admin transferiu titularidade';
 exception when insufficient_privilege then null; end;
 insert into storage.objects(bucket_id,name) values('portfolio-media','1d77534c-632a-42a7-ae4e-cbb9e136c8c7/test-rls.png');
 begin
  insert into storage.objects(bucket_id,name) values('portfolio-media','00000000-0000-4000-a000-000000000099/forged.png');
  raise exception 'Admin usou pasta alheia';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
