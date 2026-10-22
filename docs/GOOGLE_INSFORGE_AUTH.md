# Google OAuth InsForge — NÜM Funnel OS v1.3

## Objectif et état
**Implémenté dans le code**, sans connexion à un projet distant. Tests HTTP simulés uniquement.
InsForge est le fournisseur d'identité Google, FastAPI conserve sa session NÜM
signée et ses permissions de workspace. Les comptes NÜM existants restent valables.
Aucun secret Google ne doit être copié dans le frontend ou dans un prompt.

## Configuration, d'abord sur un projet InsForge DEV
1. Dans Google Cloud Console, créer/configurer l'application OAuth et l'écran de consentement.
2. Ajouter l'URI **backend InsForge** indiqué par votre console InsForge comme
   URI de redirection autorisée dans Google Cloud (et non le callback FastAPI).
   Pour un déploiement InsForge récent, la forme est souvent
   `https://<project>.insforge.app/api/auth/oauth/google/callback` ;
   **copier la valeur affichée par InsForge**, car elle dépend du déploiement.
3. Entrer GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans les paramètres secrets
   du backend InsForge DEV, jamais dans NÜM ni dans le code frontend.
4. Autoriser l'URL applicative exacte dans `allowedRedirectUrls` InsForge :
   `http://localhost:8080/api/auth/insforge/callback`
   en local, puis `https://staging.example.com/api/auth/insforge/callback`
   en staging. Garder une allowlist explicite en production.
5. Configurer le projet NÜM `./.env` (côté serveur) :
   ```
   INSFORGE_BASE_URL=https://<votre-projet-insforge-dev>
   INSFORGE_GOOGLE_AUTH_ENABLED=true
   PUBLIC_APP_URL=http://localhost:8080
   ```
   `PUBLIC_APP_URL` doit correspondre exactement à l'URL dans le navigateur
   (y compris le port). HTTPS obligatoire sauf localhost/127.0.0.1.
6. Redémarrer Docker : `docker compose up -d --build`.

## Parcours et sécurité
- Le navigateur ouvre `/api/auth/insforge/google/start` ; le backend génère
  PKCE S256, conserve le `code_verifier` chiffré en base et place un identifiant
  opaque dans la session httpOnly signée.
- InsForge héberge le parcours Google et retourne `insforge_code` au callback.
- FastAPI échange le code côté serveur, puis appelle
  `GET /api/auth/sessions/current` avec l'access token de courte durée.
  Il vérifie l'identité InsForge et ne transmet pas le jeton au navigateur.
- Si l'identité `(provider=google, provider_subject)` existe, retrouver
  l'utilisateur NÜM. Si elle est nouvelle et l'email inutilisé, créer
  workspace + tunnel APP 7.
- Si un compte NÜM porte déjà le même email, **ne PAS fusionner automatiquement**.
  Le propriétaire se connecte d'abord avec son mot de passe NÜM puis clique
  « Associer mon compte Google » depuis Espaces de travail.
- La liaison exige une session NÜM active, le même email vérifié et
  l'absence de liaison contradictoire. Ne jamais se baser uniquement sur
  une adresse email reçue du navigateur.
- Les cookies doivent être `COOKIE_SECURE=true` en HTTPS production.

## Mot de passe oublié local
Configuration séparée du mail système :
```
AUTH_MAIL_AGENTMAIL_API_KEY=<secret côté serveur>
AUTH_MAIL_INBOX_ID=<inbox système>
```
`POST /api/auth/password/forgot` crée un token à usage unique expirant en
15 minutes, stocké sous forme de hash, et une notification durable dans la
file SQL. L'URL de récupération est chiffrée dans cette file.
`POST /api/auth/password/reset` marque tous les tokens utilisés, met à jour
le hash Argon2 et invalide les sessions antérieures (session_version).
Le frontend reprend `/?reset_token=...` puis supprime le token de l'adresse.
Sans AgentMail système configuré, la demande renvoie 503 (pas de fausse
promesse d'envoi). Ne mettez jamais la clé API dans le JS public.

## Tests recommandés en staging avant activation
- Google nouvel utilisateur, Google utilisateur existant, association explicite
  à un compte local, Google d'adresse différente, annulation fournisseur,
  callback expiré, authentification d'un autre compte Google.
- Vérifier qu'aucun compte local n'est récupérable par simple correspondance
  d'email, et que les sessions expirées ne permettent pas d'association.
- Vérifier email local et mot de passe oublié, échecs de fournisseur mail,
  jeton expiré, double usage, révocation des anciennes sessions.
- Vérifier les redirections HTTPS, les cookies, la configuration OAuth InsForge
  et les permissions après changement de workspace.

Sources officielles consultées :
- https://github.com/InsForge/InsForge-sdk-js/blob/main/SDK-REFERENCE.md
- https://insforge.dev/blog/insforge-custom-oauth
- Documentation OpenAPI InsForge d'authentification présente dans les fichiers
  de référence fournis (`apiauth.md`).
