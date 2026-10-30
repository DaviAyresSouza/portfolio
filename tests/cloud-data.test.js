const {test}=require('node:test');const assert=require('node:assert/strict');
const {create,validate,validPath}=require('../cloud-data.js');
const fields={title:'Meu projeto',description:'Vídeo & conexão',category:'Vídeos',year:2026,published:false};
const file={name:'teste.mp4',type:'video/mp4',size:1024};
const owner='1d77534c-632a-42a7-ae4e-cbb9e136c8c7';
function mock({dbError=false,uploadErrorAt=0,admin=true}={}){
 let uploads=[],removed=[],inserted=[],writes=0;
 const client={auth:{getUser:async()=>({data:{user:{id:owner}}}),signInWithPassword:async()=>({data:{}}),signOut:async()=>({}),onAuthStateChange:()=>({})},storage:{from:()=>({upload:async(path,f)=>{uploads.push(path);return uploadErrorAt===uploads.length?{error:Error('upload falhou')}:{data:{path}};},remove:async(paths)=>{removed.push(...paths);return {};}})},from:table=>{
  if(table==='portfolio_admins')return {select:()=>({eq:()=>({maybeSingle:async()=>({data:admin?{user_id:owner}:null})})})};
  return {insert:row=>{inserted.push(row);writes++;return {select:()=>({single:async()=>dbError?{error:Error('banco falhou')}:{data:{id:row.id}}})}}};
 }};
 return {api:create({url:'https://example.supabase.co',publishableKey:'public-test'},{createClient:()=>client}),uploads,removed,inserted,get writes(){return writes;}};
}
test('validação preserva oculto e rejeita formatos, tamanhos e campos inválidos',()=>{
 assert.equal(validate(fields,[file]).published,false);
 assert.throws(()=>validate({...fields,title:'  '},[file]));
 assert.throws(()=>validate(fields,[{...file,type:'text/html'}]));
 assert.throws(()=>validate(fields,[{...file,size:51*1024*1024}]));
 assert.throws(()=>validate(fields,Array.from({length:21},()=>file)));
 assert.throws(()=>validate(fields,[]));
 assert.equal(validate(fields,[],[{path:'exists'}]).title,'Meu projeto');
});
test('caminhos de mídia rejeitam travessia e URLs externas',()=>{
 assert.equal(validPath(`${owner}/${owner}/${owner}.pdf`),true);
 for(const path of ['../file.png','https://evil.test/a.png',`${owner}/../../a.png`])assert.equal(validPath(path),false);
});
test('salva só depois dos uploads, com dono autenticado e oculto por padrão',async()=>{
 const m=mock();await m.api.save(fields,[file]);assert.equal(m.writes,1);assert.equal(m.inserted[0].owner_id,owner);assert.equal(m.inserted[0].published,false);assert.equal(m.inserted[0].media[0].path,m.uploads[0]);assert.equal(m.removed.length,0);
});
test('falha de banco desfaz uploads sem reportar sucesso',async()=>{
 const m=mock({dbError:true});await assert.rejects(m.api.save(fields,[file]),/banco falhou/);assert.deepEqual(m.removed,m.uploads);
});
test('falha no segundo upload desfaz o primeiro e não cria projeto',async()=>{
 const m=mock({uploadErrorAt:2});await assert.rejects(m.api.save(fields,[file,file]),/upload falhou/);assert.equal(m.writes,0);assert.deepEqual(m.removed,[m.uploads[0]]);
});
test('usuário sem permissão não inicia upload nem grava no banco',async()=>{
 const m=mock({admin:false});await assert.rejects(m.api.save(fields,[file]),/permissão/);assert.equal(m.uploads.length,0);assert.equal(m.writes,0);
});
