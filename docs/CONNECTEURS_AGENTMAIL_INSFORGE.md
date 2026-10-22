# NÜM Funnel OS v1.1 — Connecteurs APP 7 / AgentMail / InsForge

## Architecture réellement livrée
- **SQL NÜM = source de vérité** : contacts, consentements, tunnels, candidatures, rendez-vous, événements.
- `record_event()` matérialise l'événement, `enqueue_notification()` ajoute un outbox
  dans **la même transaction** SQL. Aucun appel réseau pendant le formulaire public.
- Un worker asyncio interne (10 s) envoie les jobs due via AgentMail ou InsForge DEV,
  avec `skip_locked` PostgreSQL, compteur de tentatives, délai exponentiel et état terminal `failed` (5 tentatives).
- `/api/integrations/deliveries` montre au membre du workspace l'état des jobs sans payload ni secret.
- `/api/realtime/stream?workspace_id=<UUID>` envoie des notifications SSE (même origine, session authentifiée, membership vérifié)
  et rafraîchit automatiquement l'interface après lead, candidature, RDV ou message entrant.
  **Ceci est un flux SSE NÜM** : pas encore un canal InsForge Realtime.

## AgentMail (réel si connecté par l'utilisateur)
1. Dashboard > Intégrations > AgentMail : configurer `inbox_id`, clé API côté serveur,
   destinataire `notification_to` et activer.
2. Pour réception, créer un webhook **sur une URL HTTPS publiquement accessible**
   `https://votre-domaine/api/webhooks/agentmail/<workspace_id>` dans AgentMail :
   abonnements recommandés `message.received`, `message.sent`, `message.delivered`, `message.bounced`.
3. Récupérer le **secret `whsec_...` propre au webhook**, enregistrer dans NÜM.
4. Les webhooks sont vérifiés sur **body brut**, headers `svix-id`, `svix-timestamp`,
   `svix-signature`, HMAC-SHA256 et 5 min d'écart maximum.
5. Après signature, NÜM confirme que `inbox_id` dans le payload signé correspond
   exactement à la boîte configurée du workspace. Le `event_id` est dédupliqué en SQL.
6. Les événements reçus et le message initial sont journalisés. Aucune réponse IA
   autonome n'est lancée depuis un email externe.

La sortie de mails est déclenchée **seulement après** configuration explicite et
en fonction des événements `lead_created`, `application_interest_submitted`, `appointment_scheduled`.
Les envois peuvent être dupliqués si AgentMail accepte une requête puis que la
réponse réseau se perd ; le système est « au moins une fois », pas « exactement une fois ».
Ne pas promettre de délivrabilité, et configurer la gestion des bounces/suppressions
avant un envoi important.

En local, les webhooks externes ne peuvent pas atteindre `localhost` directement.
Utiliser HTTPS public en staging, pas d'exposition sans proxy/auth/protection.

## InsForge (mirroring optionnel en DEV uniquement)
1. Créer un projet **InsForge DEV séparé** de BioDeck/production.
2. Appliquer manuellement `integrations/insforge/001_num_funnel_events.sql`
   après revue des permissions. Table backend-only `num_funnel_events` avec contrainte unique
   `(workspace_id,event_id)` pour le miroir.
3. Ajouter dans `.env` (secrets serveur, jamais JS) :
   ```
   INSFORGE_EVENT_MIRROR_ENABLED=true
   INSFORGE_BASE_URL=https://VOTRE-PROJET-DEV
   INSFORGE_ADMIN_API_KEY=VOTRE_CLE_ADMIN_DEV
   ```
4. `docker compose up -d --build`, puis créer un prospect APP 7 **avec consentement de mesure**.
5. Vérifier le job `insforge_mirror` dans `GET /api/integrations/deliveries`,
   puis la ligne côté InsForge DEV.
6. Le connecteur utilise la route API des records InsForge. Les variations
   de version/API de votre instance doivent être validées avec une véritable
   écriture en staging avant un déploiement de production.

Ce miroir enregistre uniquement les ID de workspace/funnel/event, type et date,
**pas les emails, ni les textes ou messages**. Les événements publics d'un contact
ne sont transmis que si son dernier consentement de mesure est accordé.
Aucun Pixel OpenAI ou CAPI n'est activé ici.

## Sécurité et limites à corriger avant production
- La base PostgreSQL NÜM **n'est pas synchronisée** avec Auth ou Database InsForge :
  pas de double système d'identité.
- La publication sur domaine public nécessite TLS, COOKIE_SECURE=true, reverse proxy
  confiance définie, politiques de sécurité et rotation des secrets.
- Worker dans le process API : **un seul processus pour la V1.1**. Pour du multi-réplica,
  extraire un worker dédié et une migration Alembic avant montée en charge.
- `Base.metadata.create_all()` ajoute les tables nouvelles, mais **ne remplace pas
  des migrations versionnées** sur des bases existantes.
- Le rate limiting public est encore en mémoire : remplacer par Redis avant prod.
- SSE est un flux privé de rafraîchissement ; il ne remplace pas InsForge Realtime et
  ne garantit pas le replay des événements perdus.
- Sauvegardes, RGPD, suppression/expiration de données, monitoring, quotas,
  RBAC complet, AgentMail EU/US, domaines et paiement : non finalisés.
- Les erreurs réseau sortantes sont volontairement condensées côté UI et logs.
- Ne donner AUCUN accès admin InsForge au navigateur, à une IA non approuvée, ni à des
  agents pouvant modifier la production.

## Tests
```
python3 scripts/init_env.py
docker compose up -d --build
docker compose exec app python -m pytest -q tests
```
Les tests externes sont simulés avec `httpx.MockTransport` pour ne pas exiger de
vraies clés ou effectuer des envois pendant QA.
