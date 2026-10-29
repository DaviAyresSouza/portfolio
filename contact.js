/* Monta links de contato. O visitante confirma o envio no WhatsApp/e-mail. */
(function(root){
  'use strict';
  function normalizePhone(value){
    const phone=String(value||'').trim();
    return /^[1-9]\d{7,14}$/.test(phone)?phone:'';
  }
  function normalizeEmail(value){
    const email=String(value||'').trim();
    return /^[A-Za-z0-9.!#$%&'*+/=_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(email)?email:'';
  }
  function message(data){
    return 'Olá, Davi! Vim pelo seu portfólio e gostaria de conversar sobre um projeto.\n\n'
      +'Nome: '+String(data.nome||'').trim()+'\n'
      +'Marca/empresa: '+(String(data.marca||'').trim()||'Não informada')+'\n'
      +'Serviço: '+String(data.servico||'').trim()+'\n\n'
      +'Minha ideia:\n'+String(data.ideia||'').trim();
  }
  function link(channel,config,data){
    if(channel==='whatsapp'){
      const phone=normalizePhone(config.whatsapp);
      if(!phone)throw new Error('Este canal está indisponível no momento.');
      return 'https://wa.me/'+phone+'?text='+encodeURIComponent(message(data));
    }
    if(channel==='email'){
      const email=normalizeEmail(config.email);
      if(!email)throw new Error('Este canal está indisponível no momento.');
      return 'mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent('Novo projeto — Portfólio Davi Ayres')+'&body='+encodeURIComponent(message(data));
    }
    throw new Error('Escolha WhatsApp ou e-mail.');
  }
  root.PortfolioContact={normalizePhone,normalizeEmail,message,link};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.PortfolioContact;
})(typeof window!=='undefined'?window:globalThis);
