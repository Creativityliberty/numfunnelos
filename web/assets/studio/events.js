async function handleSubmit(e){const form=e.target;if(!form.matches('[data-form],#builder-form'))return;e.preventDefault();const kind=form.getAttribute('data-form')||'builder',x=Object.fromEntries(new FormData(form));const disabled=[...form.querySelectorAll('button[type="submit"]')];disabled.forEach(b=>b.disabled=true);try{if(kind==='forgot'){
 await api('/auth/password/forgot',{method:'POST',tenant:false,data:{email:x.email}});
 toast('Si votre compte existe, vous recevrez un email.');S.authMode='login';renderAuth();
}
 else if(kind==='reset'){
 await api('/auth/password/reset',{method:'POST',tenant:false,data:{token:S.resetToken,password:x.password}});
 S.resetToken=null;S.authMode='login';renderAuth();toast('Mot de passe modifié, reconnectez-vous');
}
 else if(kind==='register'||kind==='login'){
 await api('/auth/'+(kind==='register'?'register':'login'),{method:'POST',tenant:false,data:x});await refreshAuth();S.page='overview';await load();startLive();toast('Bienvenue dans Nüptin');}
 else if(kind==='upload'){
   const data=new FormData(form);const file=data.get('file');
   if(!file||file.size>12*1024*1024)throw Error('Fichier supérieur à 12 Mo');
   const response=await fetch('/api/assets',{method:'POST',headers:{'X-CSRF-Token':S.csrf,'X-Workspace-Id':S.wid},body:data,credentials:'same-origin'});
   const result=await response.json().catch(()=>({}));
   if(!response.ok)throw Error(result.detail||'Upload InsForge impossible');
   toast('Média privé importé');await go('integrations');
 }
 else if(kind==='newfunnel'){let r=await api('/funnels',{method:'POST',data:x});S.modal=null;S.selected=r.id;toast('Tunnel créé');await go('builder')}
 else if(kind==='newmcp'){
   let scopes=['funnels:read','funnels:write'];
   if(x.scope_publish) scopes.push('funnels:publish');
   let r=await api('/mcp/tokens',{method:'POST',data:{
     label:x.label||'Agent local',
     scopes,
     valid_days:Number(x.valid_days)||30
   }});
   S.lastMcpToken=r.token;
   S.modal='mcpcreated';
   await load();
   toast('Jeton MCP créé avec succès');
   return;
 }
 else if(kind==='newworkspace'){let r=await api('/workspaces',{method:'POST',data:x});localStorage.setItem('num-wid',r.id);await refreshAuth();S.modal=null;toast('Workspace créé');await go('overview');startLive()}
 else if(kind==='newdraft'){await api('/inbox/drafts',{method:'POST',data:x});S.modal=null;toast('Brouillon sauvegardé');await go('inbox')}
 else if(kind==='newauto'){await api('/automations',{method:'POST',data:{name:x.name,trigger:x.trigger,action:x.action,enabled:true}});S.modal=null;await go('automations')}
 else if(kind==='builder'){await saveBuilder(form);toast('Brouillon enregistré sur le serveur');await load()}
 else if(kind==='update_profile'){let r=await api('/auth/profile',{method:'PATCH',data:{name:x.name,avatar_url:x.avatar_url||''}});if(S.me){S.me.name=r.user.name;S.me.avatar_url=r.user.avatar_url;}toast('Profil mis à jour avec succès');shell(pageSettings())}
 else if(kind==='change_password'){await api('/auth/change-password',{method:'POST',data:{current_password:x.current_password,new_password:x.new_password}});form.reset();toast('Mot de passe mis à jour avec succès')}
 else if(kind==='save_notifications'){toast('Préférences de notification enregistrées')}
 else if(kind==='whatsapp-send'||kind==='whatsapp_send'){
   let jid=x.jid, text=x.text;
   let r=await api('/whatsapp/send',{method:'POST',data:{jid,text}});
   toast('Message WhatsApp expédié');
   form.querySelector('[name="text"]').value='';
   if(!S.whatsappMessages)S.whatsappMessages={};
   if(!S.whatsappMessages[jid])S.whatsappMessages[jid]=[];
   S.whatsappMessages[jid].push({id:r.id||Date.now(),jid,fromMe:true,text,timestamp:Date.now(),pushName:'Moi'});
   shell(pageWhatsApp());
   const box=document.getElementById('wa-messages-container');
   if(box)box.scrollTop=box.scrollHeight;
 }
 else if(kind==='new_wa_group'){
   let parts=x.participants?x.participants.split(',').map(p=>p.trim()).filter(Boolean):[];
    let r=await api('/whatsapp/groups',{method:'POST',data:{name:x.name,participants:parts}});
    let note=(r.skipped&&r.skipped.length)?' '+r.skipped.length+' numéro(s) ignoré(s) : aucun compte WhatsApp associé.':'';
    if(r.invite_link){try{await navigator.clipboard.writeText(r.invite_link);note+=' Lien d’invitation copié.'}catch(e){}}
    toast('Groupe créé.'+note);
    S.modal=null;
    await load();
  }
 else if(kind==='whatsapp_new_chat'){
   let phone=x.phone?.trim();
   if(!phone)throw Error('Numéro requis');
   let sent=await api('/whatsapp/send',{method:'POST',data:{jid:phone,text:x.text}});
    let jid=sent.jid||phone;
   toast('Message WhatsApp expédié');
   S.whatsappActiveJid=jid;
   S.modal=null;
   await go('whatsapp');
 }
 else if(kind==='add_contact_to_group'){
   let phone=x.direct_phone?.trim()||x.phone;
   if(!phone)throw Error('Veuillez spécifier un numéro');
    let r=await api('/whatsapp/groups/add',{method:'POST',data:{groupJid:x.groupJid,phone}});
    if(r.ok){
      toast('Contact ajouté au groupe.');
    }else{
      let copied=false;
      if(r.invite_link){try{await navigator.clipboard.writeText(r.invite_link);copied=true}catch(e){}}
      toast((r.error||'Ajout impossible.')+(copied?' Lien d’invitation copié, transmettez-le au contact.':''));
    }
    S.modal=null;
    await load();
  }
 else if(['agentmail','calcom','openai_ads'].includes(kind)){let data={enabled:!!x.enabled};if(kind==='agentmail'){data.inbox_id=x.inbox_id;if(x.api_key)data.api_key=x.api_key;if(x.webhook_secret)data.webhook_secret=x.webhook_secret;if(x.notification_to)data.notification_to=x.notification_to}if(kind==='calcom'){if(x.booking_url)data.booking_url=x.booking_url.trim();if(x.cal_event_type_id&&!isNaN(Number(x.cal_event_type_id)))data.cal_event_type_id=Number(x.cal_event_type_id);if(x.webhook_secret)data.webhook_secret=x.webhook_secret.trim();}if(kind==='openai_ads')data.pixel_id=x.pixel_id;await api('/integrations/'+kind,{method:'PUT',data});toast('Configuration enregistrée');await go('integrations')}
 }catch(err){toast(err.message);disabled.forEach(b=>b.disabled=false)}}

