(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const uid=()=>crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16)).join('-');
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
let panelUnlocked=false, panelEpoch=0;
let userProjects=[],activeFilter='Todos',activeProject=null,slideIndex=0,lastProjectButton=null;
function artMarkup(type,slide=0){
 if(type==='forma')return `<div class="art art-forma" style="${slide===1?'background:#263b2d;color:#e2e7d4':slide===2?'background:#ebe9df':''}"><small>ESTUDO DE IDENTIDADE / 2026</small><div class="forma-mark" style="${slide===1?'border-color:#c9cfb8':''}"></div><div class="forma-word">forma</div><div class="bottom-line"><small>${['NATURAL POR ESSÊNCIA.','UM SISTEMA. MUITAS FORMAS.','DO CONCEITO AO DETALHE.'][slide%3]}</small><div class="mini-card">f.</div></div></div>`;
 if(type==='post')return '<div class="art art-post"><small>EXPERIMENTO VISUAL / SOCIAL</small><div class="sticker">↗</div><h3>MAIS<br>QUE UM<br>POST.</h3><div class="bottom-line"><span>UMA IDEIA QUE FICA.</span><span>01 — 01</span></div></div>';
 if(type==='carousel')return `<div class="art art-carousel"><div class="sheet"><span>CONTEÚDO COM INTENÇÃO</span><h3>${['Não é só<br>sobre<br>aparecer.','É sobre<br>fazer<br>sentido.','E criar<br>conexões<br>de verdade.'][slide%3]}</h3><b>${slide===2?'✳':'↗'}</b><span>DESLIZE PARA CONTINUAR &nbsp; 0${slide+1}/03</span></div></div>`;
 if(type==='digital')return '<div class="art art-digital"><div class="browser-art"><div class="browser-dots">••• <span style="float:right;letter-spacing:0">studio — digital</span></div><div class="digital-orb"></div><h3>Menos ruído.<br>Mais<br>presença.</h3><small>ESTUDO DE EXPERIÊNCIA DIGITAL &nbsp; ↗</small></div></div>';
 if(type==='editorial')return '<div class="art art-editorial"><small>ESTUDO EDITORIAL — VOL. 01</small><div><div class="editorial-rule"></div><h3>entre<br>formas.</h3></div><p>Um exercício sobre espaço, equilíbrio e as possibilidades da palavra.</p><div class="editorial-circle"></div></div>';
 return '<div class="film-cover"><img src="assets/portrait-warm.webp" alt="Retrato de Davi em iluminação cinematográfica" loading="lazy"><div class="film-overlay"><span>▷</span><h3>Um olhar<br>em movimento.</h3><small>PRÉVIA DEMONSTRATIVA / 06 SEGUNDOS</small></div></div>';
}
function currentProjects(){return [...userProjects,...demoProjects]}
function mediaCover(p){if(!p.local)return artMarkup(p.art);const m=p.media[0];return m.type.startsWith('video/')?`<video src="${m.data}" preload="metadata" muted playsinline aria-label="Prévia de ${esc(p.title)}"></video>`:`<img src="${m.data}" alt="${esc(p.title)}" loading="lazy">`}
function renderProjects(){
 const all=currentProjects(),list=all.filter(p=>activeFilter==='Todos'||p.category===activeFilter);
 $('#project-grid').innerHTML=list.map(p=>`<article class="project-card"><button class="project-button" data-id="${esc(p.id)}" aria-label="Abrir projeto: ${esc(p.title)}"><div class="project-cover">${mediaCover(p)}<span class="project-badge">${p.local?'RASCUNHO LOCAL':'ESTUDO DEMONSTRATIVO'}</span><span class="project-open" aria-hidden="true">↗</span></div><div class="project-caption"><div><h3>${esc(p.title)}</h3><p>${esc(p.category)}${p.category==='Carrosséis'?' · '+(p.local?p.media.length:p.slides)+' páginas':''}</p></div><span>${p.year}</span></div></button></article>`).join('');
 $('.empty-state').hidden=!!list.length;$('.work-counter').textContent=list.length?'01 — '+String(list.length).padStart(2,'0'):'00';$('.nav sup').textContent=String(all.length).padStart(2,'0');$('.filters sup').textContent=String(all.length).padStart(2,'0');
 $$('.project-button').forEach(b=>{b.onclick=()=>{lastProjectButton=b;openProject(all.find(p=>p.id===b.dataset.id))};b.onpointerenter=()=>{if(matchMedia('(pointer:fine)').matches)$('.cursor-tag').classList.add('on')};b.onpointerleave=()=>$('.cursor-tag').classList.remove('on')});
 if(window.gsap&&!reduce)gsap.fromTo('.project-card',{opacity:0,y:24},{opacity:1,y:0,duration:.55,stagger:.045,clearProps:'transform,opacity'});
 window.ScrollTrigger?.refresh();
}
$$('[data-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;$$('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderProjects()});
function openProject(p){activeProject=p;slideIndex=0;$('#modal-title').textContent=p.title;$('#modal-category').textContent=p.category.toUpperCase()+' / '+p.year;$('#modal-description').textContent=p.description;$('#modal-note').textContent=p.local?'Rascunho salvo neste navegador.':'Conteúdo demonstrativo. Os trabalhos definitivos serão adicionados em breve.';renderSlide();$('#project-dialog').showModal();$('.cursor-tag').classList.remove('on')}
function renderSlide(){const p=activeProject,n=p.local?p.media.length:p.slides;let content;
 if(p.local){const m=p.media[slideIndex];content=m.type.startsWith('video/')?`<video controls controlslist="nodownload noremoteplayback" disablepictureinpicture disableremoteplayback playsinline preload="metadata" src="${m.data}" aria-label="${esc(p.title)}"></video>`:`<img src="${m.data}" alt="${esc(p.title)} — imagem ${slideIndex+1}">`}
 else if(p.art==='film')content='<video controls controlslist="nodownload noremoteplayback" disablepictureinpicture disableremoteplayback playsinline preload="metadata" poster="assets/portrait-warm.webp" aria-label="Prévia de movimento com retrato de Davi"><source src="assets/demo-motion.webm" type="video/webm"><source src="assets/demo-motion.mp4" type="video/mp4"></video>';
 else content=artMarkup(p.art,slideIndex);
 $('#modal-media').innerHTML=`<div class="modal-media-frame">${content}</div>`;$('#slide-count').textContent=`${String(slideIndex+1).padStart(2,'0')} / ${String(n).padStart(2,'0')}`;$('#slide-prev').disabled=slideIndex===0;$('#slide-next').disabled=slideIndex===n-1;$('.modal-navigation').hidden=n===1;
}
$('#slide-prev').onclick=()=>{if(slideIndex>0){slideIndex--;renderSlide()}};$('#slide-next').onclick=()=>{if(slideIndex<(activeProject.local?activeProject.media.length:activeProject.slides)-1){slideIndex++;renderSlide()}};
$('#project-dialog').addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowRight')$('#slide-next').click();if(e.key==='ArrowLeft')$('#slide-prev').click()});
$$('dialog').forEach(d=>{$('.dialog-close',d).onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});d.addEventListener('close',()=>{$$('video',d).forEach(v=>v.pause());if(d.id==='project-dialog')lastProjectButton?.focus()})});
const toggle=$('.menu-toggle'),menu=$('.mobile-nav');function setMenu(on){menu.classList.toggle('open',on);menu.inert=!on;toggle.setAttribute('aria-expanded',String(on));toggle.setAttribute('aria-label',on?'Fechar menu':'Abrir menu');document.body.style.overflow=on?'hidden':''}
toggle.onclick=()=>setMenu(!menu.classList.contains('open'));$$('a',menu).forEach(a=>a.onclick=()=>setMenu(false));document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});window.addEventListener('resize',()=>{if(innerWidth>700)setMenu(false)});
$('#year').textContent=new Date().getFullYear();
const download=(text,name,type='text/plain')=>{const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000)};
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
// Rascunhos locais: nunca enviados a terceiros nem apresentados como publicados.
let dbPromise;
function db(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('davi-ayres-portfolio-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return dbPromise}
async function readDrafts(){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction('state').objectStore('state').get('projects');r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)})}
async function saveDrafts(projects){if(!panelUnlocked)throw Error("Abra o painel com sua senha.");const epoch=panelEpoch;const d=await db();if(!panelUnlocked||epoch!==panelEpoch)throw Error("Painel bloqueado.");return new Promise((resolve,reject)=>{const tx=d.transaction('state','readwrite');tx.objectStore('state').put(projects,'projects');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
function manageList(){$('#manage-list').innerHTML=userProjects.length?userProjects.map(p=>`<div class="manage-item"><span>${esc(p.title)} · ${esc(p.category)}</span><button data-remove="${esc(p.id)}" aria-label="Remover ${esc(p.title)} do rascunho">Remover</button></div>`).join(''):'<p style="font-size:11px;color:#777;margin-top:20px">Seus novos projetos aparecerão aqui.</p>';$$('[data-remove]').forEach(b=>b.onclick=async()=>{if(!panelUnlocked)return;const next=userProjects.filter(p=>p.id!==b.dataset.remove);try{await saveDrafts(next);userProjects=next;manageList();renderProjects();$('#manager-status').textContent='Projeto removido do rascunho local.'}catch{$('#manager-status').textContent='Não foi possível salvar a alteração neste navegador.'}})}
function requestPanelAccess(){
  $('#access-form').reset();$('#access-status').textContent='';
  $('#access-dialog').showModal();$('#panel-password').focus();
}
$('#manage-open').onclick=requestPanelAccess;
$('#access-form').onsubmit=async e=>{
  e.preventDefault();const form=e.target,button=$('button[type=submit]',form),status=$('#access-status');
  button.disabled=true;status.textContent='Verificando…';
  try{
    const valid=await PortfolioPanel.verify(form.elements.password.value);
    if(!$('#access-dialog').open)return;
    if(!valid){status.textContent='Senha incorreta. Tente novamente.';form.elements.password.value='';form.elements.password.focus();return;}
    panelUnlocked=true;panelEpoch++;$('#manager-dialog').inert=false;
    userProjects=await readDrafts();renderProjects();manageList();
    form.reset();$('#access-dialog').close();$('#manager-dialog').showModal();
  }catch(err){panelUnlocked=false;$('#manager-dialog').inert=true;status.textContent=err.message||'Não foi possível abrir o painel.'}
  finally{button.disabled=false;}
};
$('#access-dialog').addEventListener('close',()=>$('#access-form').reset());
$('#panel-logout').onclick=()=>{
  panelUnlocked=false;panelEpoch++;$('#manager-dialog').close();$('#manager-dialog').inert=true;
  $('#project-form').reset();$('#import-projects').value='';$('#manage-list').replaceChildren();
  userProjects=[];renderProjects();$('#manage-open').focus();
};
const allowedMedia=['image/jpeg','image/png','image/webp','video/mp4','video/webm'];
const readData=f=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f)});
$('#project-form').onsubmit=async e=>{e.preventDefault();if(!panelUnlocked){requestPanelAccess();return;}const f=e.target,status=$('.form-status',f),button=$('button[type=submit]',f);button.disabled=true;status.textContent='Preparando seu projeto…';try{const data=new FormData(f),files=[...f.elements.media.files];if(!files.length)throw Error('Selecione pelo menos um arquivo.');if(files.length>20)throw Error('Selecione até 20 arquivos por projeto.');if(files.some(x=>!allowedMedia.includes(x.type)))throw Error('Use JPG, PNG, WebP, MP4 ou WebM.');if(files.some(x=>x.size>25*1024*1024))throw Error('Cada arquivo deve ter no máximo 25 MB.');if(files.reduce((n,f)=>n+f.size,0)>75*1024*1024)throw Error('Adicione até 75 MB por projeto.');const title=String(data.get('title')).trim();if(!title)throw Error('Dê um título ao projeto.');const media=[];for(const file of files)media.push({type:file.type,name:file.name,data:await readData(file)});const p={id:'local-'+uid(),title,category:data.get('category'),year:Number(data.get('year')),description:String(data.get('description')),media,local:true};const next=[p,...userProjects];await saveDrafts(next);userProjects=next;f.reset();f.elements.year.value=new Date().getFullYear();status.textContent='Projeto adicionado ao rascunho local. Exporte uma cópia para guardar.';activeFilter='Todos';$$('[data-filter]').forEach(x=>{x.classList.toggle('active',x.dataset.filter==='Todos');x.setAttribute('aria-pressed',String(x.dataset.filter==='Todos'))});renderProjects();manageList()}catch(err){status.textContent=err.name==='QuotaExceededError'?'O armazenamento do navegador está cheio. Exporte seus rascunhos e remova arquivos antes de tentar novamente.':err.message||'Não foi possível salvar o projeto neste navegador.'}finally{button.disabled=false}};
$('#export-projects').onclick=()=>{if(!panelUnlocked)return;if(!userProjects.length){$('#manager-status').textContent='Adicione um projeto antes de exportar.';return}download(JSON.stringify({format:'davi-ayres-portfolio',version:1,projects:userProjects}), 'Davi_Ayres_Rascunhos.json','application/json');$('#manager-status').textContent='Cópia dos rascunhos preparada para download.'};
$('#import-projects').onchange=async e=>{if(!panelUnlocked){e.target.value='';return;}const file=e.target.files[0];if(!file)return;try{if(file.size>150*1024*1024)throw Error('O arquivo deve ter até 150 MB.');const data=JSON.parse(await file.text());if(data.format!=='davi-ayres-portfolio'||data.version!==1||!Array.isArray(data.projects)||data.projects.length>100)throw Error('Arquivo de rascunhos inválido.');const incoming=data.projects.map(p=>{if(typeof p.title!=='string'||!p.title.trim()||!['Posts','Carrosséis','Identidades','Vídeos','Digital'].includes(p.category)||!Array.isArray(p.media)||!p.media.length||p.media.length>20||!Number.isInteger(p.year)||p.year<2000||p.year>2100)throw Error('Um projeto do arquivo está inválido.');const media=p.media.map(m=>{if(!allowedMedia.includes(m.type)||typeof m.data!=='string'||!m.data.startsWith('data:'+m.type+';base64,')||!/^data:[a-z]+\/[a-z0-9]+;base64,[A-Za-z0-9+/=\r\n]+$/.test(m.data)||m.data.length>36*1024*1024)throw Error('O arquivo contém uma mídia inválida.');return{type:m.type,name:String(m.name||'arquivo').slice(0,255),data:m.data}});return{id:'local-'+uid(),title:p.title.slice(0,80),category:p.category,year:p.year,description:String(p.description||'').slice(0,1500),media,local:true}});const next=[...incoming,...userProjects];await saveDrafts(next);userProjects=next;renderProjects();manageList();$('#manager-status').textContent=`${incoming.length} projeto(s) importado(s) para este navegador.`}catch(err){$('#manager-status').textContent=err.message||'Não foi possível importar os rascunhos.'}finally{e.target.value=''}};
renderProjects();
// Movimento: os ritmos, o blur e a resposta ao scroll seguem a linguagem da Bow.
let mx=0,my=0,cx=0,cy=0;document.addEventListener('pointermove',e=>{mx=e.clientX+18;my=e.clientY+18},{passive:true});if(matchMedia('(pointer:fine)').matches&&!reduce){const move=()=>{cx+=(mx-cx)*.22;cy+=(my-cy)*.22;$('.cursor-tag').style.transform=`translate3d(${cx}px,${cy}px,0)`;requestAnimationFrame(move)};move()}
function updateProgress(){$('.nav').classList.toggle('scrolled',scrollY>100);const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-track span').style.height=(max?scrollY/max*100:0)+'%'}window.addEventListener('scroll',updateProgress,{passive:true});
let count=0;const countTimer=setInterval(()=>{count=Math.min(100,count+Math.ceil(Math.random()*10));$('#load-count').textContent=count+'%';if(count===100)clearInterval(countTimer)},70);setTimeout(()=>{$('.loader').remove();clearInterval(countTimer)},2300);
function animate(){if(!window.gsap||reduce)return;const g=gsap;if(window.ScrollTrigger)g.registerPlugin(ScrollTrigger);g.from('.hero-title h1>span',{yPercent:30,rotationX:-25,opacity:0,filter:'blur(14px)',duration:1,stagger:.12,ease:'power4.out',delay:1.45,clearProps:'transform,opacity,filter'});g.from('.hero-photo img',{scale:1.08,opacity:0,duration:1.6,ease:'power3.out',delay:.9});g.from('.hero-bottom>*',{y:25,opacity:0,duration:.8,stagger:.08,delay:1.9,clearProps:'all'});if(window.ScrollTrigger){g.to('.hero-title',{yPercent:-15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});g.to('.hero-photo img',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});$$('h2.reveal').forEach(el=>{const nodes=[...el.childNodes];function split(node){if(node.nodeType===3){const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(document.createTextNode(word));else{const span=document.createElement('span');span.className='blur-word';span.textContent=word;fragment.append(span)}});node.replaceWith(fragment)}else if(node.nodeType===1&&node.tagName!=='BR') [...node.childNodes].forEach(split)}nodes.forEach(split);g.fromTo($$('.blur-word',el),{y:30,opacity:0,filter:'blur(10px)'},{y:0,opacity:1,filter:'blur(0px)',duration:.7,stagger:.055,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',toggleActions:'play none none reverse'}})});$$('.about-visual,.contact-photo').forEach(el=>g.from(el,{y:45,scale:.975,opacity:0,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',toggleActions:'play none none reverse'}}));g.to('.about-visual>img',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.about-visual',start:'top bottom',end:'bottom top',scrub:true}})}if(matchMedia('(pointer:fine)').matches)$$('.magnetic').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();g.to(b,{x:(e.clientX-r.left-r.width/2)*.1,y:(e.clientY-r.top-r.height/2)*.14,duration:.35,ease:'power3.out'})});b.addEventListener('mouseleave',()=>g.to(b,{x:0,y:0,duration:.6,ease:'power3.out'}))})}
animate();document.fonts?.ready.then(()=>window.ScrollTrigger?.refresh());
// O símbolo original da Bow é reservado à seção da agência.
function initBow3D(){if(!window.THREE||!window.BOW_SYMBOL)return;const T=THREE,canvas=$('#bow-canvas'),wrap=canvas.parentElement;let renderer;try{renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true})}catch{canvas.hidden=true;$('.bow-3d>span').textContent='BOW STUDIO · DESIGN & ESTRATÉGIA';return}renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputEncoding=T.sRGBEncoding;const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,100);camera.position.z=11;const points=window.BOW_SYMBOL;let xs=[],ys=[];points.forEach(p=>p.forEach(([x,y])=>{xs.push(x);ys.push(y)}));const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),k=5/(x1-x0);const shapes=points.map(p=>{const s=new T.Shape();p.forEach(([x,y],i)=>{const a=(x-(x0+x1)/2)*k,b=-(y-(y0+y1)/2)*k;i?s.lineTo(a,b):s.moveTo(a,b)});return s});const geo=new T.ExtrudeGeometry(shapes,{depth:.45,bevelEnabled:true,bevelThickness:.045,bevelSize:.035,bevelSegments:4,curveSegments:1});geo.translate(0,0,-.225);const material=new T.MeshStandardMaterial({color:0xaeb5bf,metalness:.65,roughness:.22});const mesh=new T.Mesh(geo,material);const tilt=new T.Group(),spin=new T.Group();tilt.rotation.z=Math.PI/4;tilt.add(mesh);spin.add(tilt);spin.rotation.x=.17;scene.add(spin);scene.add(new T.HemisphereLight(0xffffff,0x303040,1.3));const light=new T.DirectionalLight(0xffffff,2);light.position.set(-4,5,7);scene.add(light);const rim=new T.DirectionalLight(0x7b8fbf,1.5);rim.position.set(5,-2,-3);scene.add(rim);function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();spin.scale.setScalar(w<h?.75:1)}new ResizeObserver(resize).observe(wrap);resize();let drag=false,last=0,velocity=0,visible=true;canvas.onpointerdown=e=>{drag=true;last=e.clientX;canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(drag){velocity=(e.clientX-last)*.008;spin.rotation.y+=velocity;last=e.clientX}};canvas.onpointerup=canvas.onpointercancel=()=>{drag=false};new IntersectionObserver(([e])=>visible=e.isIntersecting).observe(wrap);let prev=0;function loop(time){requestAnimationFrame(loop);const dt=Math.min((time-prev)/1000,.05);prev=time;if(!visible||document.hidden)return;if(!drag&&!reduce){spin.rotation.y+=dt*.55+velocity;velocity*=.93;spin.position.y=Math.sin(time*.0009)*.07}renderer.render(scene,camera)}requestAnimationFrame(loop);wrap.classList.add('ready')}
initBow3D();

})();
