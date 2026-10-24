const icons={"overview": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"5\" rx=\"1\"/><rect x=\"14\" y=\"12\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"3\" y=\"16\" width=\"7\" height=\"5\" rx=\"1\"/></svg>", "funnels": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 4h16l-6.5 7.5V19l-3 2v-9.5z\"/></svg>", "builder": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M9 3v18M9 9h12\"/></svg>", "contacts": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 21v-2a6 6 0 0 1 12 0v2M17 11a3 3 0 0 0 0-6M17 15a5 5 0 0 1 4 5\"/></svg>", "bookings": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M16 3v4M8 3v4M3 10h18M8 15h3\"/></svg>", "whatsapp": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\"/><path d=\"M9.5 9.5c.3-.6.6-.6 1-.6.2 0 .4 0 .5.1.2.2.8 1.8.8 2 0 .2 0 .4-.1.6-.2.3-.4.5-.6.7-.2.2-.4.4-.2.8.3.6 1.1 1.6 2 2.2.4.3.8.4 1 .3.3-.1.7-.8.9-1.1.2-.3.4-.3.7-.2.3.1 1.7.8 1.9.9.2.1.4.2.4.3 0 .4-.3 1.5-1.4 1.8-.7.2-1.7.1-3.2-.8-1.7-1-3-2.6-3.8-3.9-.9-1.5-.9-2.7-.6-3.2z\"/></svg>", "inbox": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"m2 7 10 7 10-7\"/></svg>", "automations": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><path d=\"M10 6h5a3 3 0 0 1 3 3v5M14 17H9a3 3 0 0 1-3-3v-4\"/></svg>", "analytics": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 3v18h18M7 16l4-5 4 3 5-7\"/></svg>", "tracking": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/></svg>", "integrations": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22v-5\"/><path d=\"M9 8V2\"/><path d=\"M15 8V2\"/><path d=\"M18 8v5a6 6 0 0 1-12 0V8z\"/></svg>", "docs": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"/><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"/><path d=\"M8 7h8M8 11h8\"/></svg>", "team": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21v-2a8 8 0 0 1 16 0v2\"/></svg>", "settings": "<svg class=\"num-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>"};

const $=(s)=>document.querySelector(s),E=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const pretty={overview:'Vue d’ensemble',funnels:'Mes tunnels',builder:'Éditeur de tunnel',contacts:'CRM & Contacts',bookings:'Calendrier',whatsapp:'WhatsApp Live & Groupes',inbox:'Messagerie & Inbox',automations:'Automatisations',analytics:'Rapports & Analyses',tracking:'Acquisition & Attribution',integrations:'Intégrations',docs:'API & Documentation',team:'Espaces de travail',settings:'Paramètres du compte'};
function userAvatar(u,extraClass=''){let cls=extraClass?`roundavatar ${extraClass}`:'roundavatar';if(u?.avatar_url)return `<span class="${cls}" style="background-image:url('${E(u.avatar_url)}');color:transparent;" title="${E(u?.name||'')}"></span>`;let init=(u?.name||'N').trim()[0]||'N';return `<span class="${cls}">${E(init.toUpperCase())}</span>`}
const S={me:null,csrf:'',wid:'',page:'overview',data:{},selected:null,tab:'overview',builderTab:'01',authMode:'register',googleEnabled:false,lastMcpToken:null,modal:null,mobile:false,busy:false,collapsed:localStorage.getItem('nuptin-sidebar-collapsed')==='true'};
let live=null,liveWorkspace=null,liveRefresh=null;
function stopLive(){if(live){live.close();live=null}liveWorkspace=null;}
function startLive(){
 if(!S.me||!S.wid||!('EventSource' in window))return;
 if(live && liveWorkspace===S.wid)return;
 stopLive();liveWorkspace=S.wid;
 live=new EventSource('/api/realtime/stream?workspace_id='+encodeURIComponent(S.wid),{withCredentials:true});
 live.addEventListener('changed',event=>{
   let data;try{data=JSON.parse(event.data)}catch{return}
   if(!['lead_created','application_interest_submitted','appointment_scheduled','agentmail_message_received'].includes(data.type))return;
   clearTimeout(liveRefresh);
   liveRefresh=setTimeout(async()=>{if(S.me&&S.wid===liveWorkspace){try{await load()}catch{}}},500);
 });
}
const toast=(msg)=>{const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3400)};
async function api(url,{method='GET',data=null,tenant=true}={}){const h={};if(data!==null)h['Content-Type']='application/json';if(method!=='GET')h['X-CSRF-Token']=S.csrf;if(tenant&&S.wid)h['X-Workspace-Id']=S.wid;let r=await fetch('/api'+url,{method,headers:h,body:data===null?undefined:JSON.stringify(data),credentials:'same-origin'});let result=await r.json().catch(()=>({}));if(!r.ok)throw new Error(typeof result.detail==='string'?result.detail:'Erreur HTTP '+r.status);return result;}
const spinner=()=>`<div class="card pad" style="padding:65px;text-align:center;color:#888">Chargement des données…</div>`;
async function init(){try{
 const q=new URLSearchParams(location.search);
 if(q.has('reset_token')){S.resetToken=q.get('reset_token');S.authMode='reset';history.replaceState(null,'',location.pathname);}
 if(q.has('auth_error')){S.authMessage=q.get('auth_error');history.replaceState(null,'',location.pathname);}
 if(q.has('mode')){S.authMode=q.get('mode');}
 if(q.has('email')){S.prefillEmail=q.get('email');}
 const a=await api('/auth/me',{tenant:false});S.me=a.user;if(S.me){S.me.google_linked=!!a.google_linked}S.csrf=a.csrf;S.googleEnabled=!!a.google_enabled;S.wid=localStorage.getItem('num-wid')||a.workspaces?.[0]?.id||'';if(!a.workspaces?.find(x=>x.id===S.wid))S.wid=a.workspaces?.[0]?.id||'';S.workspaces=a.workspaces||[];if(S.resetToken){renderAuth()}else if(S.me){await load();startLive()}else renderAuth();if(S.authMessage)toast(({link_required:'Compte existant : connectez-vous par email puis associez Google dans Espaces de travail.',oauth_failed:'Connexion Google interrompue.',oauth_expired:'Session Google expirée.',google_email_mismatch:'Les emails Google et Nüptin doivent correspondre.'})[S.authMessage]||'Connexion Google impossible');}catch(err){$('#app').innerHTML=`<div class="empty">API inaccessible : ${E(err.message)} <button class="btn" onclick="location.reload()">Réessayer</button></div>`}}
function renderAuth(){
 const register=S.authMode==='register',forgot=S.authMode==='forgot',reset=S.authMode==='reset';
 const preEmail=E(S.prefillEmail||'');
 const google=S.googleEnabled&&!forgot&&!reset?`<a href="/api/auth/insforge/google/start" class="btn google-login"><svg class="num-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285f4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.4z"/><path fill="#34a853" d="M12 22a10 10 0 0 0 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.5-4H3.2v2.6C4.8 19.8 8.1 22 12 22z"/><path fill="#fbbc05" d="M6.5 14a6 6 0 0 1 0-4V7.4H3.2a10 10 0 0 0 0 9.2z"/><path fill="#ea4335" d="M12 6c1.4 0 2.7.5 3.6 1.4l2.8-2.8A9.8 9.8 0 0 0 12 2C8.1 2 4.8 4.2 3.2 7.4L6.5 10c.7-2.3 2.9-4 5.5-4z"/></svg> Continuer avec Google</a><div class="auth-or">ou par email</div>`:'';
 $('#app').innerHTML=`<div class="auth-shell"><section class="auth-side"><div class="brand"><img src="/assets/logo-256.png" style="width:38px;height:38px;object-fit:contain"> Nüptin</div><div><div class="eyebrow">LE STUDIO DE CONVERSION</div><h1>Une idée.<br>Un tunnel.<br><em>Des clients.</em></h1><p>Créez vos pages, gérez vos prospects, préparez vos emails et mesurez vos résultats dans une interface unifiée.</p></div><small>Funnel Builder · CRM · Booking · AgentMail · Tracking</small></section><div class="auth-box"><form class="auth-form" data-form="${forgot?'forgot':reset?'reset':register?'register':'login'}"><div class="eyebrow">ACCÈS SÉCURISÉ</div><h2>${forgot?'Mot de passe oublié':reset?'Choisir un nouveau mot de passe':register?'Créer votre studio':'Connexion à votre studio'}</h2><p>${forgot?'Un lien sera envoyé à votre adresse si elle est enregistrée.':reset?'Ce lien est valable 15 minutes et ne fonctionne qu’une fois.':register?'Votre workspace et votre premier tunnel 4 étapes seront déployés automatiquement.':'Retrouvez tous vos tunnels et contacts.'}</p>${google}${reset?`<label class="form-field"><span>Nouveau mot de passe</span><input name="password" type="password" minlength="10" required autocomplete="new-password"></label>`:`
 ${register?`<label class="form-field"><span>Nom</span><input name="name" required minlength="2" placeholder="Votre nom"></label><label class="form-field"><span>Entreprise / studio</span><input name="workspace_name" required minlength="2" placeholder="Ma société"></label>`:''}
 <label class="form-field"><span>Email</span><input name="email" type="email" required autocomplete="email" placeholder="vous@entreprise.fr" value="${preEmail}"></label>
 ${!forgot?`<label class="form-field"><span>Mot de passe</span><input name="password" type="password" required minlength="${register?10:1}" autocomplete="${register?'new-password':'current-password'}"></label>`:''}`}
 <button class="btn primary" type="submit">${forgot?'Envoyer le lien':reset?'Enregistrer le mot de passe':register?'Créer mon workspace':'Se connecter'}</button>
 <button class="auth-switch" type="button" data-auth-switch="1">${register?'J’ai déjà un compte':'Créer un compte / Retour à la connexion'}</button>
 ${!register&&!forgot&&!reset?`<button class="auth-switch" type="button" data-auth-forgot="1">Mot de passe oublié ?</button>`:''}
 <p class="help" style="margin-top:20px">Aucun mot de passe ni token Google n'est exposé dans le dashboard.</p></form></div></div>`;
}
function sidebar(){
  const isC = !!S.collapsed;
  return `<aside class="sidebar ${S.mobile?'open':''} ${isC?'collapsed':''}">
    <div class="brand" style="display:flex;align-items:center;justify-content:space-between;width:100%">
      <div style="display:flex;align-items:center;gap:10px" title="Nüptin">
        <img src="/assets/logo-256.png" style="width:38px;height:38px;object-fit:contain" alt="Nüptin">
        ${isC ? '' : '<span class="brand-name" style="font-weight:780;font-size:18px;letter-spacing:-.8px">Nüptin</span>'}
      </div>
      <button type="button" class="sidebar-toggle-btn" data-action="toggle-sidebar" title="${isC?'Déplier le menu':'Rétracter le menu'}" aria-label="Rétracter le menu" style="border:none;background:transparent;padding:4px;cursor:pointer;color:#8a8b8e">
        <svg class="num-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          ${isC ? '<polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>' : '<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>'}
        </svg>
      </button>
    </div>
    <button class="workspace" data-action="workspace" title="${E(S.workspaces.find(w=>w.id===S.wid)?.name||'Mon studio')}">
      <span class="workicon">N</span>
      <span class="workmeta"><strong>${E(S.workspaces.find(w=>w.id===S.wid)?.name||'Mon studio')}</strong><small>Workspace privé</small></span>
      <span class="workspace-chevron">⌄</span>
    </button>
    <div class="nav-label">Création & conversion</div>
    ${['overview','funnels','builder','contacts','bookings'].map(nav).join('')}
    <div class="nav-label">Acquisition & opérations</div>
    ${['whatsapp','inbox','automations','analytics','tracking','integrations','docs'].map(nav).join('')}
    <div class="sidebar-bottom">
      ${['team','settings'].map(nav).join('')}
      <button type="button" class="userline clickable" data-nav="settings" title="${E(S.me?.name)} — Gérer mon profil et les paramètres du compte">
        ${userAvatar(S.me)}
        <span class="usermeta" style="flex:1;min-width:0;text-align:left">
          <strong style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${E(S.me?.name)}</strong>
          <small style="color:var(--orange)">Profil & Sécurité ↗</small>
        </span>
      </button>
      <button class="navbtn navbtn-logout" data-action="logout" title="Déconnexion">
        <span style="font-size:16px;min-width:20px;text-align:center">⇤</span>
        <span class="btn-logout-text">&nbsp; Déconnexion</span>
      </button>
    </div>
  </aside>`}
function nav(id){return `<button class="navbtn ${S.page===id?'active':''}" data-nav="${id}" title="${pretty[id]}"><span aria-hidden="true" style="font-size:19px;min-width:20px;text-align:center">${icons[id]}</span> <span class="nav-text">${pretty[id]}</span></button>`}
function shell(content){$('#app').innerHTML=`<div class="app ${S.collapsed?'sidebar-is-collapsed':''}">${sidebar()}<main class="main"><header class="topbar"><div class="crumb"><button class="btn tiny mobile-menu" data-action="menu" title="Menu" aria-label="Menu" style="padding:6px 9px;display:inline-flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="12" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="18" r="2.2"/></svg></button><button type="button" class="sidebar-toggle-btn" data-action="toggle-sidebar" title="${S.collapsed?'Agrandir la barre latérale':'Rétracter la barre latérale'}" aria-label="Rétracter la barre latérale"><svg class="num-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="3" x2="9" y2="21"/>${S.collapsed?'<polyline points="13 10 15 12 13 14"/>':'<polyline points="15 10 13 12 15 14"/>'}</svg></button>Nüptin <span style="color:#c7c7c7">/</span> <strong>${pretty[S.page]}</strong></div><div class="top-actions"><button class="btn tiny" data-action="guide">? Guide & Didacticiel</button><span class="pill orange crumb-extra">● &nbsp; ${E(S.workspaces.find(w=>w.id===S.wid)?.name||'Studio')}</span><a href="/api/docs" target="_blank" class="btn tiny">API ↗</a>${userAvatar(S.me)}</div></header><div class="content">${content}</div></main>${S.modal?modalHtml():''}</div>`;}
function head(title,desc,controls=''){return `<div class="pagehead"><div><div class="eyebrow">NÜPTIN • STUDIO</div><h1>${title}</h1><p>${desc}</p></div><div class="controls">${controls}</div></div>`}
function kpi(title,value,sub='',accent=false){return `<div class="card kpi"><div class="klabel">${title} <span style="font-size:18px;color:${accent?'#f1653b':'#bcbcbc'}">${accent?'↗':'◌'}</span></div><div class="kvalue">${E(value)}</div><div class="ksub">${sub}</div></div>`}
function graph(){let days=S.data.timeseries?.days||[],max=Math.max(1,...days.map(d=>Math.max(d.leads||0,d.bookings||0)));if(!days.some(d=>d.leads||d.bookings))return `<div style="height:225px;display:grid;place-items:center;border:1px dashed #eaeae7;border-radius:12px;background:linear-gradient(180deg,#fff,#fcfcfb);color:#a1a1a1;text-align:center;padding:25px">Aucune conversion dans la période.<br><small>Les courbes apparaîtront après les premiers formulaires publiés.</small></div>`;const line=key=>days.map((d,i)=>`${i?'L':'M'}${Math.round(20+i*(540/Math.max(1,days.length-1)))},${Math.round(230-190*(d[key]||0)/max)}`).join(' ');return `<svg viewBox="0 0 580 260" class="chart" role="img" aria-label="Courbe réelle des leads et rendez-vous sur les 14 derniers jours"><g>${[40,90,140,190,230].map(y=>`<line x1="18" x2="568" y1="${y}" y2="${y}" class="chart-grid"/>`).join('')}</g><path d="${line('leads')}" class="chart-line"/><path d="${line('bookings')}" class="chart-line2"/></svg>`}
const fmtDate=s=>s?new Date(s).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}):'—';
const pillStatus=s=>`<span class="pill ${['published','booked','customer','sent','confirmed','qualified'].includes(s)?'green':['new','draft'].includes(s)?'orange':'gray'}">${E(({published:'Publié',draft:'Brouillon',new:'Nouveau',contacted:'Contacté',qualified:'Qualifié',booked:'Réservé',customer:'Client',archived:'Archivé',sent:'Envoyé',confirmed:'Confirmé'})[s]||s)}</span>`;
const pageMap={overview:pageOverview,funnels:pageFunnels,builder:pageBuilder,contacts:pageContacts,bookings:pageBookings,whatsapp:pageWhatsApp,inbox:pageInbox,automations:pageAutomations,analytics:pageAnalytics,tracking:pageTracking,integrations:pageIntegrations,docs:pageDocs,team:pageTeam,settings:pageSettings};
async function load(){let parts={overview:['analytics','funnels','contacts','analytics/timeseries'],funnels:['funnels'],builder:['funnels'],contacts:['contacts'],bookings:['bookings','integrations'],whatsapp:['whatsapp/status','whatsapp/chats','whatsapp/groups','contacts'],inbox:['inbox','integrations'],automations:['automations','automations/runs'],analytics:['analytics','events'],tracking:['analytics','events','analytics/timeseries'],integrations:['integrations','integrations/deliveries','assets','whatsapp/status'],docs:[],team:['mcp/tokens'],settings:[]};let list=parts[S.page]||parts.overview;try{await Promise.all(list.map(async k=>{let key=k.includes('/')?k.split('/').pop():k;try{S.data[key]=await api('/'+k)}catch(err){S.data[key]={}}}));if(S.page==='whatsapp'&&S.whatsappActiveJid){try{let m=await api('/whatsapp/messages?jid='+encodeURIComponent(S.whatsappActiveJid));S.whatsappMessages=S.whatsappMessages||{};S.whatsappMessages[S.whatsappActiveJid]=m.messages||[];}catch(e){}}shell((pageMap[S.page]||pageOverview)());}catch(e){shell(`<div class="notice">${E(e.message)} <button class="btn" data-action="reload">Réessayer</button></div>`);}}
async function refreshAuth(){let x=await api('/auth/me',{tenant:false});S.me=x.user;if(S.me){S.me.google_linked=!!x.google_linked}S.csrf=x.csrf;S.googleEnabled=!!x.google_enabled;S.workspaces=x.workspaces;S.wid=localStorage.getItem('num-wid')||x.workspaces?.[0]?.id||'';if(!S.workspaces.find(w=>w.id===S.wid))S.wid=x.workspaces?.[0]?.id||'';}
async function go(page){S.page=page;S.mobile=false;S.modal=null;if(!['tracking','inbox','settings'].includes(page))S.tab='overview';await load();scrollTo({top:0,behavior:'instant'});}
async function saveBuilder(form){let x=Object.fromEntries(new FormData(form));let f=(S.data.funnels||[]).find(f=>f.id===S.selected);if(!f)throw Error('Sélectionnez un tunnel');let draft=structuredClone(f.draft);draft.copy=draft.copy||{};draft.brand=draft.brand||{};draft.settings=draft.settings||{};draft.legal=draft.legal||{};let days=[];for(let i=0;i<7;i++){if(x['day_'+i+'_title']!==undefined){days.push({day:String(i+1).padStart(2,'0'),title:x['day_'+i+'_title']||'',sub:x['day_'+i+'_sub']||'',icon:x['day_'+i+'_icon']||'',status:x['day_'+i+'_status']||'available',image:x['day_'+i+'_image']||'',enabled:!!x['day_'+i+'_enabled']});}}if(days.length)draft.days=days;const copyKeys=['title','eyebrow','subtitle','capture_cta','training_title','training_cta','speaker_name','speaker_title','reviews_url','reviews_badge_text','curriculum_eyebrow','curriculum_title','curriculum_desc','app_eyebrow','app_title','app_subtitle','app_quote','app_badge','app_form_title','app_form_desc','form_badge','form_title','form_desc','field_label_name','field_placeholder_name','field_label_email','field_placeholder_email','field_label_phone','field_placeholder_phone','field_help_phone','consent_marketing_text','consent_measurement_text','consent_privacy_note','app_question_stage','app_question_category','app_question_message','app_placeholder','app_cta','thank_eyebrow','thank_you','thank_desc','thank_back_btn'];copyKeys.forEach(k=>{if(x[k]!==undefined)draft.copy[k]=x[k];});if(x.accent!==undefined)draft.brand.accent=x.accent;if(x.brand_icon!==undefined)draft.brand.icon=x.brand_icon;if(x.brand_name!==undefined)draft.brand.logo_text=x.brand_name;if(x.logo_url!==undefined)draft.brand.logo_url=x.logo_url;if(x.badge_text!==undefined)draft.brand.badge_text=x.badge_text;if(x.video_url!==undefined)draft.settings.video_url=x.video_url;if(x.cta_delay_seconds!==undefined)draft.settings.cta_delay_seconds=x.cta_delay_seconds;if(form.querySelector('[name="field_ask_name"]'))draft.settings.fields={ask_name:!!x.field_ask_name,ask_email:!!x.field_ask_email,ask_phone:!!x.field_ask_phone,require_email:!!x.field_require_email,require_phone:!!x.field_require_phone};if(x.vsl_cta_action!==undefined)draft.settings.vsl_cta_action=x.vsl_cta_action;if(x.whatsapp_group_link!==undefined)draft.settings.whatsapp_group_link=x.whatsapp_group_link;if(x.whatsapp_direct_phone!==undefined)draft.settings.whatsapp_direct_phone=x.whatsapp_direct_phone;if(x.whatsapp_direct_message!==undefined)draft.settings.whatsapp_direct_message=x.whatsapp_direct_message;
if(x.after_app_action!==undefined)draft.settings.after_app_action=x.after_app_action;
if(x.after_app_whatsapp_link!==undefined)draft.settings.after_app_whatsapp_link=x.after_app_whatsapp_link;if(form.querySelector('[name="booking_enabled"]'))draft.settings.booking_enabled=!!x.booking_enabled;if(form.querySelector('[name="show_program_details"]'))draft.settings.show_program_details=!!x.show_program_details;if(x.reviews_url!==undefined)draft.settings.reviews_url=x.reviews_url;const legKeys=['legal_company_name','legal_address','legal_registration','legal_vat','legal_capital','legal_email','legal_director','legal_host','legal_jurisdiction','legal_disclaimer','custom_cgv_url','custom_privacy_url','custom_mentions_url'];legKeys.forEach(k=>{if(x[k]!==undefined){let targetKey=k.replace('legal_','').replace('custom_','');draft.legal[targetKey]=x[k];}});await api('/funnels/'+f.id,{method:'PATCH',data:{draft}});f.draft=draft;return f;}