document.addEventListener('submit',handleSubmit);
document.addEventListener('click',async e=>{let t=e.target.closest('button,a,[data-nav],[data-action],[data-workspace]');if(!t)return;try{
 if(t.dataset.authSwitch){S.authMode=S.authMode==='register'?'login':S.authMode==='login'?'register':'login';renderAuth();return}
 if(t.dataset.authForgot){S.authMode='forgot';renderAuth();return}
 if(t.dataset.nav){e.preventDefault();S.lastMcpToken=null;await go(t.dataset.nav);return}
 if(t.dataset.action==='send-reset-email'){if(!S.me?.email)return;await api('/auth/password/forgot',{method:'POST',tenant:false,data:{email:S.me.email}});toast('Lien de réinitialisation sécurisé envoyé à '+S.me.email);return}
 if(t.dataset.action==='logout-all'){if(confirm('Déconnecter tous vos appareils ?')){await api('/auth/logout',{method:'POST',tenant:false});location.reload()}return}
 if(t.dataset.action==='delete-account'){if(confirm('Êtes-vous absolument certain ? Cette action est irréversible et supprimera l’ensemble de vos vitrines et tunnels.')){toast('Demande de suppression enregistrée.');await api('/auth/logout',{method:'POST',tenant:false});location.reload()}return}
 if(t.dataset.edit){S.selected=t.dataset.edit;await go('builder');return}
 if(t.dataset.duplicateFunnel){let r=await api('/funnels/'+t.dataset.duplicateFunnel+'/duplicate',{method:'POST',data:{}});toast('Tunnel dupliqué : '+r.name);S.selected=r.id;await load();await go('builder');return}
 if(t.dataset.deleteFunnel){if(!confirm('Supprimer définitivement ce tunnel de conversion ?'))return;await api('/funnels/'+t.dataset.deleteFunnel,{method:'DELETE'});toast('Tunnel supprimé');if(S.selected===t.dataset.deleteFunnel)S.selected=null;await load();return}
 if(t.dataset.publish){let b=$('#builder-form');if(b)await saveBuilder(b);let r=await api('/funnels/'+t.dataset.publish+'/publish',{method:'POST',data:{}});toast('Tunnel publié : '+r.url);await load();return}
 if(t.dataset.unpublish){if(confirm('Dépublier ce tunnel ?')){await api('/funnels/'+t.dataset.unpublish+'/unpublish',{method:'POST',data:{}});await load()}return}
 if(t.dataset.revokeToken){await api('/mcp/tokens/'+t.dataset.revokeToken,{method:'DELETE'});toast('Jeton révoqué');await go('team');return}
 if(t.dataset.workspace){S.wid=t.dataset.workspace;localStorage.setItem('num-wid',S.wid);S.selected=null;S.modal=null;await go('overview');return}
 if(t.dataset.guideTab){
  S.guideTab=t.dataset.guideTab;
  let container=document.getElementById('academy-body-container');
  if(container){
    document.querySelectorAll('.academy-tab').forEach(b=>b.classList.toggle('active',b.dataset.guideTab===S.guideTab));
    container.innerHTML=academyTabContent(S.guideTab);
  } else {
    shell(pageMap[S.page]());
  }
  return;
 }
 if(t.dataset.builderTab){S.builderTab=t.dataset.builderTab;shell(pageMap[S.page]());return}
 if(t.dataset.tab){S.tab=t.dataset.tab;shell(pageMap[S.page]());return}
 if(t.dataset.ics){let r=await fetch('/api/bookings/'+t.dataset.ics+'/ics',{headers:{'X-Workspace-Id':S.wid},credentials:'same-origin'});if(!r.ok)throw Error('Export calendrier indisponible');let blob=await r.blob(),href=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=href;anchor.download='rendez-vous.ics';anchor.click();setTimeout(()=>URL.revokeObjectURL(href),1000);return}
 if(t.dataset.send){let d=(S.data.inbox?.drafts||[]).find(x=>x.id===t.dataset.send);if(d){S.viewDraft=d;S.modal='viewdraft';shell(pageMap[S.page]());return}}
 if(t.dataset.openDraft){let d=(S.data.inbox?.drafts||[]).find(x=>x.id===t.dataset.openDraft);if(d){S.viewDraft=d;S.modal='viewdraft';shell(pageMap[S.page]());return}}
 if(t.dataset.viewReceived){let m=(S.data.inbox?.received||[]).find(x=>x.id===t.dataset.viewReceived);if(m){S.viewReceived=m;S.modal='viewreceived';shell(pageMap[S.page]());return}}
 if(t.dataset.close&&e.target===t){S.modal=null;await load();return}
 if(t.dataset.action){const a=t.dataset.action;
 if(a==='confirm-send-draft'){
   let draftId=t.dataset.id;let modal=t.closest('.modal');let subj=modal?.querySelector('[name="draft_subject"]')?.value;let body=modal?.querySelector('[name="draft_body"]')?.value;
   t.disabled=true;t.textContent='Expédition en cours…';
   try{
     await api('/inbox/drafts/'+draftId+'/send',{method:'POST',data:{subject:subj,body:body}});
     toast('Email expédié avec succès via AgentMail');S.modal=null;await load();
   }catch(err){toast('Envoi AgentMail : '+err.message);t.disabled=false;t.textContent='Réessayer l’expédition';}
   return;
 }
 else if(a==='copytext'){await navigator.clipboard.writeText(t.dataset.text||'');toast('Copié dans le presse-papier');return}
 else if(a==='remove-avatar'){if(confirm('Supprimer votre photo de profil ?')){let r=await api('/auth/profile',{method:'PATCH',data:{name:S.me?.name||'',avatar_url:''}});if(S.me)S.me.avatar_url=null;toast('Photo de profil retirée');shell(pageSettings())}return}
 else if(a==='reply-received'){S.modal='newdraft';shell(pageMap[S.page]());setTimeout(()=>{let f=$('form[data-form="newdraft"]');if(f){if(f.querySelector('[name="to"]'))f.querySelector('[name="to"]').value=t.dataset.to||'';if(f.querySelector('[name="subject"]'))f.querySelector('[name="subject"]').value=t.dataset.subj||'';}},60);return}
 else if(a==='generate-agent-onboarding'){
   try {
     t.disabled=true;
     let r=await api('/mcp/tokens',{method:'POST',data:{
       label:'Copilote Onboarding',
       scopes:['funnels:read','funnels:write','funnels:publish'],
       valid_days:30
     }});
     S.lastMcpToken=r.token;
     S.modal='agent_onboarding';
     await load();
     toast('Instruction Copilote prête !');
   } catch(e) {
     toast('Génération token : ' + e.message);
   } finally {
     t.disabled=false;
   }
   return;
 }
 else if(a==='copy-agent-prompt'){
   const val = document.getElementById('agent-prompt-textarea')?.value;
   if(val){
     await navigator.clipboard.writeText(val);
     toast('Prompt complet copié ! Collez-le dans votre agent');
   }
   return;
 }
 else if(a==='mcp-create'){
   S.modal='newmcp';
   shell(pageMap[S.page]());
 }
 else if(a==='mcp-copy-token'){
   await navigator.clipboard.writeText(S.lastMcpToken||'');
   toast('Jeton copié dans le presse-papier');
 }
 else if(a==='mcp-copy-snippet'){
   const tok = S.lastMcpToken || '';
   const snip = JSON.stringify({
     mcpServers: {
       nuptin: {
         command: 'python3',
         args: ['-m', 'server.mcp_server'],
         env: {
           NUM_MCP_API_URL: location.origin,
           NUM_MCP_TOKEN: tok
         }
       }
     }
   }, null, 2);
   await navigator.clipboard.writeText(snip);
   toast('Configuration JSON copiée');
 }
 else if(a==='mcp-copy'){await navigator.clipboard.writeText(S.lastMcpToken||'');toast('Jeton copié')}
 else if(a==='google-link'){window.location.assign('/api/auth/insforge/google/start?mode=link')}
 else if(a==='closemodal'){S.modal=null;await load()}
 else if(a==='toggle-sidebar'){S.collapsed=!S.collapsed;localStorage.setItem('nuptin-sidebar-collapsed',S.collapsed?'true':'false');shell(pageMap[S.page]())}
 else if(a==='menu'){S.mobile=!S.mobile;shell(pageMap[S.page]())}
 else if(a==='workspace'||a==='guide'||a.startsWith('new')){S.modal=a;S.mobile=false;shell(pageMap[S.page]())}
 else if(a==='reload'){await load()}
 else if(a==='logout'){await api('/auth/logout',{method:'POST',data:{}});localStorage.removeItem('num-wid');S.me=null;S.authMode='login';stopLive();renderAuth()}
 else if(a==='copyurl'){await navigator.clipboard.writeText(location.origin+'/f/'+t.dataset.slug);toast('URL copiée')}
 else if(a==='savebuilder'){const form=$('#builder-form');form?.requestSubmit()}
 else if(a==='previewpublic'){let f=(S.data.funnels||[]).find(f=>f.id===S.selected);if(f?.status==='published')window.open('/f/'+f.slug,'_blank');else toast('Publiez d’abord pour ouvrir le tunnel public')}
 else if(a==='whatsapp-connect'){await api('/whatsapp/connect',{method:'POST',data:{}});toast('Code QR généré Scannez-le avec votre smartphone.');await load();}
 else if(a==='whatsapp-disconnect'){S.modal='confirm_wa_disconnect';shell(pageMap[S.page]());}
 else if(a==='confirm-disconnect-wa'){await api('/whatsapp/disconnect',{method:'POST',data:{}});S.modal=null;toast('Session WhatsApp déconnectée');await load();}
 else if(a==='whatsapp-refresh'){await load();toast('Actualisé');}
 else if(a==='wa-tab'){S.whatsappTab=t.dataset.tab;shell(pageWhatsApp());}
 else if(a==='select-wa-chat'){S.whatsappActiveJid=t.dataset.jid;await load();const box=document.getElementById('wa-messages-container');if(box)box.scrollTop=box.scrollHeight;}
 else if(a==='whatsapp-refresh-chat'){let jid=t.dataset.jid;let m=await api('/whatsapp/messages?jid='+encodeURIComponent(jid));S.whatsappMessages=S.whatsappMessages||{};S.whatsappMessages[jid]=m.messages||[];shell(pageWhatsApp());const box=document.getElementById('wa-messages-container');if(box)box.scrollTop=box.scrollHeight;}
 else if(a==='whatsapp-new-chat'){S.modal='whatsapp_new_chat';shell(pageMap[S.page]());}
 else if(a==='quick-whatsapp'){S.newChatPhone=t.dataset.phone;S.modal='whatsapp_new_chat';shell(pageMap[S.page]());}
 else if(a==='new-wa-group'){S.modal='new_wa_group';shell(pageMap[S.page]());}
 else if(a==='add-contact-to-group'){S.targetGroupJid=t.dataset.jid;S.targetGroupName=t.dataset.name;S.modal='add_contact_to_group';shell(pageMap[S.page]());}
 else if(a==='copy-group-invite'){let res=await api('/whatsapp/groups/invite?groupJid='+encodeURIComponent(t.dataset.jid));if(res.link){await navigator.clipboard.writeText(res.link);toast('Lien du groupe copié');}}
 }
 }catch(err){toast(err.message)}});
