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
