# Manuel Officiel de Référence — API REST & Protocole MCP Nüptin Funnel OS

Ce document constitue la référence exhaustive de l'API HTTP et du protocole MCP (Model Context Protocol) de **Nüptin Funnel OS v1.3**.

---

## 1. Principes d'Architecture & Sécurité

### A. Authentification & Scopes
Toutes les requêtes adressées à l'API agent nécessitent un jeton d'accès au format Bearer dans le header HTTP `Authorization` :
```http
Authorization: Bearer num_mcp_<64_caracteres_hexadecimaux>
```

Les jetons disposent de scopes stricts et cumulatifs :
- `funnels:read` : Consultation des tunnels et des versions en lecture seule.
- `funnels:write` : Création et modification de brouillons de tunnels.
- `funnels:publish` : Publication officielle et mise en ligne en production.

### B. Isolation Multi-Tenant
Chaque ressource métier appartient strictement à un `workspace_id`. Aucun accès cross-tenant n'est possible.

---

## 2. Référence des Outils MCP (Model Context Protocol)

Le serveur MCP local (`server/mcp_server.py`) expose des fonctions typées aux agents IA :

### `list_funnels()`
- **Description** : Liste tous les tunnels rattachés au workspace autorisé.
- **Paramètres** : Aucun.
- **Retour** : `list[dict]` (ID, nom, slug, statut, versions).

### `get_funnel(funnel_id: str)`
- **Description** : Récupère le détail complet d'un tunnel, y compris son arborescence JSON `draft`.
- **Paramètres** : `funnel_id` (Identifiant UUID du tunnel).
- **Retour** : `dict` complet du tunnel.

### `create_optin(name: str, template: str = "app7")`
- **Description** : Initialise un nouveau tunnel à partir d'un modèle prédéfini (`app7` ou `ebook1`).
- **Paramètres** :
  - `name` : Nom du tunnel (2 à 150 caractères).
  - `template` : `"app7"` (High-Ticket 4 étapes) ou `"ebook1"` (Ebook 2 étapes).
- **Retour** : `dict` du tunnel créé avec son identifiant et son slug unique.

### `update_funnel_content(funnel_id: str, title: str = "", subtitle: str = "", accent_color: str = "")`
- **Description** : Modifie de façon ciblée les textes d'accroche et la couleur d'accentuation sans altérer la logique du tunnel.
- **Paramètres** :
  - `funnel_id` : UUID du tunnel.
  - `title` : Titre principal (max 200 caractères).
  - `subtitle` : Sous-titre ou promesse (max 1000 caractères).
  - `accent_color` : Couleur hexadécimale `#RRGGBB`.
- **Retour** : `dict` du tunnel mis à jour.

### `update_funnel_draft(funnel_id: str, draft: dict)`
- **Description** : Met à jour l'intégralité du document JSON `draft` (étapes, formulaires, copy, intégrations Cal.com, WhatsApp).
- **Paramètres** :
  - `funnel_id` : UUID du tunnel.
  - `draft` : Objet JSON valide respectant le schéma du template.

### `publish_funnel(funnel_id: str)`
- **Description** : Crée un instantané immuable (`FunnelVersion`), incrémente le numéro de version et active l'URL publique `/f/{slug}`.
- **Paramètres** : `funnel_id` (UUID du tunnel).
- **Prérequis** : Scope `funnels:publish`.
- **Retour** : `{"url": "/f/{slug}", "version": X}`.

---

## 3. Endpoints de l'API REST Développeur

### Tunnels de Conversion
- `GET /api/agent/funnels` : Liste les tunnels du workspace.
- `GET /api/agent/funnels/{id}` : Détails d'un tunnel spécifique.
- `POST /api/agent/funnels` : Création d'un tunnel (`{"name": "...", "template": "app7"|"ebook1"}`).
- `PATCH /api/agent/funnels/{id}` : Mise à jour du nom ou du draft JSON.
- `POST /api/agent/funnels/{id}/publish` : Publication officielle du tunnel.

### Expérience Publique & Capture
- `GET /api/public/f/{slug}` : Données publiques de la version active d'un tunnel.
- `POST /api/public/capture` : Enregistrement d'un nouveau prospect (nom, email, téléphone, optin RGPD, UTMs).
- `POST /api/public/qualify` : Enregistrement de la candidature et qualification (étape 3).
- `POST /api/public/book` : Prise de rendez-vous confirmée (étape 4).
- `POST /api/public/beta-apply` : Candidature au programme bêta-testeur Nüptin.

### CRM & Contacts
- `GET /api/crm/contacts` : Liste paginée des prospects qualifiés avec recherche et filtres.
- `PATCH /api/crm/contacts/{id}` : Mise à jour du statut du lead (`new`, `contacted`, `call_scheduled`, `closed_won`, `closed_lost`).

### Rendez-vous & Calendrier
- `GET /api/integrations/cal/slots` : Récupération des créneaux de consultation disponibles (intégration Cal.com).