document.addEventListener('change',async e=>{let t=e.target;try{if(t&&t.id==='avatar-file-input'){let f=t.files?.[0];if(!f)return;let fd=new FormData();fd.append('file',f);toast('Téléversement de la photo...');let res=await fetch('/api/auth/avatar',{method:'POST',headers:{'X-CSRF-Token':S.csrf},body:fd});if(!res.ok){let err=await res.json();throw Error(err.detail||'Erreur téléversement');}let r=await res.json();if(S.me)S.me.avatar_url=r.avatar_url;toast('Photo de profil mise à jour avec succès');shell(pageSettings());return}if(t.dataset.selectFunnel){S.selected=t.value;await load();return}if(t.dataset.status){await api('/contacts/'+t.dataset.status,{method:'PATCH',data:{status:t.value}});toast('Contact mis à jour');await load()}if(t.dataset.auto){await api('/automations/'+t.dataset.auto,{method:'PATCH',data:{enabled:t.checked}});toast('Workflow mis à jour');await load()}}catch(err){toast(err.message)}});
document.addEventListener('input',e=>{let t=e.target;if(!t.closest('#builder-form'))return;const q=n=>$('#builder-form [name="'+n+'"]')?.value;const map={title:'pre-title',eyebrow:'pre-eyebrow',subtitle:'pre-subtitle',capture_cta:'pre-cta'};Object.entries(map).forEach(([n,id])=>{const el=document.getElementById(id);if(el)el.textContent=q(n)||''});const col=$('#builder-form [name="accent"]')?.value;if($('#pre-cta'))$('#pre-cta').style.background=col||'#f1653b'});
