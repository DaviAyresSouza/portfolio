/* Dificulta salvar pela interface; não impede captura de tela ou acesso à rede. */
(()=>{
  'use strict';
  const selector='img,video,audio,canvas,iframe,object,embed,.project-cover,.modal-media-frame';
  const isMedia=target=>target instanceof Element && target.closest(selector);
  document.addEventListener('contextmenu',e=>{if(isMedia(e.target))e.preventDefault();});
  document.addEventListener('dragstart',e=>{if(isMedia(e.target))e.preventDefault();});
  const protect=root=>{
    if(!(root instanceof Element))return;
    const media=[...(root.matches('img,video,audio')?[root]:[]),...root.querySelectorAll('img,video,audio')];
    for(const el of media){el.setAttribute('draggable','false');if(el.matches('video,audio')){el.setAttribute('controlslist','nodownload noremoteplayback');el.disableRemotePlayback=true;if(el.tagName==='VIDEO')el.disablePictureInPicture=true;}}
  };
  protect(document.documentElement);
  new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(protect))).observe(document.body,{childList:true,subtree:true});
  // Sem bloqueio de teclas, zoom, seleção de textos ou ferramentas de acessibilidade.
})();
