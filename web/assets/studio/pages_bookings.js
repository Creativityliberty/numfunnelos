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
