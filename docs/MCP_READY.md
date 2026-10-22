# NÜM Funnel OS — MCP Ready (local stdio)

## État
Le serveur MCP **local stdio** et les endpoints API des agents sont fournis.
Ce n'est pas encore un serveur MCP distant ChatGPT :
l'accès distant nécessite HTTPS, MCP Streamable HTTP, un serveur OAuth 2.1
avec Protected Resource Metadata (RFC 9728), scopes, audience et tests E2E.
Un Personal Access Token NÜM n'est PAS un fournisseur OAuth public.

## Installation et premier test
Dans le répertoire du projet :
```
python3 -m venv .venv
. .venv/bin/activate
pip install -r server/requirements-mcp.txt
```
Démarrer le SaaS (`docker compose up -d --build`) puis se connecter
dans le dashboard → **Espaces de travail → Agents IA · Accès MCP**.
Créer un jeton, par défaut avec `funnels:read` + `funnels:write`,
expiration 30 jours. Le copier immédiatement dans un gestionnaire de secrets.
La valeur **n'est plus visible après la création**.

Dans le terminal utilisé pour lancer votre agent :
```
export NUM_MCP_API_URL=http://127.0.0.1:8080
export NUM_MCP_TOKEN='num_mcp_...'
python -m server.mcp_server
```
Le dernier processus parle sur stdin/stdout : **il faut le lancer depuis
un client MCP**, pas écrire à la main dans ce terminal.

## Codex ou autres IDE disposant d'un client MCP stdio
Configurer leur liste MCP avec :
```
{
  "mcpServers": {
    "num-funnel-os": {
      "command": "/CHEMIN/ABSOLU/PROJET/.venv/bin/python",
      "args": ["-m", "server.mcp_server"],
      "cwd": "/CHEMIN/ABSOLU/PROJET"
    }
  }
}
```
La syntaxe exacte du fichier de configuration dépend du client
(Codex, Claude Code, Antigravity, etc.). Certaines versions utilisent
`mcp_servers` ou un fichier TOML. **Transmettre le jeton par un gestionnaire
de secrets ou l'environnement du processus**, plutôt que l'enregistrer
dans un fichier partagé ou un dépôt git.

Exemple de section TOML pour un client acceptant ce format :
```
[mcp_servers.num-funnel-os]
command = "/chemin/projet/.venv/bin/python"
args = ["-m", "server.mcp_server"]
```

## Outils réellement exposés
- `list_funnels` — lecture dans le workspace autorisé
- `get_funnel` — lecture du brouillon, structure et URL
- `create_optin` — création d'un brouillon à partir d'APP 7
- `update_funnel_content` — texte/couleur du brouillon sans publication
- `publish_funnel` — **seulement** avec scope additionnel
  `funnels:publish`, qui n'est pas donné par défaut.

Les agents ne peuvent pas accéder aux bases SQL ou à l'API InsForge
administrateur via ces outils, ni exécuter de commandes shell serveur.

## Sécurité / multi-client
- Les endpoints `/api/agent/*` exigent `Authorization: Bearer num_mcp_...`
  et n'acceptent aucune session navigateur en substitution.
- Les jetons sont enregistrés seulement en SHA-256 (valeur claire affichée
  une fois), limités à un workspace, expirent à 90 jours maximum,
  sont révocables et héritent des permissions actuelles du propriétaire.
- Les publications nécessitent une autorisation spécifique et doivent
  être approuvées au niveau du client agent.
- Ne jamais communiquer la clé administrateur InsForge à un agent,
  ni utiliser une instance production pour les tests.

## Extension future : accès direct ChatGPT
Réaliser un nouveau serveur HTTP Streamable MCP, hébergé en HTTPS,
authentifié avec OAuth 2.1 pour chaque utilisateur, utilisant
Protected Resource Metadata, validation d'audience/resource, consentements,
approbations de publication et audit des outils. Tester depuis ChatGPT
et chaque fournisseur d'agents : l'interopérabilité n'est pas garantie
uniquement parce que le serveur local fonctionne.

Docs : https://py.sdk.modelcontextprotocol.io/run/authorization/
