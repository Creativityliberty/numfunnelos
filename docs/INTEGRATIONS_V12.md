# Contrats d'intégration NÜM Funnel OS v1.2

## 1. InsForge Storage

D'après `storageclient.md` du dossier InsForge joint :
`PUT /api/storage/buckets/{bucketName}/objects/{objectKey}` prend un champ multipart `file`.
Authentification via `x-api-key`, uniquement côté serveur FastAPI.

NÜM :
- `POST /api/assets` (authentification et CSRF requis, owner/admin).
- `GET /api/assets` (membres du workspace).
- `GET /api/assets/{id}` (membres du même workspace).
- Clé forcée `{workspace_uuid}/{asset_uuid}.{extension}`.
- Bucket privé configurable par variable d'environnement.
- Signatures des fichiers vérifiées, taille limitée à 12 Mo, extensions approuvées.
- Aucune URL S3 temporaire côté public dans cette V1 ; les assets ne sont pas encore publiables dans le tunnel public. Un modèle d'accès public signé contrôlé sera nécessaire pour le lecteur vidéo client.

## 2. InsForge Functions

D'après `functionclient.md` : `POST /functions/{slug}` transmet un JSON au runtime.
NÜM autorise uniquement les slugs dans `INSFORGE_FUNCTION_ALLOWLIST` et nécessite
`INSFORGE_FUNCTION_SHARED_SECRET` d'au moins 24 caractères.

Endpoint : `POST /api/insforge/functions/{slug}/invoke`
- owner/admin uniquement, CSRF et workspace requis ;
- charge utile max 6000 caractères ;
- journal d'événement sans sauvegarder la charge utile ;
- ne pas accepter de slugs arbitraires au navigateur.

Template `integrations/insforge/functions/num-ai-draft.ts` à revoir puis déployer
manuellement sur InsForge DEV : vérifie un secret service, appelle l'IA via le SDK
InsForge, retourne `{"subject":"...","body":"..."}`.
Prévoir les variables InsForge Function : `NUM_SERVICE_SECRET`, `INSFORGE_BASE_URL`,
`ANON_KEY` et facultativement `NUM_AI_MODEL`. Aucun accès aux contacts complets.
La disponibilité exacte des modèles dépend du projet InsForge.

Configuration Docker (dans `.env`):
```dotenv
INSFORGE_BASE_URL=https://VOTRE-PROJET-DEV.insforge.app
INSFORGE_ADMIN_API_KEY=...                  # clé serveur
INSFORGE_STORAGE_ENABLED=false              # passer à true après création du bucket PRIVÉ
INSFORGE_STORAGE_BUCKET=num_funnel_assets
INSFORGE_FUNCTION_ALLOWLIST=num-ai-draft
INSFORGE_FUNCTION_SHARED_SECRET=...         # même valeur que NUM_SERVICE_SECRET dans la function
INSFORGE_AI_DRAFT_FUNCTION=num-ai-draft     # sinon génération par modèle local (sans IA)
```

InsForge event mirror préexistant :
`INSFORGE_EVENT_MIRROR_ENABLED=false` par défaut ; si activé, la table du projet DEV
doit exister (voir `integrations/insforge/001_num_funnel_events.sql`).
L'admin key n'est jamais utilisée côté navigateur.

## 3. Cal.com

Référence officielle : https://cal.com/docs/developing/guides/automation/webhooks
La signature est `x-cal-signature-256` : `HMAC_SHA256(secret, raw_body)` (hexdigest).
NÜM vérifie la signature à temps constant *avant* de parser les champs métier.
La liaison tenant est faite avec un secret dédié au workspace ET un Event Type ID
stocké dans `Integration`. On ne crée pas automatiquement un nouveau contact à
partir d'un email arbitraire venu du webhook.

1. Créer un type d'événement chez Cal.com.
2. Configurer lien HTTPS `https://cal.com/...` + Event Type ID + secret dans NÜM.
3. Créer sur Cal.com un webhook à l'adresse :
   `https://VOTRE_DOMAINE/api/webhooks/calcom/WORKSPACE_UUID`
4. Souscrire à `BOOKING_CREATED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED`.
5. Vérifier le premier webhook en DEV ; un lead correspondant doit déjà exister dans NÜM.
6. Ne pas utiliser `localhost` comme destination sur Cal.com SaaS (HTTPS publique exigée).

Le webhook confirmé crée/modifie `cal_bookings`, un `Event` de conversion, et une
notification dans l'outbox si AgentMail est configuré.
L'UI affiche les RDV externes et locaux dans le calendrier. Les annulations passent
au statut `cancelled`; les reports mettent à jour le créneau.
Ne pas croire que l'ouverture du lien Cal.com = réservation : seule la réception
signée du webhook crée l'événement dans NÜM.

## 4. Automatisations IA

API :
- `POST /api/automations` trigger/action pris en charge.
- `GET /api/automations/runs` pour l'historique.
- Action `ai_reply_draft` sur `lead_created`, `application_interest_submitted`,
  ou `appointment_scheduled`. Exige le dernier consentement marketing actif.
- La file `automation_runs` est durable, idempotence `(automation_id,event_id)`,
  retry jusqu'à 4 fois ; traitement dans le worker.
- À chaque exécution, le consentement est revérifié avant appel externe.
- L'appel à l'IA ne contient ni email, ni prénom, ni message libre du candidat,
  seulement type d'événement et étape de projet.
- Chaque résultat est un **brouillon** : relire et approuver avant envoi AgentMail.
- Sans `INSFORGE_AI_DRAFT_FUNCTION`, seul un modèle déterministe local est utilisé.

**Note architecture** : le worker tourne actuellement dans le processus FastAPI,
ce qui convient au DEV mono-instance. En production, le séparer et gérer les
verrous PostgreSQL et la reprise des tâches de manière robuste.

## 5. Limites & non-objectifs

- Pas d'accès aux vraies clés InsForge, AgentMail ou Cal.com fourni ; test mocks uniquement.
- Pas d'utilisation de l'OpenAI Ads Pixel tant que CMP/consentement non finalisés.
- Pas de moteur universel no-code, de paiement, ni de vidéo VSL source.
- Le tunnel APP 7 et les autres modules existants restent dans le même projet Docker.
