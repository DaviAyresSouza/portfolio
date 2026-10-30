/* Supabase: autenticação real, RLS no servidor e arquivos privados. */
(function(root){
'use strict';
const TYPES={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/webm':'webm','application/pdf':'pdf'};
const CATEGORIES=['Posts','Carrosséis','Identidades','Vídeos','Digital'];
const MAX_FILE=50*1024*1024,MAX_TOTAL=150*1024*1024;
function validate(fields,files,existing=[]){
 const title=String(fields.title||'').trim(),description=String(fields.description||'').trim(),year=Number(fields.year);
 if(!title||title.length>80)throw Error('Informe um título de até 80 caracteres.');
 if(!CATEGORIES.includes(fields.category))throw Error('Escolha uma categoria válida.');
 if(!Number.isInteger(year)||year<2000||year>2100)throw Error('Informe um ano entre 2000 e 2100.');
 if(description.length>1500)throw Error('Use até 1.500 caracteres na descrição.');
 if((files.length||existing.length)<1||files.length>20)throw Error('Selecione de 1 a 20 arquivos.');
 if(files.some(f=>!TYPES[f.type]))throw Error('Use JPG, PNG, WebP, MP4, WebM ou PDF.');
 if(files.some(f=>!f.size||f.size>MAX_FILE))throw Error('Cada arquivo deve ter conteúdo e no máximo 50 MB.');
 if(files.reduce((sum,f)=>sum+f.size,0)>MAX_TOTAL)throw Error('Envie até 150 MB por projeto.');
 return {title,description,year,category:fields.category,published:!!fields.published};
}
function validPath(path){return typeof path==='string'&&/^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp|mp4|webm|pdf)$/.test(path);}
function create(config,library){
 if(!config?.url||!config?.publishableKey||!library?.createClient)throw Error('Não foi possível iniciar o armazenamento online. Atualize a página.');
 const client=library.createClient(config.url,config.publishableKey,{auth:{persistSession:false,detectSessionInUrl:false,autoRefreshToken:true}});
 const bucket=client.storage.from('portfolio-media');
 const check=r=>{if(r.error)throw r.error;return r.data;};
 async function admin(){
  const {data,error}=await client.auth.getUser();if(error||!data?.user)throw Error('Entre novamente para salvar.');
  const row=check(await client.from('portfolio_admins').select('user_id').eq('user_id',data.user.id).maybeSingle());
  if(!row)throw Error('Esta conta não tem permissão para editar o portfólio.');return data.user;
 }
 async function login(email,password){
  const r=await client.auth.signInWithPassword({email,password});
  if(r.error)throw Error('Não foi possível entrar. Confira o e-mail e a senha cadastrados no aplicativo.');
  try{return await admin();}catch(e){await client.auth.signOut({scope:'local'});throw e;}
 }
 async function list(all=false){
  if(all)await admin();
  // Paginação evita sumir com projetos ao atingir o limite padrão da API.
  const rows=[];for(let page=0;page<100;page++){
   let query=client.from('portfolio_projects').select('id,title,category,year,description,media,published,created_at').order('created_at',{ascending:false}).order('id').range(page*100,page*100+99);
   if(!all)query=query.eq('published',true);
   const batch=check(await query);rows.push(...batch);if(batch.length<100)break;
  }
  const paths=[...new Set(rows.flatMap(p=>(Array.isArray(p.media)?p.media:[]).filter(m=>validPath(m.path)&&TYPES[m.type]).map(m=>m.path)))];
  const signed=new Map();for(let i=0;i<paths.length;i+=100){
   const urls=check(await bucket.createSignedUrls(paths.slice(i,i+100),3600));
   for(const v of urls||[]){if(v.signedUrl&&!v.error){const u=new URL(v.signedUrl);if(u.origin===new URL(config.url).origin)signed.set(v.path,u.href);}}
  }
  return rows.map(p=>({...p,cloud:true,media:(p.media||[]).filter(m=>validPath(m.path)&&TYPES[m.type]).map(m=>({...m,data:signed.get(m.path)||null}))}));
 }
 async function save(fields,files,old=null,onProgress=()=>{}){
  const user=await admin(),data=validate(fields,files,old?.media),id=old?.id||crypto.randomUUID(),uploaded=[];
  try{
   let media=old?.media?.map(({type,name,path,size})=>({type,name,path,size}))||[];
   if(files.length){media=[];for(let i=0;i<files.length;i++){
    const f=files[i],path=`${user.id}/${id}/${crypto.randomUUID()}.${TYPES[f.type]}`;
    onProgress(`Enviando arquivo ${i+1} de ${files.length}…`);
    check(await bucket.upload(path,f,{contentType:f.type,cacheControl:'3600',upsert:false}));
    uploaded.push(path);media.push({type:f.type,name:f.name.slice(0,255),path,size:f.size});
   }}
   const record={...data,media,updated_at:new Date().toISOString()};
   onProgress('Salvando projeto…');
   const query=old?client.from('portfolio_projects').update(record).eq('id',id):client.from('portfolio_projects').insert({...record,id,owner_id:user.id});
   check(await query.select('id').single());return id;
  }catch(e){if(uploaded.length)await bucket.remove(uploaded);throw e;}
 }
 async function publish(id,published){await admin();check(await client.from('portfolio_projects').update({published,updated_at:new Date().toISOString()}).eq('id',id).select('id').single());}
 async function logout(){const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;}
 return {login,logout,admin,list,save,publish,onSignedOut:callback=>client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')callback();})};
}
root.PortfolioCloud={create,validate,validPath};
if(typeof module==='object')module.exports={create,validate,validPath};
})(typeof window!=='undefined'?window:globalThis);
