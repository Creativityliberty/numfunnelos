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
        <div class="cards" style="text-align:left;margin-bottom:28px;grid-template-columns:repeat(3,1fr)">
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

        <div style="display:grid;grid-template-columns:320px 1fr;gap:18px;min-height:580px;background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:var(--shadow)">
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

          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(360px, 1fr));gap:16px;margin-top:18px">
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
