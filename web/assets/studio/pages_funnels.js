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