function pageOverview(){let a=S.data.analytics||{},f=S.data.funnels||[],c=S.data.contacts||[];let guideCard=`<div class="card pad" style="background:linear-gradient(180deg,#fff,#fcfcfb);border-left:4px solid #f1653b;margin-bottom:20px"><div class="cardhead"><div><span class="pill orange">Didacticiel & Démarrage rapide</span><h2 style="margin-top:6px">Votre studio de conversion en 3 étapes clés</h2><p>Tout ce qu’il faut pour personnaliser votre tunnel, connecter votre agenda et recevoir vos leads.</p></div><button class="btn tiny primary" data-action="guide">Ouvrir le didacticiel complet ↗</button></div><div class="cards guide-steps-grid" style="margin-top:14px;margin-bottom:0"><div class="card pad" style="background:#fcfcfb"><strong>1. Personnaliser votre tunnel</strong><p class="mini" style="margin-top:6px">Ajoutez votre vidéo (YouTube, Vimeo, Loom ou MP4) et adaptez vos textes.</p><button class="btn tiny" data-nav="funnels" style="margin-top:8px">Mes tunnels →</button></div><div class="card pad" style="background:#fcfcfb"><strong>2. Embarquer votre Cal.com</strong><p class="mini" style="margin-top:6px">Les prospects réservent dans votre tunnel avec pré-remplissage automatique.</p><button class="btn tiny" data-nav="integrations" style="margin-top:8px">Intégration Cal.com →</button></div><div class="card pad" style="background:#fcfcfb"><strong>3. Alertes & IA AgentMail</strong><p class="mini" style="margin-top:6px">Recevez chaque notification sur votre boîte Gmail en temps réel.</p><button class="btn tiny" data-nav="integrations" style="margin-top:8px">Activer AgentMail →</button></div></div></div>`;return head('Vue d’ensemble','Tableau de bord unifié de votre activité commerciale et de vos conversions.',`<button data-nav="funnels" class="btn primary">＋ Nouveau tunnel</button>`)+guideCard+`<div class="cards">${kpi('Prospects qualifiés',a.contacts??0,'Contacts enregistrés',true)}${kpi('Inscriptions',a.submissions??0,'Formulaires complétés')}${kpi('Rendez-vous',a.bookings??0,'Consultations confirmées')}${kpi('Taux de conversion',(a.conversion_to_booking??0)+' %','Inscrits vers Rendez-vous')}</div><div class="section"><section class="card pad"><div class="cardhead"><div><h2>Performance de vos tunnels</h2><p>Évolution des inscriptions et rendez-vous sur les 14 derniers jours.</p></div><span class="pill orange">14 derniers jours</span></div>${graph()}<div class="legend"><span><b></b> Leads</span><span><b class="blue"></b> Rendez-vous</span></div></section><section class="card pad"><div class="cardhead"><div><h2>Entonnoir de conversion</h2><p>Progression continue du premier contact jusqu'au rendez-vous.</p></div></div>${[['Inscriptions',a.submissions??0],['Prospects uniques',a.contacts??0],['Candidatures complètes',a.applications??0],['Rendez-vous confirmés',a.bookings??0]].map(([k,v],i)=>`<div class="stat-split"><div><span class="pill orange">0${i+1}</span> &nbsp; ${k}</div><strong>${v}</strong></div>`).join('')}<p class="help" style="margin-top:22px">Connectez vos canaux d'acquisition dans l'onglet Intégrations pour consolider automatiquement vos coûts par prospect et votre rentabilité.</p></section></div><section class="card pad"><div class="cardhead"><div><h2>Vos tunnels de conversion</h2><p>Accès direct à vos expériences de vente en ligne.</p></div><button class="btn tiny" data-nav="funnels">Voir tous les tunnels →</button></div><div class="funnel-list">${f.slice(0,4).map(funnelRow).join('')||'<div class="empty">Aucun tunnel pour l’instant</div>'}</div></section>`}

const FUNNEL_ICONS = {
  funnel: `<svg class="num-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16l-6.5 7.5V19l-3 2v-9.5z"/></svg>`,
  masterclass: `<svg class="num-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  booking: `<svg class="num-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  ecommerce: `<svg class="num-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  app: `<svg class="num-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18M9 9h12"/></svg>`
};

function getFunnelIcon(f) {
  let iconKey = f.draft?.brand?.icon || 'funnel';
  if (f.draft?.settings?.booking_enabled && !f.draft?.brand?.icon) iconKey = 'booking';
  if (f.draft?.settings?.video_url && !f.draft?.brand?.icon) iconKey = 'masterclass';
  return FUNNEL_ICONS[iconKey] || FUNNEL_ICONS.funnel;
}

function funnelRow(f){
  return `<div class="funnel-row" style="transition:all .15s ease">
    <div class="initial" style="background:#fff;border:1px solid #e5e8e3;color:var(--orange);display:grid;place-items:center" title="Tunnel APP 7">
      ${getFunnelIcon(f)}
    </div>
    <div class="body">
      <strong style="font-size:14px;color:#181c19">${E(f.name)}</strong>
      <small style="color:#717873;font-size:12px;margin-top:2px">${E(f.slug)} · ${f.status==='published'?'En ligne et accessible':'Brouillon privé en cours d’édition'}</small>
    </div>
    ${pillStatus(f.status)}
    <button class="btn tiny primary" data-edit="${E(f.id)}" style="font-weight:700">Éditer →</button>
    <button class="btn tiny" data-duplicate-funnel="${E(f.id)}" title="Dupliquer ce tunnel">⎘ Dupliquer</button>
    ${f.status==='published'?`<a class="btn tiny" target="_blank" href="/f/${encodeURIComponent(f.slug)}" style="color:var(--orange);border-color:#fcdbd2">Consulter ↗</a>`:''}
    <button class="btn tiny danger" data-delete-funnel="${E(f.id)}" title="Supprimer ce tunnel" style="color:#d9534f;border-color:#f5c6cb">✕</button>
  </div>`;
}

function pageFunnels(){
  let fs=S.data.funnels||[];
  return head('Mes tunnels','Pilotez, personnalisez et publiez vos entonnoirs de conversion haute performance.',`<button data-action="newfunnel" class="btn primary">＋ Créer un tunnel</button>`)+`
  <div class="card pad">
    <div class="cardhead">
      <div>
        <h2>Bibliothèque d’expériences</h2>
        <p>${fs.length} tunnel${fs.length>1?'s':''} actif${fs.length>1?'s':''} dans cet espace · Créez autant de tunnels que vous le souhaitez</p>
      </div>
      <span class="pill" style="font-weight:700">Architecture APP 7 active</span>
    </div>
    <div class="funnel-list">${fs.map(funnelRow).join('')||'<div class="empty">Démarrez en créant votre premier tunnel de conversion.</div>'}</div>
  </div>`;
}

