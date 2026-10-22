# NÜM Funnel OS — SaaS Docker v1.3 (Google InsForge + MCP local)

Application multi-workspace avec PostgreSQL, tunnel APP 7, CRM,
AgentMail / Cal.com / InsForge Storage/Functions facultatifs.
Nouveautés : Google OAuth via InsForge avec PKCE serveur, liaison sécurisée
des comptes locaux, récupération de mot de passe par mail système AgentMail,
serveur MCP stdio limité par jeton et icônes SVG harmonisées.

## Démarrage
```
python3 scripts/init_env.py
docker compose up -d --build
docker compose exec app python -m pytest -q tests
```
Ouvrez http://localhost:8080. Les intégrations sont **désactivées par défaut**.

## Brancher Google et agents
- `docs/GOOGLE_INSFORGE_AUTH.md` : configuration InsForge DEV, Google
  Cloud, callback et secrets, mot de passe oublié.
- `docs/MCP_READY.md` : token de workspace, outils MCP stdio, connexion
  Codex/Antigravity et limites de ChatGPT distant.
- `AGENTS.md` : instructions et critères de sécurité pour agents code.
- `migrations/003_google_mcp_auth_up.sql` : migration d'une installation
  PostgreSQL existante v1.2 vers v1.3.
- `docs/INTEGRATIONS_V12.md` : InsForge storage/functions, Cal.com et IA.

**Important :** les tests automatisés simulent Google, InsForge, AgentMail
et les webhooks externes. Cette archive n'a pas été démarrée dans Docker
dans cet environnement et les connexions à vos véritables comptes DEV
n'ont pas été exécutées. Le serveur MCP local est implémenté mais sa
connexion à un vrai client Codex/ChatGPT/Antigravity reste à valider.
ChatGPT requiert un serveur MCP distant HTTPS avec OAuth, non fourni ici.

## Sécurité
Le dashboard utilise une session cookie httpOnly avec CSRF. Les jetons MCP
portent des scopes séparés, sont hashés, expirent et sont révocables.
Les comptes Google sont associés à l'identifiant InsForge stable,
sans lien automatique par simple correspondance d'email.
Pour la production, remplacer le ratelimit mémoire par Redis, durcir
les migrations et installer les mécanismes d'audit et d'exploitation.
