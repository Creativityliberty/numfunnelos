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
1. Pose-moi 5 questions simples sur mon activité pour comprendre mon offre, ma promesse, mes couleurs, mon lien Cal.com éventuel et mon groupe WhatsApp.
2. Récupère automatiquement les éléments utiles et génère mon premier tunnel de conversion complet avec le modèle APP 7.
3. Publie le tunnel directement en ligne et donne-moi les liens pour le tester et l'éditer.

Commence dès maintenant en me saluant et en me posant la première question !`;

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
    contents=`<div>${tabNav}${tabBody}<button type="button" class="btn primary block" data-action="closemodal" style="margin-top:10px">Fermer le didacticiel</button></div>`;
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
    contents=`<form data-form="newfunnel"><label class="form-field"><span>Nom du tunnel</span><input name="name" required minlength="3" placeholder="Ma masterclass IA"></label><label class="form-field"><span>Modèle de départ</span><select name="template"><option value="app7">APP 7 — Capture · VSL · Candidature · Merci</option></select></label><button class="btn primary" type="submit">Créer le tunnel</button></form>`;
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