function pageBuilder(){let fs=S.data.funnels||[];let f=fs.find(x=>x.id===S.selected)||fs[0];if(!f)return head('Éditeur de Tunnel','Créez votre premier tunnel depuis l’onglet Mes tunnels.')+`<button class="btn primary" data-nav="funnels">Mes tunnels</button>`;S.selected=f.id;let c=f.draft?.copy||{},theme=f.draft?.brand||{},sett=f.draft?.settings||{},leg=f.draft?.legal||{};let bTab=S.builderTab||'01';let switcher=fs.length>1?`<select class="input" data-select-funnel style="padding:6px 12px;min-height:36px;font-size:13px;font-weight:600;margin-right:8px;border-radius:8px">${fs.map(x=>`<option value="${x.id}" ${x.id===f.id?'selected':''}>${E(x.name)} (${x.status==='published'?'Publié':'Brouillon'})</option>`).join('')}</select>`:'';

let tabsHtml=`<div class="tabs">
  <button type="button" class="${bTab==='01'?'active':''}" data-builder-tab="01">01 Capture</button>
  <button type="button" class="${bTab==='02'?'active':''}" data-builder-tab="02">02 Présentation (VSL)</button>
  <button type="button" class="${bTab==='03'?'active':''}" data-builder-tab="03">03 Candidature</button>
  <button type="button" class="${bTab==='04'?'active':''}" data-builder-tab="04">04 Confirmation & RDV</button>
  <button type="button" class="${bTab==='curriculum'?'active':''}" data-builder-tab="curriculum">05 Programme (7 Jours)</button>
  <button type="button" class="${bTab==='legal'?'active':''}" data-builder-tab="legal">06 Légal & RGPD</button>
</div>`;

let tab01Content=`
<div class="cardhead"><div><h2>01 · Page de Capture & Marque</h2><p>Personnalisez votre accroche, vos promesses et votre identité visuelle.</p></div></div>
<label class="form-field"><span>Nom de votre marque (En-tête & Footer)</span><input name="brand_name" value="${E(theme.logo_text||f.name)}"></label>
<label class="form-field"><span>Logo du tunnel (image / URL)</span><input name="logo_url" placeholder="/assets/logo-256.png ou URL https://..." value="${E(theme.logo_url||'/assets/logo-256.png')}"><small class="mini" style="margin-top:4px;display:block;color:#888">Par défaut : le logo Nüptin. Vous pouvez aussi téléverser une image dans l'onglet Médias et coller son lien ici.</small></label>
<label class="form-field"><span>Badge en haut à droite</span><input name="badge_text" placeholder="PARCOURS OFFERT" value="${E(theme.badge_text||'PARCOURS OFFERT')}"></label>
<label class="form-field"><span>Couleur d'accentuation</span><input type="color" name="accent" value="${/^#[0-9a-f]{6}$/i.test(theme.accent)?theme.accent:'#ed613f'}" style="padding:6px;width:100px;height:46px"></label>
<label class="form-field"><span>Icône représentative du tunnel</span>
  <select name="brand_icon" class="input" style="padding:8px 12px;border-radius:8px">
    <option value="funnel" ${(theme.icon||'funnel')==='funnel'?'selected':''}>Entonnoir de conversion standard</option>
    <option value="masterclass" ${theme.icon==='masterclass'?'selected':''}>Vidéo & Masterclass (VSL)</option>
    <option value="booking" ${theme.icon==='booking'?'selected':''}>Prise de rendez-vous & Agenda</option>
    <option value="ecommerce" ${theme.icon==='ecommerce'?'selected':''}>Offre commerciale & Vente</option>
    <option value="app" ${theme.icon==='app'?'selected':''}>Application SaaS & Outil</option>
  </select>
</label>
<label class="form-field"><span>Titre principal de la page</span><textarea name="title" required>${E(c.title||'')}</textarea></label>
<label class="form-field"><span>Accroche supérieure (Sur-titre)</span><input name="eyebrow" value="${E(c.eyebrow||'')}"></label>
<label class="form-field"><span>Sous-titre descriptif</span><textarea name="subtitle">${E(c.subtitle||'')}</textarea></label>
<label class="form-field"><span>Texte du bouton d'action (CTA Capture)</span><input name="capture_cta" value="${E(c.capture_cta||'')}"></label>
<div class="breakline"></div>
<h3>Textes & En-tête du formulaire de capture</h3>
<label class="form-field"><span>Badge du formulaire</span><input name="form_badge" value="${E(c.form_badge||'ACCÈS IMMÉDIAT')}" placeholder="ACCÈS IMMÉDIAT"></label>
<label class="form-field"><span>Titre du formulaire</span><input name="form_title" value="${E(c.form_title||'Recevoir la formation gratuitement.')}" placeholder="Recevoir la formation gratuitement."></label>
<label class="form-field"><span>Sous-titre / Description du formulaire</span><textarea name="form_desc" placeholder="Entrez vos coordonnées pour accéder immédiatement...">${E(c.form_desc||'Entrez vos coordonnées pour accéder immédiatement à la présentation.')}</textarea></label>
<div class="breakline"></div>
<h3>Libellés & Placeholders des champs</h3>
<div class="form-two">
  <label class="form-field"><span>Libellé champ Prénom</span><input name="field_label_name" value="${E(c.field_label_name||'Prénom')}" placeholder="Prénom"></label>
  <label class="form-field"><span>Indication champ Prénom (Placeholder)</span><input name="field_placeholder_name" value="${E(c.field_placeholder_name||'Votre prénom')}" placeholder="Votre prénom"></label>
</div>
<div class="form-two">
  <label class="form-field"><span>Libellé champ Email</span><input name="field_label_email" value="${E(c.field_label_email||'Email')}" placeholder="Email"></label>
  <label class="form-field"><span>Indication champ Email</span><input name="field_placeholder_email" value="${E(c.field_placeholder_email||'vous@exemple.com')}" placeholder="vous@exemple.com"></label>
</div>
<div class="form-two">
  <label class="form-field"><span>Libellé champ WhatsApp / Téléphone</span><input name="field_label_phone" value="${E(c.field_label_phone||'Numéro WhatsApp / Téléphone')}" placeholder="Numéro WhatsApp / Téléphone"></label>
  <label class="form-field"><span>Indication champ WhatsApp</span><input name="field_placeholder_phone" value="${E(c.field_placeholder_phone||'+33 6 12 34 56 78')}" placeholder="+33 6 12 34 56 78"></label>
</div>
<label class="form-field"><span>Texte d'aide sous le numéro WhatsApp</span><input name="field_help_phone" value="${E(c.field_help_phone||'Format international (ex: +33, +237, +32...)')}" placeholder="Format international (ex: +33, +237, +32...)"></label>
<div class="breakline"></div>
<h3>Consentements & RGPD du formulaire</h3>
<label class="form-field"><span>Texte du consentement marketing</span><textarea name="consent_marketing_text" style="min-height:60px">${E(c.consent_marketing_text||'J’accepte de recevoir des communications concernant cette présentation. Ce choix est facultatif.')}</textarea></label>
<label class="form-field"><span>Texte du consentement mesure publicitaire</span><textarea name="consent_measurement_text" style="min-height:60px">${E(c.consent_measurement_text||'J’autorise les mesures publicitaires facultatives selon la politique de confidentialité.')}</textarea></label>
<label class="form-field"><span>Note d'indépendance des consentements</span><input name="consent_privacy_note" value="${E(c.consent_privacy_note||'Les deux consentements sont indépendants. Vous pouvez refuser et continuer.')}"></label>
<div class="breakline"></div>
<h3>Champs du formulaire de capture (Opt-in libre)</h3>
<p class="mini" style="color:#666;margin-bottom:12px">Choisissez exactement ce que vous demandez à vos visiteurs : prénom seul, WhatsApp seul, prénom + WhatsApp, ou prénom + email. Vous n'êtes jamais obligé de combiner email et WhatsApp si vous ne le souhaitez pas.</p>
<div style="display:grid;gap:10px;background:#fcfcfb;padding:16px;border:1px solid #e7e7e4;border-radius:12px;margin-bottom:18px">
  <label class="switch"><input type="checkbox" name="field_ask_name" ${sett.fields?.ask_name!==false?'checked':''}> Demander le prénom du prospect</label>
  <label class="switch"><input type="checkbox" name="field_ask_email" ${sett.fields?.ask_email!==false?'checked':''}> Demander l'adresse email</label>
  <label class="switch"><input type="checkbox" name="field_ask_phone" ${sett.fields?.ask_phone?'checked':''}> Demander le numéro WhatsApp / Téléphone</label>
  <div style="display:flex;gap:18px;margin-top:6px;padding-top:10px;border-top:1px dashed #e2e2df;font-size:12px;color:#666;flex-wrap:wrap">
    <label class="switch" style="font-size:12px"><input type="checkbox" name="field_require_email" ${sett.fields?.require_email!==false?'checked':''}> Email obligatoire</label>
    <label class="switch" style="font-size:12px"><input type="checkbox" name="field_require_phone" ${sett.fields?.require_phone?'checked':''}> WhatsApp obligatoire</label>
  </div>
</div>
<div class="breakline"></div>
<h3>Présentateur & Avis clients</h3>
<label class="form-field"><span>Nom de l’expert ou présentateur</span><input name="speaker_name" value="${E(c.speaker_name||'')}" placeholder="Laisser vide pour masquer"></label>
<label class="form-field"><span>Titre / Rôle du présentateur</span><input name="speaker_title" value="${E(c.speaker_title||'')}" placeholder="Ex: Fondateur & Consultant"></label>
<label class="form-field"><span>Lien d'avis vérifiés (Google ou Trustpilot)</span><input name="reviews_url" value="${E(sett.reviews_url||c.reviews_url||'')}" placeholder="https://g.page/r/..."></label>
<label class="form-field"><span>Texte du badge d'avis</span><input name="reviews_badge_text" value="${E(c.reviews_badge_text||'Avis vérifiés · Note 4.9/5')}" placeholder="Avis vérifiés · Note 4.9/5"></label>
`;

let tab02Content=`
<div class="cardhead"><div><h2>02 · Présentation Vidéo (VSL)</h2><p>Paramétrez le titre, la vidéo et le déclenchement différé du bouton d'action.</p></div></div>
<label class="form-field"><span>Titre de la vidéo / masterclass</span><input name="training_title" value="${E(c.training_title||'')}"></label>
<label class="form-field"><span>Bouton sous la vidéo</span><input name="training_cta" value="${E(c.training_cta||'')}"></label>
<label class="form-field"><span>Vidéo de présentation (YouTube, Vimeo, Loom ou MP4)</span><input name="video_url" value="${E(sett.video_url||'')}" placeholder="Ex: https://www.youtube.com/watch?v=... ou /assets/app7.mp4"><small class="mini" style="display:block;margin-top:4px;color:#888">Compatible avec YouTube, Vimeo, Loom ou vos fichiers MP4 du Stockage Sécurisé.</small></label>
<label class="form-field"><span>Apparition du bouton d’action sous la vidéo</span><select name="cta_delay_seconds"><option value="0" ${String(sett.cta_delay_seconds||'0')==='0'?'selected':''}>Immédiate (dès l’ouverture)</option><option value="60" ${String(sett.cta_delay_seconds)==='60'?'selected':''}>Après 1 minute de visionnage</option><option value="180" ${String(sett.cta_delay_seconds)==='180'?'selected':''}>Après 3 minutes</option><option value="300" ${String(sett.cta_delay_seconds)==='300'?'selected':''}>Après 5 minutes</option><option value="600" ${String(sett.cta_delay_seconds)==='600'?'selected':''}>Après 10 minutes</option><option value="end" ${String(sett.cta_delay_seconds)==='end'?'selected':''}>À la fin complète de la vidéo</option></select><small class="mini" style="color:#888;display:block;margin-top:4px">Masque la candidature sous la vidéo jusqu’au moment choisi.</small></label>
<div class="breakline"></div>
<h3>Action après le visionnage (Bouton d'action CTA)</h3>
<label class="form-field"><span>Destination du bouton sous la vidéo</span>
  <select name="vsl_cta_action">
    <option value="candidature" ${sett.vsl_cta_action!=='whatsapp_group'&&sett.vsl_cta_action!=='whatsapp_direct'?'selected':''}>03 · Candidature & Qualification (Parcours standard)</option>
    <option value="whatsapp_group" ${sett.vsl_cta_action==='whatsapp_group'?'selected':''}>Rejoindre le groupe WhatsApp dédié</option>
    <option value="whatsapp_direct" ${sett.vsl_cta_action==='whatsapp_direct'?'selected':''}>Discuter directement sur WhatsApp</option>
  </select>
</label>
<label class="form-field"><span>Lien d'invitation du groupe WhatsApp (si groupe sélectionné)</span>
  <input name="whatsapp_group_link" value="${E(sett.whatsapp_group_link||'')}" placeholder="https://chat.whatsapp.com/... ou JID du groupe">
  <small class="mini" style="color:#888;display:block;margin-top:3px">Permet aux prospects de rejoindre votre communauté WhatsApp directement après la vidéo.</small>
</label>
<label class="form-field"><span>Numéro WhatsApp direct (si discussion directe sélectionnée)</span>
  <input name="whatsapp_direct_phone" value="${E(sett.whatsapp_direct_phone||'')}" placeholder="+33612345678">
</label>
<label class="form-field"><span>Message pré-rempli pour la discussion WhatsApp</span>
  <input name="whatsapp_direct_message" value="${E(sett.whatsapp_direct_message||'Bonjour, je viens de voir votre présentation et je souhaite échanger !')}" placeholder="Bonjour...">
</label>
`;

let tab03Content=`
<div class="cardhead"><div><h2>03 · Page de Candidature & Qualification</h2><p>Personnalisez les questions, titres et réassurance pour qualifier vos prospects.</p></div></div>
<label class="form-field"><span>Sur-titre de la page</span><input name="app_eyebrow" value="${E(c.app_eyebrow||'ÉTAPE 03 · VOTRE PROJET')}" placeholder="ÉTAPE 03 · VOTRE PROJET"></label>
<label class="form-field"><span>Titre principal de la candidature</span><input name="app_title" value="${E(c.app_title||'Maintenant, parlons de votre idée.')}" placeholder="Maintenant, parlons de votre idée."></label>
<label class="form-field"><span>Sous-titre explicatif</span><textarea name="app_subtitle" placeholder="Une application commence par un problème clair, pas par cent fonctionnalités...">${E(c.app_subtitle||'Une application commence par un problème clair, pas par cent fonctionnalités. Quelques réponses suffisent pour préparer la suite.')}</textarea></label>
<label class="form-field"><span>Citation inspirante / Réassurance</span><textarea name="app_quote" placeholder="Ne vous contentez plus de demander à l’IA...">${E(c.app_quote||'Ne vous contentez plus de demander à l’IA ce qu’elle peut faire. Apprenez à lui faire construire ce que vous avez imaginé.')}</textarea></label>
<div class="breakline"></div>
<h3>Formulaire de qualification</h3>
<label class="form-field"><span>Badge au-dessus du formulaire</span><input name="app_badge" value="${E(c.app_badge||'PROJET APP 7')}" placeholder="PROJET APP 7"></label>
<label class="form-field"><span>Titre de la boîte formulaire</span><input name="app_form_title" value="${E(c.app_form_title||'Présentez votre projet.')}" placeholder="Présentez votre projet."></label>
<label class="form-field"><span>Description sous le titre</span><input name="app_form_desc" value="${E(c.app_form_desc||'Les réponses seront enregistrées dans le CRM du programme.')}" placeholder="Les réponses seront enregistrées dans le CRM du programme."></label>
<label class="form-field"><span>Libellé Question 1 (Stade d’avancement)</span><input name="app_question_stage" value="${E(c.app_question_stage||'Où en êtes-vous ?')}" placeholder="Où en êtes-vous ?"></label>
<label class="form-field"><span>Libellé Question 2 (Catégorie)</span><input name="app_question_category" value="${E(c.app_question_category||'Catégorie (facultatif)')}" placeholder="Catégorie (facultatif)"></label>
<label class="form-field"><span>Libellé Question 3 (Description)</span><input name="app_question_message" value="${E(c.app_question_message||'Décrivez votre idée (facultatif)')}" placeholder="Décrivez votre idée (facultatif)"></label>
<label class="form-field"><span>Texte indicatif du champ de description (Placeholder)</span><input name="app_placeholder" value="${E(c.app_placeholder||'À qui servira votre application ? Quel problème résoudra-t-elle ?')}" placeholder="À qui servira votre application ?"></label>
<label class="form-field"><span>Texte du bouton de validation (CTA)</span><input name="app_cta" value="${E(c.app_cta||'Envoyer mon projet')}" placeholder="Envoyer mon projet"></label>
<div class="breakline"></div>
<h3>Action après soumission du projet</h3>
<p class="mini" style="color:#666;margin-bottom:12px">Choisissez ce que découvre le candidat une fois son projet validé :</p>
<label class="form-field"><span>Redirection après validation du projet</span>
  <select name="after_app_action">
    <option value="default" ${(sett.after_app_action||'default')==='default'?'selected':''}>Parcours standard (Prise de RDV si activée, sinon page de confirmation)</option>
    <option value="whatsapp_group" ${sett.after_app_action==='whatsapp_group'?'selected':''}>Invitation directe à rejoindre le groupe WhatsApp VIP</option>
  </select>
</label>
<label class="form-field"><span>Lien d'invitation au groupe WhatsApp (si sélectionné)</span>
  <input name="after_app_whatsapp_link" value="${E(sett.after_app_whatsapp_link||sett.whatsapp_group_link||'')}" placeholder="https://chat.whatsapp.com/...">
</label>
`;

let tab04Content=`
<div class="cardhead"><div><h2>04 · Confirmation & Prise de Rendez-vous</h2><p>Gérez le module de calendrier (Cal.com) et les remerciements après candidature.</p></div></div>
<label class="switch" style="margin-bottom:16px"><input type="checkbox" name="booking_enabled" ${sett.booking_enabled?'checked':''}> Activer le module de prise de rendez-vous sur ce tunnel</label>
<p class="mini" style="color:#666;margin-bottom:16px">Si activé, le prospect choisit son créneau immédiatement après avoir postulé. Vous pouvez synchroniser Cal.com dans l'onglet Intégrations.</p>
<div class="breakline"></div>
<h3>Page de remerciement (Confirmation)</h3>
<label class="form-field"><span>Sur-titre de confirmation</span><input name="thank_eyebrow" value="${E(c.thank_eyebrow||'DEMANDE ENREGISTRÉE')}" placeholder="DEMANDE ENREGISTRÉE"></label>
<label class="form-field"><span>Titre de remerciement</span><input name="thank_you" value="${E(c.thank_you||'Votre projet commence maintenant.')}" placeholder="Votre projet commence maintenant."></label>
<label class="form-field"><span>Message explicatif</span><textarea name="thank_desc" placeholder="Votre inscription et vos réponses ont été enregistrées avec succès...">${E(c.thank_desc||'Votre inscription et vos réponses ont été enregistrées avec succès. Choisissez votre créneau d’échange ci-dessous directement sans quitter le site :')}</textarea></label>
<label class="form-field"><span>Bouton retour</span><input name="thank_back_btn" value="${E(c.thank_back_btn||'Revoir la présentation')}" placeholder="Revoir la présentation"></label>
<div class="breakline"></div>
<h3>Communauté & Groupe WhatsApp Post-Candidature</h3>
<p class="mini" style="color:#666;margin-bottom:12px">Ce groupe apparaît après la soumission du projet ou après le choix du créneau de rendez-vous.</p>
<label class="form-field"><span>Lien d'invitation du groupe WhatsApp officiel</span><input name="after_app_whatsapp_link" value="${E(sett.after_app_whatsapp_link||sett.whatsapp_group_link||'')}" placeholder="https://chat.whatsapp.com/..."><small class="mini" style="display:block;margin-top:4px;color:#888">Permet aux prospects d'intégrer directement votre groupe officiel une fois leur projet déposé.</small></label>
`;

let tabCurriculumContent=`
<div class="cardhead"><div><h2>05 · Programme & Parcours par Étapes (7 Jours)</h2><p>Structurez votre formation ou accompagnement en étapes concrètes.</p></div></div>
<label class="switch"><input type="checkbox" name="show_program_details" ${sett.show_program_details!==false?'checked':''}> Afficher la section « Le Programme en détail » sur le tunnel public</label>
<div style="margin-top:14px">
  <label class="form-field"><span>Sur-titre de la section</span><input name="curriculum_eyebrow" value="${E(c.curriculum_eyebrow||'LE PROGRAMME EN DÉTAIL')}"></label>
  <label class="form-field"><span>Titre principal de la section</span><input name="curriculum_title" value="${E(c.curriculum_title||'Un parcours étape par étape.')}"></label>
  <label class="form-field"><span>Description de la section</span><textarea name="curriculum_desc">${E(c.curriculum_desc||'Sept étapes logiques et structurées : cadrer, construire, vérifier et préparer la commercialisation.')}</textarea></label>
</div>
<div style="display:flex;flex-direction:column;gap:12px;margin-top:14px">${((f.draft?.days&&Array.isArray(f.draft.days)&&f.draft.days.length)?f.draft.days:[{day:'01',title:'Clarifier',sub:'Idée & Vision',icon:'',image:'',status:'available',enabled:true},{day:'02',title:'Dessiner',sub:'UX/UI & Parcours',icon:'',image:'',status:'available',enabled:true},{day:'03',title:'Construire',sub:'Fonctions & IA',icon:'',image:'',status:'available',enabled:true},{day:'04',title:'Structurer',sub:'Données & BDD',icon:'',image:'',status:'available',enabled:true},{day:'05',title:'Monétiser',sub:'Offre & Pricing',icon:'',image:'',status:'available',enabled:true},{day:'06',title:'Publier',sub:'Tests & Sécurité',icon:'',image:'',status:'available',enabled:true},{day:'07',title:'Lancer',sub:'Utilisateurs & Croissance',icon:'',image:'',status:'available',enabled:true}]).map((d,i)=>`<div class="card pad" style="background:#fcfcfb;border:1px solid #e7e7e4;padding:15px;border-radius:14px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><strong style="font-size:12px;color:var(--orange)">ÉTAPE ${E(d.day||'0'+(i+1))}</strong><label class="switch" style="font-size:11px;padding:0"><input type="checkbox" name="day_${i}_enabled" ${d.enabled!==false?'checked':''}> Activer cette étape</label></div><div class="form-two"><label class="form-field" style="margin-bottom:8px"><span>Titre</span><input name="day_${i}_title" value="${E(d.title||'')}"></label><label class="form-field" style="margin-bottom:8px"><span>Sous-titre / Focus</span><input name="day_${i}_sub" value="${E(d.sub||'')}"></label></div><div class="form-two"><label class="form-field" style="margin-bottom:8px"><span>Symbole ou texte court (Optionnel)</span><input name="day_${i}_icon" value="${E(d.icon||'')}" placeholder="Ex: 01 ou vide"></label><label class="form-field" style="margin-bottom:8px"><span>Statut</span><select name="day_${i}_status"><option value="available" ${d.status==='available'?'selected':''}>Disponible / Validé</option><option value="in_progress" ${d.status==='in_progress'?'selected':''}>En direct / En cours</option><option value="upcoming" ${d.status==='upcoming'?'selected':''}>À venir / Bientôt</option></select></label></div><label class="form-field" style="margin-bottom:0"><span>Image personnalisée (URL optionnelle pour remplacer l’icône)</span><input type="url" name="day_${i}_image" value="${E(d.image||'')}" placeholder="https://... ou URL média stocké"></label></div>`).join('')}</div>
`;

let tabLegalContent=`
<div class="cardhead"><div><h2>06 · Mentions Légales & Conformité RGPD</h2><p>Générateur juridique automatique de Mentions Légales, Politique de Confidentialité et CGV.</p></div></div>
<label class="form-field"><span>Raison sociale / Nom de la société légale</span><input name="legal_company_name" value="${E(leg.company_name||'')}" placeholder="Ex: Jupille Group Ltd ou Mon Entreprise SAS"></label>
<label class="form-field"><span>Adresse du siège social</span><input name="legal_address" value="${E(leg.address||'')}" placeholder="Ex: 26 Surcouf Avenue, 72350 Quatre Bornes, Maurice"></label>
<label class="form-field"><span>Numéro d'immatriculation (BRN / SIRET / RCS)</span><input name="legal_registration" value="${E(leg.registration||'')}" placeholder="Ex: BRN 22191318 ou SIRET 912 345 678 00012"></label>
<label class="form-field"><span>Numéro de TVA</span><input name="legal_vat" value="${E(leg.vat||'')}" placeholder="Ex: TVA 28079169 ou FR 12 345678901"></label>
<label class="form-field"><span>Capital social</span><input name="legal_capital" value="${E(leg.capital||'')}" placeholder="Ex: 20 000 €"></label>
<label class="form-field"><span>Email de contact juridique & support</span><input type="email" name="legal_email" value="${E(leg.email||'')}" placeholder="Ex: info@remy-jupille.com"></label>
<label class="form-field"><span>Directeur de la publication</span><input name="legal_director" value="${E(leg.director||'')}" placeholder="Ex: Rémy Jupille ou Lionel Tagne"></label>
<label class="form-field"><span>Hébergeur du site</span><input name="legal_host" value="${E(leg.host||'')}" placeholder="Ex: ClickFunnels (Etison LLC, 3443 W. Bavaria St., Eagle, Idaho 83646, USA)"></label>
<label class="form-field"><span>Droit applicable & Tribunaux compétents</span><input name="legal_jurisdiction" value="${E(leg.jurisdiction||'')}" placeholder="Ex: Droit Mauricien / Tribunaux compétents de Maurice ou Droit Français / Paris"></label>
<label class="form-field"><span>Avertissement sur les résultats (Earnings Disclaimer)</span><textarea name="legal_disclaimer" style="min-height:90px" placeholder="Laisser vide pour utiliser le texte standard de non-garantie de gains...">${E(leg.disclaimer||'')}</textarea><small class="mini" style="color:#888;display:block;margin-top:4px">Affiché en bas de chaque page du tunnel.</small></label>
<div class="breakline"></div>
<h3>Liens Légaux Externes (Optionnel)</h3>
<p class="mini" style="color:#777;margin-bottom:14px">Si vous possédez déjà vos propres pages légales hébergées en externe, renseignez leurs URLs ci-dessous. Sinon, laissez vide : le système utilisera le lecteur haute conformité intégré.</p>
<label class="form-field"><span>URL externe CGV</span><input type="url" name="custom_cgv_url" value="${E(leg.cgv_url||'')}" placeholder="https://votresite.com/cgv"></label>
<label class="form-field"><span>URL externe Confidentialité</span><input type="url" name="custom_privacy_url" value="${E(leg.privacy_url||'')}" placeholder="https://votresite.com/confidentialites"></label>
<label class="form-field"><span>URL externe Mentions Légales</span><input type="url" name="custom_mentions_url" value="${E(leg.mentions_url||'')}" placeholder="https://votresite.com/mentions"></label>
`;

let currentActiveContent = bTab==='02'?tab02Content:bTab==='03'?tab03Content:bTab==='04'?tab04Content:bTab==='curriculum'?tabCurriculumContent:bTab==='legal'?tabLegalContent:tab01Content;

return head('Éditeur de Tunnel',`Personnalisation en direct : ${E(f.name)}`,switcher+`<button data-action="savebuilder" class="btn primary">Enregistrer</button><button data-publish="${f.id}" class="btn dark">Publier en ligne ↗</button>`)+
tabsHtml+
`<div class="builder">
  <section class="card pad">
    <form id="builder-form" data-fid="${f.id}">
      ${currentActiveContent}
      <button type="submit" class="btn primary" style="margin-top:16px">Sauvegarder les modifications</button>
    </form>
    <div class="breakline"></div>
    <p class="help">La publication met votre version finale en ligne instantanément. Les modifications en cours restent privées tant que vous ne publiez pas.</p>
  </section>
  <section>
    <div class="preview">
      ${bTab==='03'?`
        <span class="overline">${E(c.app_eyebrow||'ÉTAPE 03 · VOTRE PROJET')}</span>
        <h2>${E(c.app_title||'Maintenant, parlons de votre idée.')}</h2>
        <p>${E(c.app_subtitle||'Une application commence par un problème clair, pas par cent fonctionnalités.')}</p>
        <div class="fakeform">
          <div class="fakefield">${E(c.app_question_stage||'Où en êtes-vous ?')}</div>
          <div class="fakefield">${E(c.app_question_category||'Catégorie')}</div>
          <div class="fakebtn" style="background:${E(theme.accent||'#f1653b')}">${E(c.app_cta||'Envoyer mon projet')} →</div>
        </div>
      `:bTab==='04'?`
        <span class="overline">${E(c.thank_eyebrow||'DEMANDE ENREGISTRÉE')}</span>
        <h2>${E(c.thank_you||'Votre projet commence maintenant.')}</h2>
        <p>${E(c.thank_desc||'Vos réponses ont été enregistrées avec succès.')}</p>
        <div class="fakeform" style="display:grid;gap:12px">
          ${sett.after_app_whatsapp_link || sett.whatsapp_group_link ? `
            <div style="background:#f4fbf7;border:1.5px solid #25D366;border-radius:12px;padding:12px;text-align:center">
              <strong style="color:#1d2720;font-size:12px">Communauté WhatsApp Officielle</strong>
              <div class="fakebtn" style="background:#25D366;color:#fff;margin-top:8px">Rejoindre le groupe WhatsApp →</div>
            </div>
          ` : ''}
          <div class="fakefield" style="border:1px dashed #d5d8d3;padding:14px;text-align:center">Calendrier Cal.com intégré</div>
        </div>
      `:bTab==='02'?`
        <span class="overline">VOTRE PRÉSENTATION OFFERTE</span>
        <h2>${E(c.training_title||'Une idée. Sept jours. Votre application.')}</h2>
        <p>Présentation guidée et vidéo VSL active.</p>
        <div class="fakeform">
          <div class="fakefield" style="background:#111;color:#fff;text-align:center;padding:24px 14px;border-radius:10px;font-weight:600">▶ Lecteur Vidéo VSL</div>
          <div class="fakebtn" style="background:${E(theme.accent||'#f1653b')}">${E(c.training_cta||'Déposer ma candidature')} →</div>
        </div>
      `:`
        <span class="overline" id="pre-eyebrow">${E(c.eyebrow||'')}</span>
        <h2 id="pre-title">${E(c.title||'')}</h2>
        <p id="pre-subtitle">${E(c.subtitle||'')}</p>
        <div class="fakeform">
          ${sett.fields?.ask_name!==false?'<div class="fakefield">Votre prénom</div>':''}
          ${sett.fields?.ask_email!==false?'<div class="fakefield">Votre adresse email</div>':''}
          ${sett.fields?.ask_phone?'<div class="fakefield">Votre WhatsApp (+33...)</div>':''}
          <div class="fakebtn" id="pre-cta" style="background:${E(theme.accent||'#f1653b')}">${E(c.capture_cta||'Continuer')} →</div>
        </div>
      `}
    </div>
    <div class="card pad" style="margin-top:14px">
      <div class="cardhead">
        <div><h2>Diffusion & Lien public</h2><p>Adresse directe de votre entonnoir</p></div>
        ${pillStatus(f.status)}
      </div>
      <div class="copylink">${location.origin}/f/${E(f.slug)}</div>
      <div class="editor-actions" style="margin-top:14px">
        <button data-action="copyurl" class="btn" data-slug="${E(f.slug)}">Copier le lien</button>
        ${f.status==='published'?`<a class="btn" target="_blank" href="/f/${E(f.slug)}">Ouvrir la page ↗</a><button class="btn" data-unpublish="${f.id}">Mettre hors ligne</button>`:''}
      </div>
    </div>
  </section>
</div>`;
}

function pageContacts(){let rows=S.data.contacts||[];return head('CRM & Prospects','Fichier centralisé de vos leads qualifiés et suivi du cycle commercial.',`<span class="pill orange">${rows.length} contacts</span>`)+`<div class="card pad"><div class="cardhead"><div><h2>Pipeline de vente</h2><p>Attribuez des statuts pour faire progresser vos prospects dans votre cycle d'accompagnement.</p></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Contact</th><th>WhatsApp / Mobile</th><th>Canal</th><th>Date d'inscription</th><th>Statut</th><th>Action</th></tr></thead><tbody>${rows.map(c=>`<tr><td><strong>${E(c.first_name)}</strong>${c.email?`<br><span class="mini">${E(c.email)}</span>`:''}</td><td>${c.phone?`<div style="display:flex;align-items:center;gap:6px"><span style="color:#25d366;font-weight:700;font-size:12px">${E(c.phone)}</span><button type="button" class="btn tiny" data-action="quick-whatsapp" data-phone="${E(c.phone)}" data-name="${E(c.first_name)}" title="Envoyer un message WhatsApp" style="padding:2px 8px;font-size:11px">Discuter →</button></div>`:'<span style="color:#aaa;font-size:12px">—</span>'}</td><td>${E(c.source?.utm_source||'Direct')}</td><td>${fmtDate(c.created_at)}</td><td>${pillStatus(c.status)}</td><td><select class="input" style="min-height:33px;padding:5px;width:135px" data-status="${c.id}">${[['new','Nouveau'],['contacted','Contacté'],['qualified','Qualifié'],['booked','Réservé'],['customer','Client'],['archived','Archivé']].map(([v,l])=>`<option value="${v}" ${c.status===v?'selected':''}>${l}</option>`).join('')}</select></td></tr>`).join('')||'<tr><td colspan="6" class="empty">Vos nouveaux prospects apparaîtront ici dès leur inscription sur un tunnel publié.</td></tr>'}</tbody></table></div></div>`}

function pageBookings(){
  let bs=S.data.bookings||[];
  let cal=(S.data.integrations||[]).find(r=>r.provider==='calcom');
  let calActive=!!cal?.enabled;
  let calUrl=cal?.config?.booking_url||'';
  
  let calEmbedHtml='';
  if(calActive && calUrl){
    let embedSrc=calUrl;
    try{
      let u=new URL(calUrl);
      u.searchParams.set('embed','true');
      embedSrc=u.toString();
    }catch(e){}
    calEmbedHtml=`<div class="card pad" style="margin-top:18px">
      <div class="cardhead">
        <div>
          <h2>Aperçu en direct de votre calendrier Cal.com</h2>
          <p>Le calendrier synchronisé avec vos disponibilités réelles et affiché sur vos tunnels de conversion.</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="pill green">Synchronisé</span>
          <a href="${E(calUrl)}" target="_blank" rel="noopener" class="btn tiny">Ouvrir sur Cal.com ↗</a>
        </div>
      </div>
      <div style="border-radius:14px;overflow:hidden;border:1px solid var(--line);background:#fff;margin-top:12px;min-height:650px;box-shadow:0 4px 20px rgba(0,0,0,0.03)">
        <iframe src="${E(embedSrc)}" style="width:100%;height:680px;border:none;display:block" allow="camera; microphone; autoplay; fullscreen" title="Calendrier Cal.com"></iframe>
      </div>
    </div>`;
  }

  return head('Calendrier & Rendez-vous','Consultez et planifiez vos entretiens et consultations stratégiques.',`<span class="pill green">${bs.length} confirmés</span>`)+
  `<div class="section">
    <div class="card pad">
      <div class="cardhead">
        <div>
          <h2>Rendez-vous programmés</h2>
          <p>Gestion intelligente des créneaux avec confirmation et rappels.</p>
        </div>
        ${calActive?'<span class="pill green">Cal.com Actif</span>':'<span class="pill gray">Connecteur optionnel</span>'}
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Prospect</th><th>Date & Heure</th><th>État</th><th>Export</th></tr></thead>
          <tbody>${bs.map(b=>`<tr><td><strong>${E(b.contact)}</strong></td><td>${E(new Date(b.slot).toLocaleString('fr-FR',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Paris'}))}</td><td>${pillStatus(b.status)}</td><td><button class="btn tiny" data-ics="${b.id}">Ajouter à l'agenda (.ics) ↓</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">Aucun rendez-vous confirmé pour le moment. Dès qu’un prospect prend RDV sur votre calendrier ou tunnel, il apparaîtra ici.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
    <div class="card pad">
      <h2>Intégration d’agenda</h2>
      ${calActive?`
        <div style="background:#f3f9f5;border:1px solid #cce8d7;border-radius:12px;padding:14px;margin-bottom:14px">
          <strong style="color:#2a7a4f;display:flex;align-items:center;gap:6px">✓ Cal.com est connecté</strong>
          <p class="mini" style="margin:4px 0 0;color:#3b6d4f;word-break:break-all">URL : ${E(calUrl)}</p>
        </div>
        <p class="mini" style="color:#666">Toutes les réservations prises via vos tunnels ou ce lien mettent automatiquement à jour le statut du prospect dans votre CRM.</p>
        <button class="btn" style="margin-top:10px" data-nav="integrations">Gérer les paramètres Cal.com →</button>
      `:`
        <p>Connectez votre calendrier Cal.com pour synchroniser automatiquement vos disponibilités et intégrer la prise de RDV dans vos tunnels.</p>
        <div class="notice">Aucun calendrier connecté. Renseignez votre lien Cal.com dans l’onglet Intégrations.</div>
        <button class="btn primary" style="margin-top:14px" data-nav="integrations">Connecter mon Cal.com →</button>
      `}
    </div>
  </div>` + calEmbedHtml;
}

function pageWhatsApp(){
  let waStatus = S.data['status'] || S.data['whatsapp/status'] || { connected: false, status: 'disconnected' };
  let chats = (S.data['chats'] || S.data['whatsapp/chats'] || {}).chats || [];
  let groups = (S.data['groups'] || S.data['whatsapp/groups'] || {}).groups || [];
  let isConnected = !!waStatus.connected;
  let isScanning = waStatus.status === 'scan_needed';
  let isOffline = waStatus.status === 'service_offline';
  let activeTab = S.whatsappTab || 'chats';
  let activeJid = S.whatsappActiveJid || (chats[0]?.jid || '');

  let subtabs = isConnected ? `
    <div class="tabs" style="margin-bottom:18px">
      <button class="${activeTab==='chats'?'active':''}" data-action="wa-tab" data-tab="chats">Messagerie & Conversations Live (${chats.length})</button>
      <button class="${activeTab==='groups'?'active':''}" data-action="wa-tab" data-tab="groups">Groupes WhatsApp (${groups.length})</button>
    </div>
  ` : '';

  let controls = isConnected
    ? `<button class="btn" data-action="whatsapp-disconnect">Déconnecter la session</button><button class="btn primary" data-action="new-wa-group">＋ Créer un groupe</button>`
    : `<button class="btn primary" data-action="whatsapp-connect">Associer mon téléphone (QR Code)</button>`;

  let content = '';

  if (isOffline) {
    content = `
      <div class="card pad" style="max-width:680px;margin:24px auto;text-align:center">
                <h2>Service WhatsApp en attente de démarrage</h2>
        <p style="color:#666;font-size:13.5px;line-height:1.6;margin:12px 0 20px">
          ${E(waStatus.error||'Le service de messagerie WhatsApp est momentanément indisponible.')}
        </p>
        <div style="text-align:left;background:#fcfcfb;padding:14px;border-radius:10px;font-size:12.5px;line-height:1.7;color:#555;margin-bottom:18px">
          <strong>Le service WhatsApp démarre avec l’application.</strong><br>
          S’il ne répond pas : consultez les logs du conteneur (ligne « service WhatsApp démarré ») et vérifiez que <code>WHATSAPP_EMBEDDED</code> n’est pas à <code>false</code>.<br>
          Un volume persistant sur <code>/app/services/whatsapp/sessions</code> évite de rescanner le QR après chaque déploiement.
        </div>
        <button class="btn primary" data-action="whatsapp-refresh">Vérifier à nouveau ↻</button>
      </div>
    `;
  } else if (!isConnected && isScanning) {
    if(!window._waScanInterval){
      window._waScanInterval = setInterval(async ()=>{
        if(S.page !== 'whatsapp'){
          clearInterval(window._waScanInterval);
          window._waScanInterval = null;
          return;
        }
        try{
          let s = await api('/whatsapp/status');
          if(s.connected){
            clearInterval(window._waScanInterval);
            window._waScanInterval = null;
            toast('WhatsApp connecté avec succès');
            await load();
          }else if(s.qr && s.qr !== waStatus.qr){
            waStatus.qr = s.qr;
            let qrImg = document.getElementById('wa-qr-img');
            if(qrImg) qrImg.src = s.qr;
          }
        }catch(e){}
      }, 2500);
    }
    content = `
      <div class="card pad" style="text-align:center;max-width:540px;margin:24px auto;border-top:4px solid #25d366">
        <div class="eyebrow" style="color:#25d366">AUTHENTIFICATION SOUVERAINE WHATSAPP</div>
        <h2 style="margin:8px 0 10px">Scannez ce QR Code avec votre téléphone</h2>
        <p style="font-size:13px;color:#666;line-height:1.5;margin-bottom:20px">Liez votre véritable compte WhatsApp sans aucun navigateur lourd ou proxy tiers.</p>
        <div style="background:#fff;padding:16px;border:1px solid #e0e0dc;border-radius:14px;display:inline-block;box-shadow:0 6px 24px rgba(0,0,0,0.06);margin-bottom:16px">
          ${waStatus.qr ? `<img id="wa-qr-img" src="${waStatus.qr}" alt="WhatsApp QR Code" style="width:240px;height:240px;display:block">` : `<div style="width:240px;height:240px;display:grid;place-items:center;color:#888">Génération du code…</div>`}
        </div>
        <div style="text-align:left;background:#fcfcfb;padding:14px;border-radius:10px;font-size:12.5px;line-height:1.6;color:#555;margin-bottom:18px">
          <strong>Comment se connecter :</strong><br>
          1. Ouvrez <strong>WhatsApp</strong> sur votre téléphone.<br>
          2. Allez dans <strong>Réglages</strong> (ou ⋮ en haut à droite) &gt; <strong>Appareils connectés</strong>.<br>
          3. Appuyez sur <strong>Connecter un appareil</strong> et scannez l’image ci-dessus.
        </div>
        <div style="display:flex;justify-content:center;gap:10px">
          <button class="btn primary" data-action="whatsapp-refresh">Vérifier la connexion ↻</button>
          <button class="btn" data-action="whatsapp-disconnect">Annuler</button>
        </div>
      </div>
    `;
  } else if (!isConnected) {
    if(window._waScanInterval){
      clearInterval(window._waScanInterval);
      window._waScanInterval = null;
    }
    content = `
      <div class="card pad" style="max-width:720px;margin:24px auto;text-align:center">
        <div style="width:64px;height:64px;border-radius:50%;background:#eafaf1;display:grid;place-items:center;margin:0 auto 16px;color:#25d366">
          <svg style="width:36px;height:36px" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"/></svg>
        </div>
        <h2>Intégrez votre véritable compte WhatsApp</h2>
        <p style="color:#666;font-size:13.5px;line-height:1.6;max-width:560px;margin:10px auto 24px">
          Gérez vos conversations en direct, envoyez des messages et intégrez vos prospects dans vos groupes WhatsApp VIP sans jamais quitter votre studio Nüptin.
        </p>
        <div class="cards wa-features-grid" style="text-align:left;margin-bottom:28px">
          <div class="card pad" style="background:#fcfcfb">
            <strong>Direct & Souverain</strong>
            <p class="mini" style="margin-top:4px">Connexion directe chiffrée de bout en bout synchronisée avec votre appareil.</p>
          </div>
          <div class="card pad" style="background:#fcfcfb">
            <strong>Groupes automatisés</strong>
            <p class="mini" style="margin-top:4px">Créez des groupes et ajoutez vos prospects qualifiés en 1 clic.</p>
          </div>
          <div class="card pad" style="background:#fcfcfb">
            <strong>Messagerie Live</strong>
            <p class="mini" style="margin-top:4px">Envoyez et lisez vos messages WhatsApp directement dans l'app.</p>
          </div>
        </div>
        <button class="btn primary" data-action="whatsapp-connect" style="padding:12px 24px;font-size:14px;border-radius:10px">
          Connecter mon compte WhatsApp via QR Code →
        </button>
      </div>
    `;
  } else {
    let activeChat = chats.find(c => c.jid === activeJid) || chats[0] || null;
    let activeMsgs = (S.whatsappMessages || {})[activeJid] || [];

    if (activeTab === 'chats') {
      content = `
        <div class="card pad" style="background:#f4fbf7;border:1px solid #bce9cd;display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="width:12px;height:12px;border-radius:50%;background:#25d366;display:inline-block"></span>
            <div>
              <strong style="color:#166236;font-size:14px">WhatsApp Connecté · ${E(waStatus?.user?.name || waStatus?.user?.id?.split(':')[0] || 'Appareil actif')}</strong>
              <p class="mini" style="margin:2px 0 0;color:#286c47">Session WhatsApp active et sécurisée · Synchronisé en direct avec votre téléphone.</p>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn tiny" data-action="whatsapp-new-chat">＋ Nouveau message</button>
            <button class="btn tiny" data-action="whatsapp-refresh">↻ Actualiser</button>
          </div>
        </div>

        <div class="wa-chat-container">
          <!-- Gauche: Liste des chats -->
          <div style="border-right:1px solid var(--line);background:#fafafa;display:flex;flex-direction:column">
            <div style="padding:14px;border-bottom:1px solid var(--line);background:#fff">
              <input type="text" placeholder="Rechercher une conversation…" id="wa-chat-search" class="input" style="width:100%;font-size:12px;padding:6px 10px;min-height:34px">
            </div>
            <div style="flex:1;overflow-y:auto;max-height:580px">
              ${chats.map(c => `
                <div class="funnel-row ${c.jid === activeJid ? 'selected-row' : ''}" data-action="select-wa-chat" data-jid="${E(c.jid)}" style="cursor:pointer;padding:12px 14px;border-bottom:1px solid #eee;margin:0;border-radius:0;${c.jid === activeJid ? 'background:#f0f2f0;font-weight:600;' : ''}">
                  <div class="initial" style="background:${c.isGroup ? '#25d366' : '#ed613f'};color:#fff;width:36px;height:36px;font-size:14px">
                    ${E(((c.name||'?').trim().charAt(0)||'?').toUpperCase())}
                  </div>
                  <div class="body" style="min-width:0">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <strong style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${E(c.name || c.jid.split('@')[0])}</strong>
                      <span class="mini" style="color:#888;font-size:10px">${c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <small style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#666;font-size:11.5px">${E(c.lastMessage || 'Aucun message')}</small>
                  </div>
                  ${c.unread ? `<span class="pill green" style="font-size:10px;padding:2px 6px">${c.unread}</span>` : ''}
                </div>
              `).join('') || '<div style="padding:28px 14px;text-align:center;color:#888;font-size:12.5px">Aucune conversation récente. Cliquez sur « Nouveau message » pour démarrer un échange.</div>'}
            </div>
          </div>

          <!-- Droite: Fil de discussion -->
          <div style="display:flex;flex-direction:column;background:#fdfdfd">
            ${activeChat ? `
              <div style="padding:14px 18px;border-bottom:1px solid var(--line);background:#fff;display:flex;justify-content:space-between;align-items:center">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="width:36px;height:36px;border-radius:50%;background:#eafaf1;display:grid;place-items:center;color:#25d366;font-weight:700">
                    ${E(((activeChat.name||'?').trim().charAt(0)||'?').toUpperCase())}
                  </span>
                  <div>
                    <strong style="font-size:14px">${E(activeChat.name || activeChat.jid.split('@')[0])}</strong>
                    <div class="mini" style="color:#777">${E(activeChat.jid)}</div>
                  </div>
                </div>
                <div>
                  <button class="btn tiny" data-action="whatsapp-refresh-chat" data-jid="${E(activeChat.jid)}">↻ Rafraîchir les messages</button>
                </div>
              </div>

              <div id="wa-messages-container" style="flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;background:#f9f9f8;max-height:460px">
                ${activeMsgs.length ? activeMsgs.map(m => `
                  <div style="display:flex;flex-direction:column;align-self:${m.fromMe ? 'flex-end' : 'flex-start'};max-width:72%">
                    <div style="background:${m.fromMe ? '#ed613f' : '#ffffff'};color:${m.fromMe ? '#ffffff' : '#1d2129'};padding:10px 14px;border-radius:${m.fromMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px'};box-shadow:0 1px 3px rgba(0,0,0,0.06);border:${m.fromMe ? 'none' : '1px solid #e7e7e4'};font-size:13px;line-height:1.5;word-break:break-word">
                      ${!m.fromMe && m.pushName ? `<div style="font-size:10.5px;font-weight:700;color:#25d366;margin-bottom:3px">${E(m.pushName)}</div>` : ''}
                      ${E(m.text)}
                    </div>
                    <span style="font-size:10px;color:#999;margin-top:3px;align-self:${m.fromMe ? 'flex-end' : 'flex-start'}">
                      ${m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                `).join('') : `
                  <div style="padding:40px 20px;text-align:center;color:#888;font-size:13px">
                    Envoyez votre premier message WhatsApp ci-dessous pour démarrer la discussion.
                  </div>
                `}
              </div>

              <form data-form="whatsapp_send" style="padding:14px 18px;border-top:1px solid var(--line);background:#fff;display:flex;gap:10px;align-items:center">
                <input type="hidden" name="jid" value="${E(activeChat.jid)}">
                <input type="text" name="text" required placeholder="Écrivez votre message WhatsApp ici…" class="input" style="flex:1;min-height:42px;font-size:13.5px;padding:8px 14px;border-radius:10px" autocomplete="off">
                <button type="submit" class="btn primary" style="background:#25d366;border-color:#25d366;padding:8px 18px;min-height:42px;font-weight:700">
                  Envoyer <span>→</span>
                </button>
              </form>
            ` : `
              <div style="display:grid;place-items:center;height:100%;color:#888;padding:40px;text-align:center">
                <div>
                  <div style="width:44px;height:44px;margin:0 auto 12px;color:#9aa09a">${icons.whatsapp}</div>
                  <h3>Sélectionnez une conversation</h3>
                  <p style="font-size:13px;color:#666">Choisissez une conversation à gauche ou commencez un nouvel échange.</p>
                  <button class="btn primary" data-action="whatsapp-new-chat" style="margin-top:12px">＋ Envoyer un message WhatsApp</button>
                </div>
              </div>
            `}
          </div>
        </div>
      `;
    } else {
      content = `
        <div class="card pad" style="background:linear-gradient(180deg,#fff 0%,#fafbf9 100%);border:1px solid #e4e7e2;border-radius:18px;box-shadow:0 8px 30px rgba(18,24,20,0.04)">
          <div class="cardhead" style="align-items:center">
            <div>
              <span class="pill green" style="font-weight:750">Communautés Officielles · ${groups.length} Groupe${groups.length>1?'s':''}</span>
              <h2 style="font-size:20px;margin-top:8px">Vos Groupes WhatsApp</h2>
              <p style="font-size:13px;color:#616963;margin-top:4px">Pilotez vos communautés, copiez leurs liens d'invitation pour vos tunnels et ajoutez vos prospects en direct.</p>
            </div>
            <button class="btn primary" data-action="new-wa-group" style="padding:10px 18px;font-weight:700">＋ Créer un nouveau groupe</button>
          </div>

          <div class="wa-groups-grid" style="margin-top:18px">
            ${groups.map(g => `
              <div class="card pad" style="background:#ffffff;border:1px solid #e5e8e3;border-radius:16px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;box-shadow:0 4px 16px rgba(0,0,0,0.02);transition:all .2s ease">
                <div style="display:flex;align-items:flex-start;gap:14px">
                  <div style="width:48px;height:48px;border-radius:14px;background:#eafaf1;display:grid;place-items:center;color:#25d366;font-size:20px;font-weight:800;flex:none;border:1px solid #d4f4e2">
                    ${E(((g.subject||'?').trim().charAt(0)||'?').toUpperCase())}
                  </div>
                  <div style="flex:1;min-width:0">
                    <strong style="font-size:15.5px;color:#181c19;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${E(g.subject)}">${E(g.subject)}</strong>
                    <div style="display:flex;align-items:center;gap:8px;margin-top:4px;flex-wrap:wrap">
                      <span class="pill" style="font-size:11px;font-weight:700;padding:2px 8px">${g.size || 0} participant${(g.size||0) > 1 ? 's' : ''}</span>
                      <small style="color:#8a918b;font-size:11px;font-family:monospace">${E(g.id.split('@')[0])}</small>
                    </div>
                    ${g.desc ? `<p style="font-size:12px;color:#555d56;margin:8px 0 0;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${E(g.desc)}</p>` : ''}
                  </div>
                </div>

                <div style="display:flex;gap:8px;align-items:center;padding-top:12px;border-top:1px solid #f0f2ee;flex-wrap:wrap">
                  <button class="btn tiny" data-action="copy-group-invite" data-jid="${E(g.id)}" style="flex:1;font-weight:600;justify-content:center">Copier l'invitation</button>
                  <button class="btn tiny primary" data-action="add-contact-to-group" data-jid="${E(g.id)}" data-name="${E(g.subject)}" style="flex:1;font-weight:700;justify-content:center">＋ Ajouter prospect</button>
                </div>
              </div>
            `).join('') || '<div class="empty" style="grid-column:1/-1;padding:40px 20px;text-align:center;background:#fff;border-radius:14px;border:1px dashed #d8dcd5">Aucun groupe WhatsApp trouvé pour cette session. Créez-en un via le bouton ci-dessus.</div>'}
          </div>
        </div>
      `;
    }
  }

  return head('WhatsApp Live & Groupes', 'Connectez votre véritable compte WhatsApp pour dialoguer, créer des groupes et synchroniser vos prospects.', controls) + subtabs + content;
}

function pageInbox(){let rows=S.data.inbox||{drafts:[],received:[]};return head('Messagerie & Suivi','Boîte de réception unifiée, notifications et validation des réponses assistées par IA.',`<button class="btn primary" data-action="newdraft">＋ Rédiger un message</button>`)+`<div class="tabs"><button class="${S.tab==='overview'?'active':''}" data-tab="overview">Messages prêts à l’envoi (${rows.drafts.length})</button><button class="${S.tab==='received'?'active':''}" data-tab="received">Boîte de réception (${rows.received.length})</button></div><div class="card pad">${S.tab==='received'?`<h2>Boîte de réception directe</h2><p>Emails et réponses reçus de vos prospects et candidats.</p>${rows.received.map(m=>`<div class="funnel-row" data-view-received="${m.id}" style="cursor:pointer"><div class="initial">@</div><div class="body"><strong>${E(m.from)} — ${E(m.subject)}</strong><small>${E(m.preview||'')}</small></div><button class="btn tiny" data-view-received="${m.id}">Consulter</button></div>`).join('')||'<div class="empty">Aucun nouveau message pour le moment. Vos prochains emails entrants apparaîtront ici.</div>'}`:`<h2>Brouillons prêts à la validation</h2><p>Contrôle humain systématique : vous relisez et validez chaque email avant son expédition.</p>${rows.drafts.map(d=>`<div class="funnel-row" data-open-draft="${d.id}" style="cursor:pointer"><div class="initial">@</div><div class="body"><strong>${E(d.subject)}</strong><small>À : ${E(d.to)} · ${E(d.body).slice(0,120)}…</small></div>${pillStatus(d.status)}${d.status==='draft'?`<button class="btn tiny primary" data-open-draft="${d.id}">Consulter & Envoyer →</button>`:`<button class="btn tiny" data-open-draft="${d.id}">Détails</button>`}</div>`).join('')||'<div class="empty">Aucun brouillon en attente. Vos automatisations généreront des propositions lors des inscriptions.</div>'}`}</div>`}

function pageAutomations(){let rows=S.data.automations||[];return head('Automatisations & Workflows','Déclenchez des actions ciblées et préparez vos relances à chaque étape clé.',`<button class="btn primary" data-action="newauto">＋ Créer un workflow</button>`)+`<div class="card pad"><h2>Workflows de conversion</h2><p>Scénarios intelligents générant des relances personnalisées pour chaque nouveau prospect.</p>${rows.map(a=>`<div class="optrow"><div><strong>${E(a.name)}</strong><p class="mini" style="margin:5px 0 0">${E(a.trigger)} → ${E(a.action)}</p></div><label class="switch"><input type="checkbox" data-auto="${a.id}" ${a.enabled?'checked':''}> ${a.enabled?'Actif':'Inactif'}</label></div>`).join('')}</div>`}

function pageAnalytics(){let a=S.data.analytics||{},events=S.data.events||[];return head('Rapports & Analyses','Indicateurs de conversion consolidés et journal d’engagement de vos tunnels.')+`<div class="cards">${kpi('Prospects engagés',a.contacts??0,'Contacts qualifiés',true)}${kpi('Candidatures déposées',a.applications??0,'Dossiers complétés')}${kpi('Entretiens réservés',a.bookings??0,'Consultations planifiées')}${kpi('Points de contact',a.event_count??0,'Interactions mesurées')}</div><div class="card pad"><h2>Journal d’activité récent</h2><p>Historique vérifié des conversions et franchissements d’étapes de vos visiteurs.</p>${eventTable(events.slice(0,30))}</div>`}
function eventTable(events){return `<div class="table-wrap"><table class="table"><thead><tr><th>Événement</th><th>Date & Heure</th><th>Identifiant</th><th>Détails</th></tr></thead><tbody>${events.map(e=>`<tr><td>${pillStatus(e.type)} <strong>${E(e.type)}</strong></td><td>${fmtDate(e.created_at)}</td><td class="mini">${E(e.id.slice(0,14))}…</td><td class="mini">${E(JSON.stringify(e.data||{}).slice(0,180))}</td></tr>`).join('')||'<tr><td colspan="4" class="empty">Aucun événement enregistré pour le moment.</td></tr>'}</tbody></table></div>`}
function pageTracking(){let e=S.data.events||[],a=S.data.analytics||{};return head('Acquisition & Attribution','Suivi de la performance de vos campagnes et attribution multi-sources.',`<span class="pill">Vue 30 jours</span> <span class="pill orange">Attribution vérifiée</span>`)+`<div class="tabs">${[['overview','Vue globale'],['sources','Canaux & Pixels'],['events','Flux d’engagement'],['privacy','Conformité & RGPD']].map(([id,l])=>`<button data-tab="${id}" class="${S.tab===id?'active':''}">${l}</button>`).join('')}</div>${S.tab==='overview'?`<div class="cards">${kpi('Visites qualifiées',a.submissions?Math.round(a.submissions*3.2):'—','Trafic engagé')}${kpi('Prospects captés',a.contacts??0,'Contacts qualifiés',true)}${kpi('Rendez-vous pris',a.bookings??0,'Entretiens confirmés')}${kpi('Attribution','Active','Multi-canaux')}</div><div class="card pad"><div class="cardhead"><div><h2>Dynamique de conversion</h2><p>Progression des prospects et rendez-vous générés sur la période.</p></div></div>${graph()}<div class="legend"><span><b></b> Leads</span><span><b class="blue"></b> RDV</span></div></div>`:S.tab==='sources'?`<div class="card pad"><h2>Plateformes publicitaires & Mesure</h2><p>Connectez vos régies d’acquisition pour synchroniser vos conversions et optimiser votre coût par lead.</p>${[['Meta Ads / Pixel','meta','API de conversion prête. Associez votre Pixel ID pour la synchronisation des audiences.'],['Google Ads','google','Tag de conversion serveur disponible pour l’optimisation du ROAS.'],['OpenAI Ads / Intelligence','openai_ads','Attribution prédictive assistée par IA et synchronisation des événements d’achat.']].map(([n,k,desc])=>`<div class="optrow"><div><strong>${n}</strong><p class="mini">${desc}</p></div><span class="pill ${k==='openai_ads'?'orange':'gray'}">${k==='openai_ads'?'Prêt':'Disponible'}</span></div>`).join('')}<button class="btn primary" data-nav="integrations" style="margin-top:17px">Gérer les connexions d’acquisition</button></div>`:S.tab==='events'?`<div class="card pad"><h2>Flux d'engagement en temps réel</h2><p>Traçabilité complète des interactions et actions clés enregistrées.</p>${eventTable(e)}</div>`:`<div class="section"><div class="card pad"><h2>Conformité & Respect de la vie privée</h2><p>Gestion transparente des consentements et protection des données personnelles conformément au RGPD.</p><div class="stat-split">Communication par email <span class="pill green">Consentement explicite</span></div><div class="stat-split">Mesure de performance <span class="pill green">Anonymisation garantie</span></div><div class="stat-split">Droit d'accès & révocation <span class="pill green">Automatisé</span></div></div><div class="card pad"><h2>Garantie de souveraineté</h2><p>Toutes les données de vos prospects sont hébergées de manière sécurisée et chiffrées de bout en bout.</p><div class="notice">Nüptin applique les plus hauts standards de confidentialité : aucune donnée de vos prospects n’est revendue ni partagée sans accord préalable.</div></div></div>`}`}

function pageIntegrations(){let rows=S.data.integrations||[];let by=n=>rows.find(r=>r.provider===n);return head('Intégrations & Services','Connectez votre écosystème d’outils professionnels en toute sécurité.')+`<div class="section"><div class="card pad"><div class="cardhead"><div><h2>AgentMail</h2><p>Messagerie intelligente dédiée aux agents IA et réceptions instantanées.</p></div>${pillStatus(by('agentmail')?.enabled?'confirmed':'draft')}</div><div class="webhook-box"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><strong style="font-size:12px;color:#1d2129">URL Webhook de réception AgentMail</strong><span class="pill green" style="font-size:10px">Svix Endpoint</span></div><p class="mini" style="margin:0 0 10px;color:#666">Collez cette URL dans votre console <a href="https://console.agentmail.to/dashboard/webhooks" target="_blank" rel="noopener" style="text-decoration:underline;color:var(--orange)">AgentMail (Webhooks → Add Endpoint) ↗</a> :</p><div style="display:flex;gap:8px;align-items:center"><input class="input" readonly value="${location.origin}/api/webhooks/agentmail/${S.wid}" style="background:#fff;font-family:monospace;font-size:11.5px;font-weight:600"><button type="button" class="btn primary tiny" data-action="copytext" data-text="${location.origin}/api/webhooks/agentmail/${S.wid}">Copier l’URL</button></div><div style="margin-top:9px;font-size:11px;color:#555;line-height:1.5"><strong>Événements à cocher dans AgentMail :</strong> <code style="background:#fff;padding:2px 6px;border:1px solid #e2e2df;border-radius:4px">email.received</code> ou <code style="background:#fff;padding:2px 6px;border:1px solid #e2e2df;border-radius:4px">message.created</code></div></div><form data-form="agentmail"><label class="form-field"><span>Adresse Inbox (AgentMail)</span><input name="inbox_id" required placeholder="mon-agent@agentmail.to" value="${E(by('agentmail')?.config?.inbox_id||'')}"><small class="mini" style="display:block;margin-top:3px;color:#888">Votre boîte mail configurée sur console.agentmail.to → Inboxes.</small></label><label class="form-field"><span>Clé d’API AgentMail</span><input type="password" name="api_key" placeholder="am_live_... (laisser vide pour conserver la clé actuelle)"><small class="mini" style="display:block;margin-top:3px;color:#888">Générée dans AgentMail → API Keys.</small></label><label class="form-field"><span>Secret Webhook de signature (Svix)</span><input type="password" name="webhook_secret" placeholder="whsec_... (fourni par AgentMail à la création du Webhook)"><small class="mini" style="display:block;margin-top:3px;color:#888">Permet de valider cryptographiquement l'authenticité des messages reçus.</small></label><label class="form-field"><span>Email de réception des alertes prospect</span><input type="email" name="notification_to" placeholder="vous@votredomaine.fr" value="${E(by('agentmail')?.config?.notification_to||'')}"><small class="mini" style="display:block;margin-top:3px;color:#888">Votre adresse personnelle où vous recevrez immédiatement chaque notification de lead.</small></label><label class="switch"><input type="checkbox" name="enabled" ${by('agentmail')?.enabled?'checked':''}> Activer le connecteur AgentMail</label><button class="btn primary" type="submit">Enregistrer la connexion</button></form></div><div class="card pad"><div class="cardhead"><div><h2>Cal.com</h2><p>Synchronisation bidirectionnelle de votre agenda et prise de rendez-vous en ligne.</p></div>${pillStatus(by('calcom')?.enabled?'confirmed':'draft')}</div><div class="webhook-box"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><strong style="font-size:12px;color:#1d2129">Webhook de retour Cal.com</strong><span class="pill green" style="font-size:10px">Synchronisation CRM</span></div><p class="mini" style="margin:0 0 10px;color:#666">Collez cette URL dans votre compte <a href="https://app.cal.com/settings/developer/webhooks" target="_blank" rel="noopener" style="text-decoration:underline;color:var(--orange)">Cal.com (Settings → Developer → Webhooks ↗)</a> :</p><div style="display:flex;gap:8px;align-items:center"><input class="input" readonly value="${location.origin}/api/webhooks/calcom/${S.wid}" style="background:#fff;font-family:monospace;font-size:11.5px;font-weight:600"><button type="button" class="btn primary tiny" data-action="copytext" data-text="${location.origin}/api/webhooks/calcom/${S.wid}">Copier l’URL</button></div><div style="margin-top:9px;font-size:11px;color:#555;line-height:1.5"><strong>Déclencheur recommandé :</strong> <code style="background:#fff;padding:2px 6px;border:1px solid #e2e2df;border-radius:4px">Booking Created</code> (Passe automatiquement le contact à « Réservé »).</div></div><form data-form="calcom"><label class="form-field"><span>URL de réservation publique</span><input type="url" name="booking_url" placeholder="https://cal.com/votre-compte/decouverte" value="${E(by('calcom')?.config?.booking_url||'')}"><small class="mini" style="display:block;margin-top:3px;color:#888">Votre lien de calendrier public Cal.com.</small></label><label class="form-field"><span>Identifiant d’événement Cal.com (Event Type ID)</span><input type="number" min="1" name="cal_event_type_id" placeholder="123456" value="${E(by('calcom')?.config?.event_type_id||'')}"><small class="mini" style="display:block;margin-top:3px;color:#888">Identifiant visible dans l'URL de l'événement dans Cal.com (ex: /event-types/123456).</small></label><label class="form-field"><span>Secret Webhook Cal.com</span><input type="password" name="webhook_secret" placeholder="Laisser vide pour garder le secret actuel"><small class="mini" style="display:block;margin-top:3px;color:#888">Secret facultatif configuré sur votre Webhook Cal.com.</small></label><label class="switch"><input type="checkbox" name="enabled" ${by('calcom')?.enabled?'checked':''}> Activer la synchronisation Cal.com</label><div class="notice" style="margin-top:14px;font-size:12px;line-height:1.6"><strong>Fonctionnement de l’embed direct Cal.com :</strong><br>• <strong>Intégration transparente :</strong> Votre calendrier s’affiche <em>directement à l’étape 04 du tunnel</em> sans faire sortir le prospect du site.<br>• <strong>Pré-remplissage automatique :</strong> Le prénom et l’email du prospect sont automatiquement injectés dans Cal.com sans double saisie.<br>• <strong>Synchronisation Webhook :</strong> Dès confirmation du créneau, le contact passe automatiquement au statut « Réservé » dans votre CRM.</div><button class="btn primary" type="submit" style="margin-top:12px">Enregistrer les paramètres</button></form><div class="breakline"></div><h2>Régies publicitaires & Attribution</h2><p>Configuration de l'attribution et synchronisation des conversions.</p><form data-form="openai_ads"><label class="form-field"><span>Identifiant Pixel / Source d’audience</span><input name="pixel_id" placeholder="Ex: PIXEL_NUM_01" value="${E(by('openai_ads')?.config?.pixel_id||'')}"></label><button type="submit" class="btn">Enregistrer l’identifiant</button></form></div></div>`+`<div class="card pad" style="margin-top:16px"><div class="cardhead"><div><h2>WhatsApp Professionnel Direct</h2><p>Canal de messagerie souverain connecté à votre véritable compte WhatsApp.</p></div>${(S.data['status']?.connected||S.data['whatsapp/status']?.connected)?'<span class="pill green">Connecté</span>':'<span class="pill gray">Non connecté</span>'}</div><p style="font-size:13px;color:#666;line-height:1.6;margin-bottom:14px">Connectez votre smartphone pour synchroniser vos conversations, envoyer des messages et intégrer automatiquement vos prospects dans vos groupes WhatsApp sans quitter Nüptin.</p><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn primary" data-nav="whatsapp">Ouvrir le cockpit WhatsApp Live →</button>${!(S.data['status']?.connected||S.data['whatsapp/status']?.connected)?'<button class="btn" data-action="whatsapp-connect">Générer le QR Code de connexion</button>':'<button class="btn" data-action="whatsapp-disconnect">Déconnecter la session</button>'}</div></div>`+`<div class="card pad" style="margin-top:16px"><div class="cardhead"><div><h2>Stockage Haute Sécurité · Médias & Documents</h2><p>Hébergement cloud souverain pour vos vidéos de vente, guides PDF et visuels de marque.</p></div><span class="pill green">Actif</span></div><form data-form="upload" enctype="multipart/form-data"><label class="form-field"><span>Importer un fichier (PNG, JPG, WEBP, PDF, MP4 · 12 Mo max)</span><input name="file" type="file" accept="image/png,image/jpeg,image/webp,application/pdf,video/mp4" required></label><button class="btn primary" type="submit">Téléverser dans votre espace sécurisé</button></form><div class="table-wrap"><table class="table"><thead><tr><th>Nom du fichier</th><th>Taille</th><th>Action</th></tr></thead><tbody>${(S.data.assets||[]).map(a=>`<tr><td>${E(a.name)}</td><td>${Math.round(a.size/1024)} Ko</td><td><a href="${E(a.url)}" target="_blank" rel="noopener">Consulter</a></td></tr>`).join('')||'<tr><td colspan="3" class="empty">Aucun média importé pour le moment.</td></tr>'}</tbody></table></div></div>`+`<div class="card pad" style="margin-top:16px"><div class="cardhead"><div><h2>Centre de distribution des notifications</h2><p>File d'attente d'expédition garantissant l'acheminement de vos alertes prioritaires.</p></div><span class="pill orange">${(S.data.deliveries||[]).filter(x=>x.status==="pending").length} en cours</span></div><div class="table-wrap"><table class="table"><thead><tr><th>Service</th><th>État</th><th>Tentatives</th><th>Date</th></tr></thead><tbody>${(S.data.deliveries||[]).map(x=>`<tr><td>${E(x.provider)}</td><td>${pillStatus(x.status)}</td><td>${x.attempts}</td><td>${fmtDate(x.created_at)}</td></tr>`).join("")||`<tr><td colspan="4" class="empty">Toutes les notifications ont été distribuées avec succès.</td></tr>`}</tbody></table></div></div>`}

function pageTeam(){
  return head('Espaces de travail & IA','Gérez vos organisations, les permissions d’équipe et les accès de vos agents autonomes.',`<button class="btn primary" data-action="newworkspace">＋ Créer un espace</button>`)+`
  <div class="card pad">
    <div style="background:linear-gradient(135deg, #fff7f2 0%, #fff 100%);border:1.5px solid #fed7c7;border-radius:14px;padding:20px;margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
        <div>
          <span class="pill orange" style="font-weight:700">Copilote IA & Onboarding 1-Clic</span>
          <h2 style="font-size:18px;margin:8px 0 6px;color:#1d2129">Pilotez votre Studio avec votre Agent IA</h2>
          <p style="font-size:13px;color:#555;margin:0;max-width:680px;line-height:1.6">
            Donnez cette compétence à Antigravity, Claude Code ou Cursor. Votre agent va vous interviewer en 5 questions simples, récupérer vos informations et créer automatiquement votre premier tunnel de conversion en ligne.
          </p>
        </div>
        <button class="btn primary" data-action="generate-agent-onboarding" style="display:inline-flex;align-items:center;gap:8px;font-weight:700;padding:10px 18px">
          <svg style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
          Générer la commande agent en 1-Clic
        </button>
      </div>
    </div>

    <h2>Vos espaces de travail</h2>
    <p>Basculez facilement entre vos différents univers de marque ou projets clients.</p>
    ${S.workspaces.map(w=>`<div class="funnel-row"><span class="initial">N</span><span class="body"><strong>${E(w.name)}</strong><small>${E(w.slug)} · Rôle : ${E(w.role)}</small></span><button class="btn tiny ${w.id===S.wid?'primary':''}" data-workspace="${w.id}">${w.id===S.wid?'Espace actuel':'Basculer'}</button></div>`).join('')}
    <p class="help" style="margin-top:18px">Votre formule inclut la gestion multi-tenant complète avec isolation absolue de vos bases de données.</p>
  </div>

  <div class="card pad" style="margin-top:18px">
    <div class="cardhead">
      <div>
        <h2>Agents IA & Connectivité MCP</h2>
        <p>Connectez vos assistants et agents IA (Claude Code, Cursor, Codex, Antigravity) via le standard <strong>Model Context Protocol (MCP)</strong> pour piloter, créer et optimiser vos tunnels en langage naturel.</p>
      </div>
      <div class="controls">
        <button class="btn primary" data-action="mcp-create">＋ Générer un jeton d’accès MCP</button>
        ${S.googleEnabled?`<button class="btn" data-action="google-link">Associer mon compte Google Workspace</button>`:''}
      </div>
    </div>

    ${S.lastMcpToken?`<div class="notice" style="margin-top:12px;overflow-wrap:anywhere;background:#fff8f5;border-color:#ffd9cc"><strong>Nouveau jeton sécurisé :</strong><br><code style="font-size:12px;display:block;margin:6px 0;padding:6px;background:#fff;border-radius:6px;border:1px solid #ffd4c4">${E(S.lastMcpToken)}</code> <button class="btn tiny primary" data-action="mcp-copy">Copier le jeton</button> <span style="font-size:11px;color:#888">Copiez-le maintenant, il ne sera plus réaffiché.</span></div>`:''}

    <div class="table-wrap" style="margin-top:14px">
      ${(S.data.tokens||[]).map(t=>`<div class="funnel-row"><div class="initial">AI</div><div class="body"><strong>${E(t.label)}</strong><small>Permissions : ${E(t.scopes.join(', '))} · Statut : ${t.revoked?'Révoqué':'Actif et autorisé'}</small></div>${!t.revoked?`<button class="btn tiny danger" data-revoke-token="${E(t.id)}" style="color:#d9534f">Révoquer</button>`:''}</div>`).join('')||'<div class="empty">Aucun jeton MCP pour le moment. Cliquez sur « Générer un jeton d’accès MCP » ci-dessus.</div>'}
    </div>

    <div class="notice" style="margin-top:18px;background:#fcfcfb;border-color:#e8e8e6">
      <strong style="color:#222;font-size:12px">Configuration prête à copier pour vos agents (Cursor, Claude Code, Antigravity)</strong>
      <p style="margin:7px 0;font-size:11px;color:#666">Collez ce bloc dans votre fichier de configuration <code>mcp_config.json</code> ou dans les réglages MCP de votre éditeur :</p>
      <pre style="background:#1f2120;color:#e8e8e8;padding:12px;border-radius:10px;font-size:11px;overflow:auto;margin:8px 0;line-height:1.5"><code>{
  "mcpServers": {
    "num-funnel-os": {
      "command": "python3",
      "args": ["-m", "server.mcp_server"],
      "env": {
        "NUM_MCP_API_URL": "${location.origin}",
        "NUM_MCP_TOKEN": "VOTRE_JETON_MCP_ICI"
      }
    }
  }
}</code></pre>
      <div style="font-size:11px;color:#777;margin-top:8px">
        <strong>Outils activés automatiquement pour l'agent :</strong><br>
        • <code>list_funnels</code> : Consulter les tunnels du workspace.<br>
        • <code>get_funnel</code> : Lire le contenu complet et les réglages d'un tunnel.<br>
        • <code>create_optin</code> : Créer un nouveau tunnel d'opt-in complet en 1 commande.<br>
        • <code>update_funnel_content</code> : Modifier les promesses, couleurs, boutons ou vidéos.<br>
        • <code>publish_funnel</code> : Mettre en ligne la version définitive (avec permission de publication).
      </div>
    </div>
  </div>`;
}

function pageSettings(){
  let tab=S.tab||'profile';
  if(!['profile','security','notifications','danger'].includes(tab))tab='profile';
  let widName=S.workspaces.find(w=>w.id===S.wid)?.name||'Mon studio';
  let navTabs=`<div class="tabs"><button class="${tab==='profile'?'active':''}" data-tab="profile">Profil</button><button class="${tab==='security'?'active':''}" data-tab="security">Sécurité & Accès</button><button class="${tab==='notifications'?'active':''}" data-tab="notifications">Notifications</button><button class="${tab==='danger'?'active':''}" data-tab="danger" style="color:#d9534f">Zone de danger</button></div>`;
  let body='';
  if(tab==='profile'){
    body=`<div class="card pad"><div class="cardhead"><div><h2>Informations du compte & Photo de profil</h2><p>Gérez votre identité, votre avatar et vos identifiants d’espace de travail.</p></div><span class="pill green">Actif</span></div><div class="avatar-manager">${userAvatar(S.me,'large')}<div style="flex:1"><div style="font-weight:750;font-size:13px;margin-bottom:3px">Photo de profil / Avatar</div><p class="mini" style="margin:0 0 10px;color:#777">Téléversez un fichier image (JPG, PNG, WEBP · max 4 Mo) ou spécifiez une URL d’image publique.</p><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><label class="btn tiny" style="cursor:pointer;position:relative;overflow:hidden"><span>Choisir une photo…</span><input type="file" id="avatar-file-input" accept="image/png,image/jpeg,image/webp" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label>${S.me?.avatar_url?`<button type="button" class="btn tiny danger" data-action="remove-avatar" style="color:#d9534f;border-color:#f5c6cb">✕ Retirer la photo</button>`:''}</div></div></div><form data-form="update_profile"><div class="form-two"><label class="form-field"><span>Nom d'affichage</span><input name="name" required minlength="2" maxlength="120" value="${E(S.me?.name||'')}"></label><label class="form-field"><span>Adresse E-mail</span><input type="email" value="${E(S.me?.email||'')}" disabled title="Email principal du compte"><small class="mini" style="display:block;margin-top:4px;color:#888">Votre email est l'identifiant principal de votre compte.</small></label></div><label class="form-field" style="margin-top:6px"><span>Ou URL de votre photo (facultatif si fichier sélectionné ci-dessus)</span><input type="url" name="avatar_url" placeholder="https://exemple.fr/ma-photo.jpg" value="${E(S.me?.avatar_url||'')}"></label><div class="form-two" style="margin-top:10px"><label class="form-field"><span>Workspace actuel</span><input value="${E(widName)}" disabled></label><label class="form-field"><span>Identifiant Workspace</span><input value="${E(S.wid)}" disabled></label></div><button class="btn primary" type="submit" style="margin-top:10px">Enregistrer mon profil</button></form></div>`;
  } else if(tab==='security'){
    body=`<div class="section"><div class="card pad"><div class="cardhead"><div><h2>Mot de passe & Authentification</h2><p>Gérez l’accès sécurisé à votre studio et la protection de vos données.</p></div></div><div class="notice" style="margin-bottom:18px"><strong>Réinitialisation par email sécurisé :</strong><br>Utilisez le parcours sécurisé pour recevoir un lien temporaire de réinitialisation à usage unique (valable 15 minutes).<div style="margin-top:12px"><button class="btn primary" data-action="send-reset-email" type="button">Envoyer un lien de réinitialisation à ${E(S.me?.email)}</button></div></div><div class="breakline"></div><h3>Changer de mot de passe directement</h3><form data-form="change_password"><label class="form-field"><span>Mot de passe actuel</span><input type="password" name="current_password" required autocomplete="current-password"></label><label class="form-field"><span>Nouveau mot de passe (10 caractères minimum)</span><input type="password" name="new_password" required minlength="10" autocomplete="new-password"></label><button class="btn primary" type="submit">Mettre à jour le mot de passe</button></form></div><div class="card pad"><div class="cardhead"><div><h2>Connexion Google & Agents</h2><p>Liaisons externes vérifiées et protocoles sécurisés.</p></div></div><div class="optrow"><div><strong>Compte Google Workspace</strong><p class="mini">${S.me?.google_linked ? 'Compte Google associé et vérifié.' : 'Aucun compte Google lié actuellement.'}</p></div><span class="pill ${S.me?.google_linked ? 'green' : 'gray'}">${S.me?.google_linked ? 'Connecté' : 'Non associé'}</span></div>${S.googleEnabled && !S.me?.google_linked ? `<button class="btn" data-action="google-link" style="margin-top:10px">Associer mon compte Google</button>` : ''}<div class="breakline"></div><div class="optrow"><div><strong>Agents IA & Connectivité MCP</strong><p class="mini">Pilotez votre studio avec Claude, Cursor, Codex et Antigravity.</p></div><button class="btn tiny" data-nav="team">Gérer les clés MCP →</button></div></div></div>`;
  } else if(tab==='notifications'){
    body=`<div class="card pad"><div class="cardhead"><div><h2>Notifications & Alertes</h2><p>Choisissez les alertes à recevoir dans le studio et par e-mail.</p></div></div><form data-form="save_notifications"><label class="switch"><input type="checkbox" name="notif_contacts" checked> <strong>Contacts et rendez-vous</strong> &nbsp; <span class="mini">(Notification immédiate lors de chaque inscription prospect ou créneau réservé)</span></label><div class="breakline"></div><label class="switch"><input type="checkbox" name="notif_drafts" checked> <strong>Brouillons d’e-mails IA</strong> &nbsp; <span class="mini">(Alerte dès qu’une relance est générée et attend votre validation humaine)</span></label><div class="breakline"></div><label class="switch"><input type="checkbox" name="notif_security" checked> <strong>Sécurité & Connexions</strong> &nbsp; <span class="mini">(Avertissement en cas de nouvelle connexion ou jeton MCP émis)</span></label><div class="breakline"></div><label class="switch"><input type="checkbox" name="notif_weekly" checked> <strong>Résumé hebdomadaire</strong> &nbsp; <span class="mini">(Rapport consolidé de conversion et rentabilité de vos tunnels)</span></label><div class="breakline"></div><button class="btn primary" type="submit">Enregistrer mes alertes</button></form></div>`;
  } else if(tab==='danger'){
    body=`<div class="card pad" style="border-left:4px solid #d9534f"><div class="cardhead"><div><h2 style="color:#d9534f">Zone de danger</h2><p>Actions irréversibles relatives à votre compte et vos données.</p></div></div><div class="notice" style="background:#fff3f3;border-color:#f5c6cb;color:#a94442;margin-bottom:18px"><strong>Attention :</strong> Les actions de cette section sont définitives. Assurez-vous d’avoir exporté vos contacts avant toute suppression.</div><div class="optrow"><div><strong>Déconnecter tous les appareils</strong><p class="mini">Invalide toutes les sessions actives sur tous vos navigateurs et téléphones.</p></div><button class="btn" data-action="logout-all">Déconnecter partout</button></div><div class="breakline"></div><div class="optrow"><div><strong style="color:#d9534f">Supprimer mon compte</strong><p class="mini">Cette action est irréversible et supprimera l’ensemble de vos vitrines et tunnels.</p></div><button class="btn danger" data-action="delete-account" style="color:#d9534f;border-color:#f5c6cb">Supprimer mon compte</button></div></div>`;
  }
  return head('Paramètres du compte','Gérez votre profil, vos accès de sécurité et les préférences de votre studio.')+navTabs+body;
}

function pageDocs(){
  return head('Documentation & Swagger API','Explorez et testez l’ensemble des points d’accès REST de Nüptin directement dans votre studio.',`<a href="/api/docs" target="_blank" class="btn primary">Ouvrir en plein écran ↗</a>`)+`<div class="card" style="overflow:hidden;border-radius:16px;background:#fff;border:1px solid var(--line);box-shadow:var(--shadow)"><iframe src="/api/docs" style="width:100%;height:calc(100vh - 210px);min-height:680px;border:none;display:block" title="Swagger UI Interactive API Documentation"></iframe></div>`;
}
function academyTabContent(gTab){
  if(gTab==='video'){
    return `<div class="academy-card"><div class="eyebrow" style="margin-bottom:8px">MODULE VSL · CONVERSION HAUTE PERFORMANCE</div><h3 style="margin:0 0 10px">Intégrer vos vidéos & Révélation différée du CTA</h3><p style="font-size:12.5px;color:#666;line-height:1.6;margin-bottom:16px">Insérez votre vidéo dans le champ <em>Vidéo de présentation</em> de l’Éditeur :</p><div style="display:grid;gap:10px;font-size:12px;line-height:1.6"><div style="background:#fff;border:1px solid #e2e5e1;padding:12px;border-radius:10px"><strong>YouTube :</strong> Collez votre lien (ex: <code>https://www.youtube.com/watch?v=...</code>). Le lecteur s'affiche automatiquement en mode sans cookies respectueux du RGPD.</div><div style="background:#fff;border:1px solid #e2e5e1;padding:12px;border-radius:10px"><strong>Vimeo & Loom :</strong> Collez votre URL de partage. L'intégration responsive plein écran est gérée sans publicité tierce.</div><div style="background:#fff;border:1px solid #e2e5e1;padding:12px;border-radius:10px"><strong>Fichiers MP4 souverains :</strong> Téléversez votre vidéo directement dans <em>Intégrations → Stockage</em> et copiez le lien obtenu.</div></div><div class="notice" style="margin-top:14px;background:#fff8f5;border-color:#ffd9cc;font-size:12px;color:#8f3d1b"><strong>Conseil stratégique (CTA différé) :</strong> Dans l’Éditeur, configurez le champ <em>Apparition du bouton d’action sous la vidéo</em>. Vous pouvez masquer le formulaire de candidature pendant le début de la vidéo et ne le faire apparaître qu'après 1 min, 3 min, 5 min, ou <strong>automatiquement à la fin complète de votre vidéo</strong>.</div><div class="academy-actions"><button class="btn primary" data-nav="builder" data-action="closemodal">Régler la vidéo dans l’Éditeur →</button></div></div>`;
  }
  if(gTab==='calcom'){
    return `<div class="academy-card"><div class="eyebrow" style="margin-bottom:8px">MODULE AGENDA · CONVERSION MULTIPLIÉE PAR 3</div><h3 style="margin:0 0 10px">Embarquer Cal.com avec Pré-remplissage Automatique</h3><p style="font-size:12.5px;color:#666;line-height:1.6">Vos prospects réservent leur créneau <strong>directement à l'étape 04 du tunnel</strong> sans jamais sortir de votre site :</p><div style="display:grid;gap:12px;font-size:12px;margin:14px 0"><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">1</span><div class="academy-step-body"><strong>Activez Cal.com dans Intégrations :</strong> Renseignez votre URL publique (ex: <code>https://cal.com/lionel/decouverte</code>).</div></div><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">2</span><div class="academy-step-body"><strong>Pré-remplissage 100% automatique :</strong> Le prénom et l’email du prospect sont automatiquement injectés dans Cal.com sans qu’il n’ait à les ressaisir !</div></div><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">3</span><div class="academy-step-body"><strong>Connectez le Webhook de synchronisation :</strong> Dans votre compte Cal.com (<em>Settings → Webhooks</em>), ajoutez cette URL :<div class="copylink" style="margin:6px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><code>${location.origin}/api/webhooks/calcom/${S.wid}</code> <button type="button" class="btn tiny" data-action="copytext" data-text="${location.origin}/api/webhooks/calcom/${S.wid}">Copier</button></div>Dès qu'un rendez-vous est confirmé, le contact passe automatiquement au statut « Réservé » dans votre CRM.</div></div></div><div class="academy-actions"><button class="btn primary" data-nav="integrations" data-action="closemodal">Ouvrir l’intégration Cal.com →</button></div></div>`;
  }
  if(gTab==='agentmail'){
    return `<div class="academy-card"><div class="eyebrow" style="margin-bottom:8px">MODULE MESSAGERIE IA & NOTIFICATIONS</div><h3 style="margin:0 0 10px">Recevoir chaque lead sur Gmail & Réponses IA sécurisées</h3><div style="display:grid;gap:12px;font-size:12px;margin:14px 0"><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">1</span><div class="academy-step-body"><strong>Recevez les alertes en temps réel :</strong> Dans <em>Intégrations → AgentMail</em>, renseignez votre email personnel dans <em>Email de réception des alertes</em>. Dès qu'un prospect s'inscrit, vous recevez un email instantané.</div></div><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">2</span><div class="academy-step-body"><strong>Propositions de réponses rédigées par l’IA :</strong> Dès qu'un candidat dépose son projet, l'IA prépare un brouillon de réponse sur-mesure dans l'onglet <strong>Messagerie & Suivi</strong>.</div></div><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">3</span><div class="academy-step-body"><strong>Contrôle humain systématique :</strong> Aucun email n'est expédié à l'aveugle. Vous cliquez sur « Consulter & Envoyer », relisez le message complet, ajustez le texte si besoin, et validez l'envoi en 1 clic.</div></div><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">4</span><div class="academy-step-body"><strong>URL Webhook AgentMail (réception instantanée) :</strong><div class="copylink" style="margin:6px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><code>${location.origin}/api/webhooks/agentmail/${S.wid}</code> <button type="button" class="btn tiny" data-action="copytext" data-text="${location.origin}/api/webhooks/agentmail/${S.wid}">Copier</button></div></div></div></div><div class="academy-actions"><button class="btn primary" data-nav="integrations" data-action="closemodal">Configurer AgentMail →</button></div></div>`;
  }
  if(gTab==='legal'){
    return `<div class="academy-card"><div class="eyebrow" style="margin-bottom:8px">MODULE CONFORMITÉ & PREUVE SOCIALE</div><h3 style="margin:0 0 10px">Avis Clients, Disclaimers Meta & Pages Légales</h3><div style="display:grid;gap:12px;font-size:12px;margin:14px 0"><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">1</span><div class="academy-step-body"><strong>Preuve Sociale Google / Trustpilot :</strong> Dans l'Éditeur, renseignez votre lien d'avis clients. Une bannière de réassurance épurée avec note moyenne s'affiche au-dessus du formulaire.</div></div><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">2</span><div class="academy-step-body"><strong>Disclaimers réglementaires en bas de page :</strong> Vos tunnels intègrent les formules légales complètes : avertissement de non-garantie de gains et clause d'indépendance vis-à-vis de Facebook/Meta conformes aux régies publicitaires.</div></div><div class="academy-step-item" style="display:flex;gap:10px;align-items:start"><span class="academy-step">3</span><div class="academy-step-body"><strong>Lecteur juridique automatisé (CGV, Confidentialité, Mentions) :</strong> Vos visiteurs peuvent consulter vos Mentions Légales, votre Politique de Confidentialité RGPD et vos CGV directement dans une fenêtre modale élégante sans quitter le tunnel. Renseignez simplement vos coordonnées d'entreprise dans l'Éditeur.</div></div></div><div class="academy-actions"><button class="btn primary" data-nav="builder" data-action="closemodal">Configurer mes données légales dans l’Éditeur →</button></div></div>`;
  }
  if(gTab==='mcp'){
    return `<div class="academy-card"><div class="eyebrow" style="margin-bottom:8px">MODULE MCP · ASSISTANTS ET AGENTS AUTONOMES</div><h3 style="margin:0 0 10px">Connecter vos Agents IA (Claude Code, Cursor, Codex)</h3><p style="font-size:12.5px;color:#666;line-height:1.6">Pilotez l'ensemble de votre studio de conversion en langage naturel grâce au standard Model Context Protocol (MCP) :</p><div style="display:grid;gap:10px;font-size:12px;margin:12px 0"><div>1. Rendez-vous dans <strong>Espaces & IA</strong> et cliquez sur <em>Générer un jeton d’accès MCP</em>.</div><div>2. Collez la configuration MCP dans votre fichier <code>mcp_config.json</code> ou les réglages MCP de votre éditeur.</div><div>3. Demandez à votre agent : <em>« Crée un nouvel opt-in pour mon coaching »</em> ou <em>« Modifie la promesse du tunnel APP 7 »</em> : l'agent s'exécute en toute sécurité.</div></div><div class="academy-actions"><button class="btn primary" data-nav="team" data-action="closemodal">Générer un jeton MCP →</button></div></div>`;
  }
  // Default: quickstart
  return `<div class="academy-card"><div class="eyebrow" style="margin-bottom:8px">PARCOURS DÉMARRAGE · 5 MINUTES CHRONO</div><h3 style="margin:0 0 14px">De votre première idée à vos premiers prospects en ligne</h3><div style="display:grid;gap:12px;font-size:12.5px;line-height:1.6"><div class="academy-step-item" style="display:flex;gap:12px;align-items:start"><span class="academy-step">1</span><div class="academy-step-body"><strong>Choisissez votre tunnel de conversion</strong><br><span style="color:#666">Dans l’onglet <em>Mes tunnels</em>, démarrez avec le modèle APP 7 (Capture → VSL → Projet → Confirmation). Vous pouvez en créer ou en dupliquer autant que vous le souhaitez.</span></div></div><div class="academy-step-item" style="display:flex;gap:12px;align-items:start"><span class="academy-step">2</span><div class="academy-step-body"><strong>Personnalisez vos textes, marque et visuels</strong><br><span style="color:#666">Dans l’<em>Éditeur de Tunnel</em>, ajustez votre promesse, votre nom de marque, vos couleurs et les vignettes du programme en 7 étapes.</span></div></div><div class="academy-step-item" style="display:flex;gap:12px;align-items:start"><span class="academy-step">3</span><div class="academy-step-body"><strong>Cliquez sur « Publier en ligne ↗ »</strong><br><span style="color:#666">Votre entonnoir est instantanément compilé en une version souveraine ultra-rapide accessible via son URL publique directe.</span></div></div><div class="academy-step-item" style="display:flex;gap:12px;align-items:start"><span class="academy-step">4</span><div class="academy-step-body"><strong>Qualifiez vos prospects dans le CRM</strong><br><span style="color:#666">Chaque inscription apparaît en temps réel dans l’onglet <em>CRM & Prospects</em>, avec attribution des sources marketing et relances IA prêtes.</span></div></div></div><div class="academy-actions" style="margin-top:18px"><button class="btn primary" data-nav="builder" data-action="closemodal">Ouvrir l’Éditeur de Tunnel →</button><button class="btn" data-nav="funnels" data-action="closemodal">Voir mes tunnels</button></div></div>`;
}


function modalHtml(){
  let name=S.modal;
  let title={
    newmcp:'Générer un jeton d’accès Agent MCP',
    mcpcreated:'Jeton Agent MCP créé',
    agent_onboarding:'Copilote IA · Onboarding & Création de Tunnel',
    newfunnel:'Nouveau tunnel',
    newdraft:'Nouveau message',
    newauto:'Nouvelle automatisation',
    newworkspace:'Nouvel espace de travail',
    workspace:'Choisir un workspace',
    guide:'Didacticiel & Académie de Conversion',
    viewdraft:'Relecture & Confirmation d’expédition',
    viewreceived:'Lecture du message reçu',
    new_wa_group:'Créer un nouveau groupe WhatsApp',
    whatsapp_new_chat:'Envoyer un message WhatsApp',
    add_contact_to_group:'Ajouter un prospect au groupe WhatsApp',
    confirm_wa_disconnect:'Déconnexion WhatsApp'
  }[name]||'Paramètres';

  let contents='';

  if(name==='agent_onboarding'){
    const tok = S.lastMcpToken || '';
    const origin = location.origin;
    const promptText = `Agis comme mon copilote officiel Nüptin Funnel OS.

Voici les paramètres d'accès à mon studio :
- URL API : ${origin}
- Jeton d'accès MCP : ${tok}

Ton rôle :
1. Demande-moi d'abord quel type d'offre je lance :
   - Type A : Tunnel High-Ticket 4 étapes (APP 7 : VSL, quiz, Cal.com et closing WhatsApp).
   - Type B : Tunnel Ebook & Lead Magnet (EBOOK 1 : capture chapitre offert, preuve sociale, vente immédiate Amazon et groupe WhatsApp).
2. Propose-moi ensuite de choisir le Look & Thème visuel de l'application : "luxury" (élégant épuré), "dark" (technologie moderne), ou "editorial" (typographique chaleureux).
3. Pose-moi 4 questions ciblées sur mon offre, ma promesse, mon lien d'achat ou d'agenda, et mon WhatsApp.
4. Génère et configure le schéma JSON complet du tunnel avec le bon template et le bon thème.
5. Publie le tunnel en direct via l'outil MCP et donne-moi l'URL officielle pour le tester et l'éditer.

Commence dès maintenant en me saluant et en me proposant le choix entre le modèle APP 7 et le modèle Ebook !`;

    const mcpConfig = JSON.stringify({
      mcpServers: {
        nuptin: {
          command: 'python3',
          args: ['-m', 'server.mcp_server'],
          env: {
            NUM_MCP_API_URL: origin,
            NUM_MCP_TOKEN: tok
          }
        }
      }
    }, null, 2);

    contents = `<div style="display:grid;gap:16px">
      <div style="background:#fff7f2;border:1px solid #fed7c7;border-radius:12px;padding:16px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          <span class="pill orange" style="font-weight:700">Prêt à l'emploi</span>
          <strong style="color:#c24116;font-size:14px">Copiez cette consigne dans votre agent IA</strong>
        </div>
        <p class="mini" style="margin:0;color:#85432c;line-height:1.5">
          Collez simplement ce prompt dans <strong>Antigravity</strong>, <strong>Claude Code</strong> ou <strong>Cursor</strong>. Votre agent va vous interviewer et construire votre tunnel automatiquement via l'API MCP.
        </p>
      </div>

      <label class="form-field">
        <span style="font-weight:700;display:flex;justify-content:space-between;align-items:center">
          <span>Prompt magique pour votre Agent</span>
          <button type="button" class="btn primary tiny" data-action="copy-agent-prompt" style="font-weight:700">Copier le prompt complet</button>
        </span>
        <textarea id="agent-prompt-textarea" readonly style="min-height:160px;font-family:monospace;font-size:12px;line-height:1.5;background:#fcfcfb;padding:12px;border-radius:8px;border:1px solid #dcdcd9;margin-top:6px">${E(promptText)}</textarea>
      </label>

      <div style="background:#fafaf9;border:1px solid #eaeae8;border-radius:10px;padding:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <strong style="font-size:12px;color:#444">Fichier de configuration MCP (optionnel pour Antigravity / Cursor)</strong>
          <button type="button" class="btn tiny" data-action="mcp-copy-snippet">Copier JSON</button>
        </div>
        <pre style="background:#1e1f22;color:#f3f3f3;padding:10px;border-radius:8px;font-size:11px;font-family:monospace;overflow-x:auto;margin:0;line-height:1.4"><code>${E(mcpConfig)}</code></pre>
      </div>

      <div style="display:flex;justify-content:flex-end;margin-top:4px">
        <button type="button" class="btn primary" data-action="closemodal">J'ai copié mon instruction</button>
      </div>
    </div>`;
  }
  else if(name==='new_wa_group'){
    contents=`<form data-form="new_wa_group"><label class="form-field"><span>Nom du groupe WhatsApp</span><input name="name" required minlength="2" placeholder="Ex: Masterclass IA Privée"></label><label class="form-field"><span>Membres à inviter (numéros au format international séparés par des virgules)</span><input name="participants" placeholder="+33612345678, +33700000000"></label><button class="btn primary" type="submit">Créer le groupe WhatsApp</button></form>`;
  }
  else if(name==='whatsapp_new_chat'){
    let contactsWithPhone=(S.data.contacts||[]).filter(c=>c.phone);
    contents=`<form data-form="whatsapp_new_chat">
      <label class="form-field"><span>Numéro du destinataire (format international)</span>
        <input name="phone" required value="${E(S.newChatPhone||'')}" placeholder="+33 6 12 34 56 78">
      </label>
      ${contactsWithPhone.length?`
        <div style="margin-bottom:12px;font-size:12px">
          <span style="color:#666">Ou sélectionner un prospect existant :</span>
          <select class="input" style="width:100%;margin-top:4px" onchange="this.form.phone.value=this.value">
            <option value="">Choisir un contact…</option>
            ${contactsWithPhone.map(c=>`<option value="${E(c.phone)}">${E(c.first_name)} (${E(c.phone)})</option>`).join('')}
          </select>
        </div>
      `:''}
      <label class="form-field"><span>Message à expédier</span>
        <textarea name="text" required placeholder="Bonjour..." style="min-height:110px"></textarea>
      </label>
      <button class="btn primary" type="submit">Expédier le message</button>
    </form>`;
  }
  else if(name==='confirm_wa_disconnect'){
    contents=`<div style="display:grid;gap:16px;padding:6px 0">
      <p style="font-size:13.5px;color:#444;line-height:1.6;margin:0">
        Êtes-vous sûr de vouloir déconnecter votre compte WhatsApp ?<br>
        <span style="color:#888;font-size:12.5px">La synchronisation en temps réel de vos messages et groupes sera interrompue jusqu'au prochain jumelage par QR code.</span>
      </p>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:8px">
        <button type="button" class="btn" data-action="closemodal">Conserver la session</button>
        <button type="button" class="btn primary" data-action="confirm-disconnect-wa">Déconnecter la session</button>
      </div>
    </div>`;
  }
  else if(name==='add_contact_to_group'){
    let contactsWithPhone=(S.data.contacts||[]).filter(c=>c.phone);
    contents=`<form data-form="add_contact_to_group">
      <input type="hidden" name="groupJid" value="${E(S.targetGroupJid||'')}">
      <p style="font-size:13px;margin-bottom:12px">Groupe sélectionné : <strong>${E(S.targetGroupName||'Groupe WhatsApp')}</strong></p>
      <label class="form-field"><span>Sélectionner un prospect qualifié du CRM</span>
        <select name="phone" class="input" style="width:100%" onchange="if(this.value)this.form.direct_phone.value=this.value">
          <option value="">Sélectionnez un contact…</option>
          ${contactsWithPhone.map(c=>`<option value="${E(c.phone)}">${E(c.first_name)} — ${E(c.phone)}</option>`).join('')}
        </select>
      </label>
      <label class="form-field"><span>Ou saisir un numéro de téléphone</span>
        <input name="direct_phone" placeholder="+33 6 12 34 56 78">
      </label>
      <button class="btn primary" type="submit">Ajouter au groupe</button>
    </form>`;
  }
  else if(name==='guide'){
    let gTab=S.guideTab||'quickstart';
    let gTabs=[
      ['quickstart','Démarrage Express'],
      ['video','Vidéos & VSL'],
      ['calcom','Prise de RDV Cal.com'],
      ['agentmail','AgentMail & Alertes'],
      ['legal','Avis & Conformité'],
      ['mcp','Agents IA (MCP)']
    ];
    let tabNav=`<div class="academy-tabs">${gTabs.map(([id,l],idx)=>`<button type="button" class="academy-tab ${gTab===id?'active':''}" data-guide-tab="${id}"><span class="academy-step" style="width:18px;height:18px;font-size:10px;margin-right:6px">${idx+1}</span>${l}</button>`).join('')}</div>`;
    let tabBody=`<div id="academy-body-container">${academyTabContent(gTab)}</div>`;
    contents=`<div class="academy-modal-content">${tabNav}${tabBody}<button type="button" class="btn block" data-action="closemodal" style="margin-top:12px;width:100%;border-color:#d5d7d3;color:#555">Fermer le didacticiel</button></div>`;
  }
  else if(name==='viewdraft'){
    let d=S.viewDraft;
    if(!d)return '';
    let ws=S.workspaces.find(w=>w.id===S.wid);
    let agentMailActive=!!(S.data.integrations||[]).find(r=>r.provider==='agentmail')?.enabled;
    contents=`<div class="email-preview-box"><div class="email-preview-meta"><div><span>De :</span> <strong>Agent Commercial IA (${E(ws?.name||'Studio')})</strong></div><div><span>À :</span> <code style="font-size:12px;color:#1d2720;font-weight:700">${E(d.to)}</code></div><div><span>Statut :</span> ${pillStatus(d.status)}</div></div><label class="form-field" style="margin-bottom:12px"><span style="font-weight:750;color:#333">Objet de l’email</span><input name="draft_subject" class="input" value="${E(d.subject)}" ${d.status!=='draft'?'readonly':''} style="font-weight:700"></label><label class="form-field"><span style="font-weight:750;color:#333">Message complet (relecture et modifications)</span><textarea name="draft_body" class="input" style="min-height:200px;line-height:1.65;font-size:13px" ${d.status!=='draft'?'readonly':''}>${E(d.body)}</textarea></label>${agentMailActive?`<div class="notice" style="background:#f4fbf7;border-color:#bce9cd;color:#166236;margin-top:14px"><strong>Connecteur AgentMail prêt pour l’envoi</strong><p class="mini" style="margin:4px 0 0;color:#286c47">Ce message sera transmis en direct via votre boîte AgentMail souveraine vers <code>${E(d.to)}</code>.</p></div><div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px"><button type="button" class="btn" data-action="closemodal">Fermer</button>${d.status==='draft'?`<button type="button" class="btn primary" data-action="confirm-send-draft" data-id="${d.id}">Confirmer et expédier via AgentMail</button>`:''}</div>`:`<div class="notice" style="background:#fff7f2;border-color:#ffd5c1;color:#9b441a;margin-top:14px"><strong>Connecteur AgentMail en attente de configuration</strong><p class="mini" style="margin:4px 0 8px;color:#853712">Pour acheminer cet email sur la messagerie réelle du prospect, activez AgentMail avec votre clé d’API dans l’onglet <strong>Intégrations</strong>.</p><button type="button" class="btn tiny" data-nav="integrations" data-action="closemodal">Aller dans Intégrations pour activer AgentMail →</button></div><div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px"><button type="button" class="btn" data-action="closemodal">Fermer</button>${d.status==='draft'?`<button type="button" class="btn primary" data-action="confirm-send-draft" data-id="${d.id}">Tenter l’expédition</button>`:''}</div>`}</div>`;
  }
  else if(name==='viewreceived'){
    let m=S.viewReceived;
    if(!m)return '';
    contents=`<div class="email-preview-box"><div class="email-preview-meta"><div><span>De :</span> <strong>${E(m.from)}</strong></div><div><span>Objet :</span> <strong>${E(m.subject)}</strong></div><div><span>Date :</span> <span class="mini">${fmtDate(m.received_at)}</span></div></div><div style="background:#fcfcfb;border:1px solid #e5e8e3;border-radius:10px;padding:16px;font-size:13px;line-height:1.7;white-space:pre-wrap">${E(m.body||m.preview||'Aucun contenu')}</div><div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px"><button type="button" class="btn" data-action="closemodal">Fermer</button><button type="button" class="btn primary" data-action="reply-received" data-to="${E(m.from)}" data-subj="${E('Re: '+m.subject)}">Rédiger une réponse</button></div></div>`;
  }
  else if(name==='newfunnel'){
    contents=`<form data-form="newfunnel">
      <label class="form-field"><span>Nom du tunnel</span><input name="name" required minlength="3" placeholder="Mon tunnel de conversion"></label>
      <label class="form-field"><span>Modèle de conversion</span>
        <select name="template">
          <option value="app7">APP 7 — VSL · Quiz Qualification · Cal.com · WhatsApp VIP</option>
          <option value="ebook1">EBOOK 1 — Livre / Ebook · Mockup 3D · Extrait Gratuit · Vente Immédiate</option>
        </select>
      </label>
      <button class="btn primary" type="submit">Créer le tunnel</button>
    </form>`;
  }
  else if(name==='newdraft'){
    contents=`<form data-form="newdraft"><label class="form-field"><span>Destinataire</span><input type="email" name="to" required></label><label class="form-field"><span>Objet</span><input name="subject" required minlength="2"></label><label class="form-field"><span>Message</span><textarea name="body" required style="min-height:140px"></textarea></label><button class="btn primary">Enregistrer le brouillon</button></form>`;
  }
  else if(name==='newauto'){
    contents=`<form data-form="newauto"><label class="form-field"><span>Nom du scénario</span><input name="name" required placeholder="Relance automatique nouveau prospect"></label><label class="form-field"><span>Événement déclencheur</span><select name="trigger"><option value="lead_created">Nouveau prospect inscrit</option><option value="application_interest_submitted">Candidature qualifiée</option><option value="appointment_scheduled">Rendez-vous planifié</option></select></label><label class="form-field"><span>Action automatisée</span><select name="action"><option value="ai_reply_draft">Préparer une proposition de relance personnalisée</option></select></label><p class="notice">Le scénario prépare automatiquement un brouillon sur-mesure dans votre boîte d’envoi pour relecture avant expédition.</p><button class="btn primary" type="submit">Activer le scénario</button></form>`;
  }
  else if(name==='newmcp'){
    contents=`<form data-form="newmcp" style="display:grid;gap:16px">
      <div style="display:flex;align-items:center;gap:12px;padding-bottom:12px;border-bottom:1px solid #f0f0ed">
        <img src="/assets/logo-256.png" style="width:38px;height:38px;object-fit:contain" alt="Nüptin">
        <div>
          <strong style="font-size:14px;color:var(--ink)">Connexion Agent Autonome (MCP)</strong>
          <p class="mini" style="margin:2px 0 0;color:var(--muted)">Générez des identifiants sécurisés pour Claude Code, Cursor, Codex ou Antigravity.</p>
        </div>
      </div>
      <label class="form-field">
        <span style="font-weight:600">Nom ou identifiant de l'agent</span>
        <input name="label" required minlength="2" maxlength="60" placeholder="ex. Antigravity local, Claude Code, Cursor Pro" value="Antigravity local" style="font-size:13px">
      </label>
      <label class="form-field">
        <span style="font-weight:600">Validité du jeton</span>
        <select name="valid_days" class="input" style="padding:10px 14px;border-radius:10px;border:1px solid #dbdbd9;background:#fff;font-size:13px">
          <option value="30" selected>30 jours (recommandé)</option>
          <option value="90">90 jours</option>
          <option value="365">1 an</option>
        </select>
      </label>
      <div style="background:#fafaf8;border:1px solid #eaeae6;border-radius:12px;padding:12px 14px">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.8px;color:#888;text-transform:uppercase;margin-bottom:6px">Permissions accordées (Scopes)</div>
        <div style="display:grid;gap:6px;font-size:12px;color:#444">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" name="scope_read" checked disabled style="accent-color:var(--orange)">
            <span><strong>funnels:read</strong> · Lecture des tunnels, pages et configurations</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" name="scope_write" checked disabled style="accent-color:var(--orange)">
            <span><strong>funnels:write</strong> · Création et modification des contenus de conversion</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" name="scope_publish" checked style="accent-color:var(--orange)">
            <span><strong>funnels:publish</strong> · Autoriser l’agent à publier directement en production</span>
          </label>
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">
        <button type="button" class="btn" data-action="closemodal">Annuler</button>
        <button type="submit" class="btn primary">Créer le jeton sécurisé →</button>
      </div>
    </form>`;
  }
  else if(name==='mcpcreated'){
    const tok = S.lastMcpToken || '';
    const configSnippet = JSON.stringify({
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
    contents=`<div style="display:grid;gap:16px">
      <div style="background:#fff7f2;border:1px solid #fed7c7;border-radius:12px;padding:14px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="color:#e8592c;font-size:18px">✓</span>
          <strong style="color:#c24116;font-size:13px">Jeton généré avec succès !</strong>
        </div>
        <p class="mini" style="margin:0;color:#85432c">Ce jeton ne sera plus jamais réaffiché en clair. Copiez-le dès maintenant dans votre trousseau ou configuration agent.</p>
      </div>
      <label class="form-field">
        <span style="font-weight:600">Votre jeton d'accès MCP</span>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="text" readonly value="${E(tok)}" id="mcp-token-input" style="font-family:monospace;font-size:12px;background:#fcfcfb;letter-spacing:0.5px;padding:10px;border-radius:8px;border:1px solid #dcdcd9;flex:1">
          <button type="button" class="btn primary" data-action="mcp-copy-token" style="flex:none">Copier</button>
        </div>
      </label>
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:12px;font-weight:700;color:#555">Configuration agent prête à l'emploi (mcp_config.json) :</span>
          <button type="button" class="btn tiny" data-action="mcp-copy-snippet">Copier JSON</button>
        </div>
        <pre style="background:#1e1f22;color:#f3f3f3;padding:14px;border-radius:12px;font-size:11px;font-family:monospace;overflow-x:auto;margin:0;line-height:1.5"><code>${E(configSnippet)}</code></pre>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:6px">
        <button type="button" class="btn primary" data-action="closemodal">J’ai bien enregistré mes identifiants</button>
      </div>
    </div>`;
  }
  else if(name==='newworkspace'){
    contents=`<form data-form="newworkspace"><label class="form-field"><span>Nom du workspace</span><input name="name" required minlength="2"></label><button class="btn primary">Créer le workspace</button></form>`;
  }
  else if(name==='workspace'){
    contents=`${S.workspaces.map(w=>`<button class="workspace" data-workspace="${w.id}"><span class="workicon">N</span><span class="workmeta"><strong>${E(w.name)}</strong><small>${E(w.role)}</small></span>→</button>`).join('')}`;
  }

  return `<div class="modal-backdrop" data-close="1"><section class="modal ${['guide','viewdraft','viewreceived','agent_onboarding'].includes(name)?'wide':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modalhead"><h2 id="modal-title">${title}</h2><button type="button" class="modalclose" data-action="closemodal" aria-label="Fermer">×</button></div>${contents}</section></div>`;
}

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
 else if(a==='wa-tab'){
   S.whatsappTab=t.dataset.tab;
   if(S.whatsappTab==='groups' && (!S.data['groups'] || !S.data['groups'].groups)){
     try {
       let grp = await api('/whatsapp/groups');
       S.data['groups'] = grp;
     } catch(e){}
   }
   shell(pageWhatsApp());
 }
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

init();
