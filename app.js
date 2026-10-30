(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const demoProjects=[
{id:'forma',title:'Forma — uma identidade natural',category:'Identidades',year:2026,art:'forma',description:'Estudo demonstrativo de uma marca conceitual. Composição tipográfica, paleta e aplicações para apresentar como uma identidade visual poderá aparecer no portfólio.',slides:3},
{id:'social',title:'Presença que chama a atenção',category:'Posts',year:2026,art:'post',description:'Composição demonstrativa de campanha para redes sociais, explorando contraste, hierarquia visual e tipografia. Este espaço será substituído por um trabalho real.',slides:1},
{id:'film',title:'Um olhar em movimento',category:'Vídeos',year:2026,art:'film',description:'Prévia demonstrativa criada com um dos retratos enviados para mostrar a experiência do player. Os vídeos produzidos serão adicionados à curadoria definitiva.',slides:1},
{id:'carousel',title:'Conteúdo que faz sentido',category:'Carrosséis',year:2026,art:'carousel',description:'Carrossel demonstrativo de três páginas. Uma sequência de gancho, desenvolvimento e fechamento para visualizar a navegação entre peças.',slides:3},
{id:'digital',title:'Uma marca, uma nova presença',category:'Digital',year:2026,art:'digital',description:'Estudo de apresentação digital com tipografia editorial e elementos visuais de marca. Demonstração de espaço para sites e landing pages.',slides:1},
{id:'editorial',title:'Entre formas e palavras',category:'Posts',year:2026,art:'editorial',description:'Estudo gráfico demonstrativo sobre composição editorial, ritmo e tipografia. Conteúdo temporário para esta primeira versão do portfólio.',slides:1}
];
let panelUnlocked=false, panelBusy=false, editingProject=null, cloud=null;
let userProjects=[],activeFilter='Todos',activeProject=null,slideIndex=0,lastProjectButton=null;
function artMarkup(type,slide=0){
 if(type==='forma')return `<div class="art art-forma" style="${slide===1?'background:#263b2d;color:#e2e7d4':slide===2?'background:#ebe9df':''}"><small>ESTUDO DE IDENTIDADE / 2026</small><div class="forma-mark" style="${slide===1?'border-color:#c9cfb8':''}"></div><div class="forma-word">forma</div><div class="bottom-line"><small>${['NATURAL POR ESSÊNCIA.','UM SISTEMA. MUITAS FORMAS.','DO CONCEITO AO DETALHE.'][slide%3]}</small><div class="mini-card">f.</div></div></div>`;
 if(type==='post')return '<div class="art art-post"><small>EXPERIMENTO VISUAL / SOCIAL</small><div class="sticker">↗</div><h3>MAIS<br>QUE UM<br>POST.</h3><div class="bottom-line"><span>UMA IDEIA QUE FICA.</span><span>01 — 01</span></div></div>';
 if(type==='carousel')return `<div class="art art-carousel"><div class="sheet"><span>CONTEÚDO COM INTENÇÃO</span><h3>${['Não é só<br>sobre<br>aparecer.','É sobre<br>fazer<br>sentido.','E criar<br>conexões<br>de verdade.'][slide%3]}</h3><b>${slide===2?'✳':'↗'}</b><span>DESLIZE PARA CONTINUAR &nbsp; 0${slide+1}/03</span></div></div>`;
 if(type==='digital')return '<div class="art art-digital"><div class="browser-art"><div class="browser-dots">••• <span style="float:right;letter-spacing:0">studio — digital</span></div><div class="digital-orb"></div><h3>Menos ruído.<br>Mais<br>presença.</h3><small>ESTUDO DE EXPERIÊNCIA DIGITAL &nbsp; ↗</small></div></div>';
 if(type==='editorial')return '<div class="art art-editorial"><small>ESTUDO EDITORIAL — VOL. 01</small><div><div class="editorial-rule"></div><h3>entre<br>formas.</h3></div><p>Um exercício sobre espaço, equilíbrio e as possibilidades da palavra.</p><div class="editorial-circle"></div></div>';
 return '<div class="film-cover"><img src="assets/portrait-warm.webp" alt="Retrato de Davi em iluminação cinematográfica" loading="lazy"><div class="film-overlay"><span>▷</span><h3>Um olhar<br>em movimento.</h3><small>PRÉVIA DEMONSTRATIVA / 06 SEGUNDOS</small></div></div>';
}
function currentProjects(){const published=userProjects.filter(p=>p.published);return published.length?published:demoProjects}
function mediaCover(p){
 if(!p.cloud)return artMarkup(p.art);
 const m=p.media[0];if(!m||!m.data)return '<div class="media-placeholder">Prévia indisponível</div>';
 if(m.type==='application/pdf')return '<div class="media-placeholder"><span>PDF</span><strong>'+esc(p.title)+'</strong><small>Explore o projeto ↗</small></div>';
 return m.type.startsWith('video/')?`<video src="${esc(m.data)}" preload="metadata" muted playsinline aria-label="Prévia de ${esc(p.title)}"></video>`:`<img src="${esc(m.data)}" alt="${esc(p.title)}" loading="lazy">`;
}
function renderProjects(){
 const all=currentProjects(),list=all.filter(p=>activeFilter==='Todos'||p.category===activeFilter);
 $('#project-grid').innerHTML=list.map(p=>`<article class="project-card"><button class="project-button" data-id="${esc(p.id)}" aria-label="Abrir projeto: ${esc(p.title)}"><div class="project-cover">${mediaCover(p)}<span class="project-badge">${p.cloud?'PROJETO':'ESTUDO DEMONSTRATIVO'}</span><span class="project-open" aria-hidden="true">↗</span></div><div class="project-caption"><div><h3>${esc(p.title)}</h3><p>${esc(p.category)}${p.category==='Carrosséis'?' · '+(p.cloud?p.media.length:p.slides)+' páginas':''}</p></div><span>${p.year}</span></div></button></article>`).join('');
 $('.empty-state').hidden=!!list.length;$('.work-counter').textContent=list.length?'01 — '+String(list.length).padStart(2,'0'):'00';$('.nav sup').textContent=String(all.length).padStart(2,'0');$('.filters sup').textContent=String(all.length).padStart(2,'0');
 $$('.project-button').forEach(b=>{b.onclick=()=>{lastProjectButton=b;openProject(all.find(p=>p.id===b.dataset.id))};b.onpointerenter=()=>{if(matchMedia('(pointer:fine)').matches)$('.cursor-tag').classList.add('on')};b.onpointerleave=()=>$('.cursor-tag').classList.remove('on')});
 if(window.gsap&&!reduce)gsap.fromTo('.project-card',{opacity:0,y:24},{opacity:1,y:0,duration:.55,stagger:.045,clearProps:'transform,opacity'});
 window.ScrollTrigger?.refresh();
}
$$('[data-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;$$('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderProjects()});
function openProject(p){activeProject=p;slideIndex=0;$('#modal-title').textContent=p.title;$('#modal-category').textContent=p.category.toUpperCase()+' / '+p.year;$('#modal-description').textContent=p.description;$('#modal-note').textContent=p.cloud?'Design e produção por Davi Ayres.':'Conteúdo demonstrativo. Os trabalhos definitivos serão adicionados em breve.';renderSlide();$('#project-dialog').showModal();$('.cursor-tag').classList.remove('on')}
function renderSlide(){const p=activeProject,n=p.cloud?p.media.length:p.slides;let content;
 if(p.cloud){const m=p.media[slideIndex];
  if(!m?.data)content='<div class="media-placeholder">Não foi possível carregar esta mídia. Feche e atualize os projetos.</div>';
  else if(m.type==='application/pdf')content=`<iframe class="project-pdf" src="${esc(m.data)}#toolbar=0&navpanes=0" title="${esc(p.title)} — PDF"></iframe>`;
  else content=m.type.startsWith('video/')?`<video controls controlslist="nodownload noremoteplayback" disablepictureinpicture disableremoteplayback playsinline preload="metadata" src="${esc(m.data)}" aria-label="${esc(p.title)}"></video>`:`<img src="${esc(m.data)}" alt="${esc(p.title)} — imagem ${slideIndex+1}">`;
 }
 else if(p.art==='film')content='<video controls controlslist="nodownload noremoteplayback" disablepictureinpicture disableremoteplayback playsinline preload="metadata" poster="assets/portrait-warm.webp" aria-label="Prévia de movimento com retrato de Davi"><source src="assets/demo-motion.webm" type="video/webm"><source src="assets/demo-motion.mp4" type="video/mp4"></video>';
 else content=artMarkup(p.art,slideIndex);
 $('#modal-media').innerHTML=`<div class="modal-media-frame">${content}</div>`;$('#slide-count').textContent=`${String(slideIndex+1).padStart(2,'0')} / ${String(n).padStart(2,'0')}`;$('#slide-prev').disabled=slideIndex===0;$('#slide-next').disabled=slideIndex===n-1;$('.modal-navigation').hidden=n===1;
}
$('#slide-prev').onclick=()=>{if(slideIndex>0){slideIndex--;renderSlide()}};$('#slide-next').onclick=()=>{if(slideIndex<(activeProject.cloud?activeProject.media.length:activeProject.slides)-1){slideIndex++;renderSlide()}};
$('#project-dialog').addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowRight')$('#slide-next').click();if(e.key==='ArrowLeft')$('#slide-prev').click()});
$$('dialog').forEach(d=>{$('.dialog-close',d).onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});d.addEventListener('close',()=>{$$('video',d).forEach(v=>v.pause());if(d.id==='project-dialog')lastProjectButton?.focus()})});
const toggle=$('.menu-toggle'),menu=$('.mobile-nav');function setMenu(on){menu.classList.toggle('open',on);menu.inert=!on;toggle.setAttribute('aria-expanded',String(on));toggle.setAttribute('aria-label',on?'Fechar menu':'Abrir menu');document.body.style.overflow=on?'hidden':''}
toggle.onclick=()=>setMenu(!menu.classList.contains('open'));$$('a',menu).forEach(a=>a.onclick=()=>setMenu(false));document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});window.addEventListener('resize',()=>{if(innerWidth>700)setMenu(false)});
$('#year').textContent=new Date().getFullYear();
const contactSettings=window.PORTFOLIO_CONTACT||{};
const contactApi=window.PortfolioContact;
function updateContactChannels(){
  const whatsappReady=!!contactApi?.normalizePhone(contactSettings.whatsapp);
  const emailReady=!!contactApi?.normalizeEmail(contactSettings.email);
  $('#send-whatsapp').disabled=!whatsappReady;
  $('#send-email').disabled=!emailReady;
  const notice=$('.contact-availability');
  notice.textContent=whatsappReady&&emailReady?'':(!whatsappReady&&!emailReady?'Os canais de contato estarão disponíveis em breve.':'Um dos canais está temporariamente indisponível. Use a opção disponível.');
  notice.hidden=whatsappReady&&emailReady;
}
$('#brief-open').onclick=()=>{updateContactChannels();$('#brief-dialog').showModal()};
$('#brief-form').onsubmit=e=>{
  e.preventDefault();
  const form=e.target,status=$('.form-status',form);
  const channel=e.submitter?.value||(contactApi?.normalizePhone(contactSettings.whatsapp)?'whatsapp':'email');
  const fields=new FormData(form);
  const data=Object.fromEntries(fields.entries());
  if(!String(data.nome||'').trim()||!String(data.ideia||'').trim()){
    status.textContent='Preencha seu nome e conte um pouco sobre o projeto.';
    return;
  }
  try{
    const url=contactApi.link(channel,contactSettings,data);
    if(channel==='whatsapp'){
      const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';document.body.append(a);a.click();a.remove();
      status.textContent='Continue no WhatsApp para revisar e enviar sua mensagem.';
    }else{
      window.location.href=url;
      status.textContent='Continue no seu aplicativo de e-mail para revisar e enviar. Se ele não abrir, use a opção WhatsApp.';
    }
  }catch(error){status.textContent=error.message||'Não foi possível abrir esse canal. Tente outra opção.'}
};
updateContactChannels();
// Conteúdo online: leitura pública, escrita autorizada por RLS no Supabase.
const publicStatus=$('#cloud-status');let lastRefresh=0,refreshPromise=null;
function errorText(e){
 if(/fetch|network/i.test(e?.message||''))return 'Sem conexão com o armazenamento. Confira sua internet e tente novamente.';
 return e?.message||'Não foi possível concluir. Tente novamente.';
}
async function refreshProjects(){
 if(refreshPromise)return refreshPromise;
 refreshPromise=(async()=>{try{
  const projects=await cloud.list(panelUnlocked);userProjects=projects;lastRefresh=Date.now();renderProjects();
  publicStatus.textContent=projects.some(p=>p.published)?'Trabalhos selecionados':'Curadoria em construção · projetos demonstrativos';
  $('#cloud-retry').hidden=true;$('#project-sync').hidden=true;if(panelUnlocked)manageList();
 }catch(e){publicStatus.textContent='Não foi possível atualizar os projetos online.';$('#cloud-retry').hidden=false;$('#project-sync').hidden=false;throw e;}
 finally{refreshPromise=null;}})();return refreshPromise;
}
function resetProjectForm(){
 editingProject=null;$('#project-form').reset();$('#project-form').elements.year.value=new Date().getFullYear();
 $('#project-form').elements.media.required=true;$('#project-submit').textContent='Salvar projeto';$('#cancel-edit').hidden=true;
 $('#media-help').textContent='JPG, PNG, WebP, MP4, WebM ou PDF · até 50 MB por arquivo · até 20 arquivos';
}
function setBusy(busy){panelBusy=busy;$$('input,select,textarea,button', $('#manager-dialog')).forEach(el=>el.disabled=busy);}
function manageList(){
 $('#manage-list').innerHTML=userProjects.length?userProjects.map(p=>`<div class="manage-item"><div><strong>${esc(p.title)}</strong><small>${esc(p.category)} · ${p.published?'Publicado':'Oculto'}</small></div><div class="manage-item-actions"><button data-edit="${p.id}">Editar</button><button data-publish="${p.id}">${p.published?'Ocultar':'Publicar'}</button></div></div>`).join(''):'<p class="manager-empty">Adicione seu primeiro trabalho. Seus arquivos ficam salvos online.</p>';
 $$('[data-edit]').forEach(b=>b.onclick=()=>{
  if(!panelUnlocked||panelBusy)return;editingProject=userProjects.find(p=>p.id===b.dataset.edit);const f=$('#project-form');
  for(const name of ['title','category','year','description'])f.elements[name].value=editingProject[name];
  f.elements.published.checked=editingProject.published;f.elements.media.value='';f.elements.media.required=false;
  $('#project-submit').textContent='Salvar alterações';$('#cancel-edit').hidden=false;
  $('#media-help').textContent=`${editingProject.media.length} arquivo(s) salvo(s). Deixe vazio para manter; selecione arquivos para substituir todos.`;
  $('.form-status',f).textContent='';f.elements.title.focus();
 });
 $$('[data-publish]').forEach(b=>b.onclick=async()=>{
  if(!panelUnlocked||panelBusy)return;const p=userProjects.find(p=>p.id===b.dataset.publish);setBusy(true);
  try{await cloud.publish(p.id,!p.published);await refreshProjects();$('#manager-status').textContent=p.published?'Projeto ocultado. Ele continua salvo no painel.':'Projeto publicado para os visitantes.';}
  catch(e){$('#manager-status').textContent=errorText(e);}finally{setBusy(false);}
 });
}
function requestPanelAccess(){
 if(panelUnlocked){manageList();$('#manager-dialog').showModal();return;}
 $('#access-form').reset();$('#access-status').textContent='';$('#access-dialog').showModal();$('#panel-password').focus();
}
$('#manage-open').onclick=requestPanelAccess;
$('#access-form').onsubmit=async e=>{
 e.preventDefault();const f=e.target,b=$('button[type=submit]',f),status=$('#access-status');b.disabled=true;status.textContent='Conferindo seu acesso…';
 try{
  if(!cloud)throw Error('Armazenamento indisponível. Atualize a página.');
  await cloud.login(f.elements.email.value.trim(),f.elements.password.value);
  if(!$('#access-dialog').open){await cloud.logout();return;}
  if(refreshPromise)await refreshPromise.catch(()=>{});
  panelUnlocked=true;$('#manager-dialog').inert=false;await refreshProjects();f.reset();$('#access-dialog').close();$('#manager-dialog').showModal();
 }catch(err){panelUnlocked=false;$('#manager-dialog').inert=true;userProjects=userProjects.filter(p=>p.published);renderProjects();if(cloud)await cloud.logout().catch(()=>{});status.textContent=errorText(err);}
 finally{f.elements.password.value='';b.disabled=false;}
};
$('#access-dialog').addEventListener('close',()=>$('#access-form').reset());
function lockPanel(){
 panelUnlocked=false;$('#manager-dialog').close();$('#manager-dialog').inert=true;resetProjectForm();
 $('#manage-list').replaceChildren();userProjects=userProjects.filter(p=>p.published);renderProjects();
}
$('#panel-logout').onclick=async()=>{if(panelBusy)return;lockPanel();await cloud.logout().catch(()=>{});$('#manage-open').focus();};
$('#manager-dialog').addEventListener('cancel',e=>{if(panelBusy)e.preventDefault();});
$('#manager-dialog').addEventListener('click',()=>{if(panelBusy&&!$('#manager-dialog').open)$('#manager-dialog').showModal();});
$('#cancel-edit').onclick=resetProjectForm;
$('#project-form').onsubmit=async e=>{
 e.preventDefault();if(!panelUnlocked||panelBusy)return;const f=e.target,status=$('.form-status',f);
 const fields={title:f.elements.title.value,category:f.elements.category.value,year:f.elements.year.value,description:f.elements.description.value,published:f.elements.published.checked};
 const files=[...f.elements.media.files];setBusy(true);
 try{await cloud.save(fields,files,editingProject,message=>status.textContent=message);resetProjectForm();
  status.textContent=fields.published?'Projeto salvo online e publicado.':'Projeto salvo online como oculto.';
  try{await refreshProjects();}catch{status.textContent+=' Atualize a página para recarregar a lista.';}
 }catch(err){status.textContent=errorText(err);}finally{setBusy(false);}
};
// A importação mantém os antigos rascunhos em formato JSON; nunca publica automaticamente.
$('#import-projects').onchange=async e=>{
 const file=e.target.files[0];if(!file||!panelUnlocked||panelBusy)return;let saved=0;setBusy(true);
 try{
  if(file.size>150*1024*1024)throw Error('Importe um JSON de até 150 MB.');
  const data=JSON.parse(await file.text());
  if(data.format!=='davi-ayres-portfolio'||data.version!==1||!Array.isArray(data.projects)||data.projects.length>100)throw Error('Arquivo de rascunhos inválido.');
  for(const p of data.projects){
   if(!Array.isArray(p.media)||!p.media.length||p.media.length>20)throw Error('Projeto com arquivos inválidos.');
   const files=p.media.map(m=>{
    if(typeof m.data!=='string'||!/^data:(image\/(jpeg|png|webp)|video\/(mp4|webm));base64,[A-Za-z0-9+/=\r\n]+$/.test(m.data)||!m.data.startsWith('data:'+m.type+';base64,')||m.data.length>70*1024*1024)throw Error('Mídia inválida no rascunho.');
    const raw=atob(m.data.split(',')[1]),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));return new File([bytes],String(m.name||'arquivo'),{type:m.type});
   });
   await cloud.save({...p,published:false},files,null,message=>$('#manager-status').textContent=`Projeto ${saved+1}: ${message}`);saved++;
  }
  await refreshProjects();$('#manager-status').textContent=`${saved} projeto(s) importado(s) e salvo(s) online como ocultos. Revise e clique em Publicar.`;
 }catch(err){$('#manager-status').textContent=`${saved} projeto(s) importado(s). ${errorText(err)}`;await refreshProjects().catch(()=>{});}
 finally{e.target.value='';setBusy(false);}
};
$('#cloud-retry').onclick=()=>refreshProjects().catch(()=>{});
renderProjects();
try{cloud=PortfolioCloud.create(window.PORTFOLIO_DATABASE,window.supabase);cloud.onSignedOut(lockPanel);refreshProjects().catch(()=>{});}
catch(e){publicStatus.textContent='O armazenamento online está indisponível.';$('#manage-open').disabled=true;}
// Renova URLs temporárias e busca publicações novas quando o visitante retorna à página.
setInterval(()=>{if(cloud&&!document.hidden&&!panelBusy)refreshProjects().catch(()=>{});},45*60*1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&cloud&&!panelBusy&&Date.now()-lastRefresh>60000)refreshProjects().catch(()=>{});});
// Ondulação leve nas letras, sem filtros ou elementos sobre o cursor.
const heroSurface=$('.hero'),waveMedia=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
const waveLetters=[];
$$('.hero-title h1>span').forEach(line=>{
 [...line.childNodes].forEach(node=>{
  if(node.nodeType!==3)return;
  const fragment=document.createDocumentFragment();
  for(const char of node.textContent){const letter=document.createElement('span');letter.className='wave-letter';letter.textContent=char;fragment.append(letter);waveLetters.push(letter);}
  node.replaceWith(fragment);
 });
});
let waveFrame=0,waveX=0;
function resetWave(){cancelAnimationFrame(waveFrame);waveFrame=0;waveLetters.forEach(el=>el.style.removeProperty('--wave-y'));}
heroSurface.addEventListener('pointermove',e=>{
 if(!waveMedia.matches||e.pointerType==='touch')return;
 waveX=e.clientX;
 if(!waveFrame)waveFrame=requestAnimationFrame(()=>{
  waveLetters.forEach((el,i)=>{const r=el.getBoundingClientRect();const distance=waveX-(r.left+r.width/2);const strength=Math.exp(-Math.pow(distance/300,2));el.style.setProperty('--wave-y',(Math.sin(distance/95+i*.5)*3.5*strength).toFixed(2)+'px');});waveFrame=0;
 });
},{passive:true});
heroSurface.addEventListener('pointerleave',resetWave);
heroSurface.addEventListener('pointercancel',resetWave);
window.addEventListener('blur',resetWave);waveMedia.addEventListener('change',resetWave);
// Movimento: os ritmos, o blur e a resposta ao scroll seguem a linguagem da Bow.
let mx=0,my=0,cx=0,cy=0;document.addEventListener('pointermove',e=>{mx=e.clientX+18;my=e.clientY+18},{passive:true});if(matchMedia('(pointer:fine)').matches&&!reduce){const move=()=>{cx+=(mx-cx)*.22;cy+=(my-cy)*.22;$('.cursor-tag').style.transform=`translate3d(${cx}px,${cy}px,0)`;requestAnimationFrame(move)};move()}
function updateProgress(){$('.nav').classList.toggle('scrolled',scrollY>100);const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-track span').style.height=(max?scrollY/max*100:0)+'%'}window.addEventListener('scroll',updateProgress,{passive:true});
let count=0;const countTimer=setInterval(()=>{count=Math.min(100,count+Math.ceil(Math.random()*10));$('#load-count').textContent=count+'%';if(count===100)clearInterval(countTimer)},70);setTimeout(()=>{$('.loader').remove();clearInterval(countTimer)},2300);
function animate(){if(!window.gsap||reduce)return;const g=gsap;if(window.ScrollTrigger)g.registerPlugin(ScrollTrigger);g.from('.hero-title h1>span',{yPercent:30,rotationX:-25,opacity:0,filter:'blur(14px)',duration:1,stagger:.12,ease:'power4.out',delay:1.45,clearProps:'transform,opacity,filter'});g.from('.hero-photo img',{scale:1.08,opacity:0,duration:1.6,ease:'power3.out',delay:.9});g.from('.hero-bottom>*',{y:25,opacity:0,duration:.8,stagger:.08,delay:1.9,clearProps:'all'});if(window.ScrollTrigger){g.to('.hero-title',{yPercent:-15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});g.to('.hero-photo img',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});$$('h2.reveal').forEach(el=>{const nodes=[...el.childNodes];function split(node){if(node.nodeType===3){const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(document.createTextNode(word));else{const span=document.createElement('span');span.className='blur-word';span.textContent=word;fragment.append(span)}});node.replaceWith(fragment)}else if(node.nodeType===1&&node.tagName!=='BR') [...node.childNodes].forEach(split)}nodes.forEach(split);g.fromTo($$('.blur-word',el),{y:30,opacity:0,filter:'blur(10px)'},{y:0,opacity:1,filter:'blur(0px)',duration:.7,stagger:.055,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',toggleActions:'play none none reverse'}})});$$('.about-visual').forEach(el=>g.from(el,{y:45,scale:.975,opacity:0,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',toggleActions:'play none none reverse'}}));g.to('.about-visual>img',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.about-visual',start:'top bottom',end:'bottom top',scrub:true}})}if(matchMedia('(pointer:fine)').matches)$$('.magnetic').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();g.to(b,{x:(e.clientX-r.left-r.width/2)*.1,y:(e.clientY-r.top-r.height/2)*.14,duration:.35,ease:'power3.out'})});b.addEventListener('mouseleave',()=>g.to(b,{x:0,y:0,duration:.6,ease:'power3.out'}))})}
animate();document.fonts?.ready.then(()=>window.ScrollTrigger?.refresh());
// O símbolo original da Bow é reservado à seção da agência.
function initBow3D(){if(!window.THREE||!window.BOW_SYMBOL)return;const T=THREE,canvas=$('#bow-canvas'),wrap=canvas.parentElement;let renderer;try{renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true})}catch{canvas.hidden=true;$('.bow-3d>span').textContent='BOW STUDIO · DESIGN & ESTRATÉGIA';return}renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputEncoding=T.sRGBEncoding;const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,100);camera.position.z=11;const points=window.BOW_SYMBOL;let xs=[],ys=[];points.forEach(p=>p.forEach(([x,y])=>{xs.push(x);ys.push(y)}));const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),k=5/(x1-x0);const shapes=points.map(p=>{const s=new T.Shape();p.forEach(([x,y],i)=>{const a=(x-(x0+x1)/2)*k,b=-(y-(y0+y1)/2)*k;i?s.lineTo(a,b):s.moveTo(a,b)});return s});const geo=new T.ExtrudeGeometry(shapes,{depth:.45,bevelEnabled:true,bevelThickness:.045,bevelSize:.035,bevelSegments:4,curveSegments:1});geo.translate(0,0,-.225);const material=new T.MeshStandardMaterial({color:0xaeb5bf,metalness:.65,roughness:.22});const mesh=new T.Mesh(geo,material);const tilt=new T.Group(),spin=new T.Group();tilt.rotation.z=Math.PI/4;tilt.add(mesh);spin.add(tilt);spin.rotation.x=.17;scene.add(spin);scene.add(new T.HemisphereLight(0xffffff,0x303040,1.3));const light=new T.DirectionalLight(0xffffff,2);light.position.set(-4,5,7);scene.add(light);const rim=new T.DirectionalLight(0x7b8fbf,1.5);rim.position.set(5,-2,-3);scene.add(rim);function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();spin.scale.setScalar(w<h?.75:1)}new ResizeObserver(resize).observe(wrap);resize();let drag=false,last=0,velocity=0,visible=true;canvas.onpointerdown=e=>{drag=true;last=e.clientX;canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(drag){velocity=(e.clientX-last)*.008;spin.rotation.y+=velocity;last=e.clientX}};canvas.onpointerup=canvas.onpointercancel=()=>{drag=false};new IntersectionObserver(([e])=>visible=e.isIntersecting).observe(wrap);let prev=0;function loop(time){requestAnimationFrame(loop);const dt=Math.min((time-prev)/1000,.05);prev=time;if(!visible||document.hidden)return;if(!drag&&!reduce){spin.rotation.y+=dt*.55+velocity;velocity*=.93;spin.position.y=Math.sin(time*.0009)*.07}renderer.render(scene,camera)}requestAnimationFrame(loop);wrap.classList.add('ready')}
initBow3D();

})();
