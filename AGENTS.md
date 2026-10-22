# AGENTS — NÜM Funnel OS v1.3

Tu es un agent de code intervenant sur une application SaaS de funnels multi-tenant.
**L'API FastAPI et le modèle de données PostgreSQL existants font foi.**
Ne pas réécrire Laravel, Next.js ou InsForge sans décision explicite.
APP 7 est le premier template réel et doit rester fonctionnel.

## Conventions
- Conserver le design system dashboard gris perle/blanc/corail et les icônes SVG locaux.
- Priorité : confidentialité, Auth Google InsForge, MCP scoping et intégrations existantes.
- Chaque table métier porte `workspace_id`; joindre tous les accès API au membre
  authentifié et à son workspace. Aucun accès cross-tenant implicite.
- Google OAuth via InsForge : PKCE, verifier côté serveur, email vérifié,
  identité fondée sur le subject InsForge, jamais sur l'email seul.
  Les comptes existants exigent une liaison explicite après login local.
- Aucune clé InsForge admin, AgentMail ou provider IA dans un HTML/JS ou un
  jeton MCP. Toutes les clés dans des secrets d'environnement serveur.
- Garder Google Auth désactivé si la configuration est absente/incomplète.
- MCP : ne pas ajouter de tool générique SQL, shell, fichier ou déploiement.
  Un token non muni de `funnels:publish` ne doit jamais publier.
  Une publication doit faire l'objet d'une confirmation côté client agent.
- Emission email automatique en dehors de la file SQL interdite.
  L'IA peut préparer des brouillons ; leur envoi exige validation humaine.
- Migrations PostgreSQL lisibles, additives et réversibles lorsque possible.
  `migrations/003_google_mcp_auth_up.sql` doit précéder l'activation de la v1.3
  sur toute base de données existante. Faire un backup staging d'abord.
- Tests : `python -m pytest -q tests` et `node --check web/assets/studio.js`.

## Actions restant à réaliser avec les comptes DEV
1. Activer OAuth Google dans InsForge DEV + Google Cloud, tester la callback.
   Guide `docs/GOOGLE_INSFORGE_AUTH.md`.
2. Configurer une boîte AgentMail système, tester réinitialisation réelle
   et vérifier les emails en échec ou répétés.
3. Tester un client MCP local (Codex/Antigravity) avec un jeton à faible scope.
   Guide `docs/MCP_READY.md`.
4. Ajouter une véritable solution OAuth 2.1 pour un futur serveur MCP distant.
5. Reprendre InsForge Storage / Functions, Cal.com, tracking publicitaire
   et facturation en staging seulement, après audits de permissions.
6. Tests de charge, limites de taux Redis, journal d'audit, sécurité cookies,
   sauvegardes et CI avant production.

---

# InsForge Backend & MCP Integration

- **Project ID**: `4440c998-748d-41b8-ab13-7d15177f1ead`
- **Project Name**: `numfunnelos`
- **Region**: `eu-central`
- **Base URL**: `https://ana6mz3a.eu-central.insforge.app`
- **API Key**: `ik_f892c5e8a4c2c817a230e6317ce61f05`

## MCP Tools & Capabilities
InsForge provides PostgREST DB, Auth, Storage, Functions, Realtime, and OpenRouter AI integrations.
MCP server configuration for Antigravity is installed in `~/.gemini/antigravity/mcp_config.json`.
