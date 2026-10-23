# Studio Modular Architecture (Plan B)

Ce dossier contient les modules découpés et maintenables de l'application Studio (`studio.js`).

## Structure des Modules

- `icons.js` : Dictionnaire des icônes SVG institutionnelles sans emojis.
- `core.js` : Initialisation, gestion de l'état réactif `S`, routeur `go()`, gestionnaire SSE `live`, helpers API `api()`, toasts et gabarit structurel (`shell`, `head`, `sidebar`, `nav`).
- `pages_overview.js` : Vue d'ensemble, métriques KPI, graphiques d'activité sur 14 jours et entonnoir.
- `pages_funnels.js` : Liste et gestion des tunnels (duplication, suppression, édition).
- `pages_builder.js` : Constructeur visuel APP 7 (Capture, VSL, Projet, Booking Cal.com, Merci, Programme 7 jours, RGPD).
- `pages_contacts.js` : CRM centralisé des prospects avec segmentation et statuts.
- `pages_bookings.js` : Calendrier des rendez-vous et intégration directe Cal.com.
- `pages_whatsapp.js` : Cockpit souverain WhatsApp Live (jumelage QR Baileys, fil de discussion, gestion des groupes officiels).
- `pages_inbox.js` : Messagerie et suivi des brouillons d'emails.
- `pages_automations.js` : Workflows automatisés et déclencheurs intelligents.
- `pages_analytics.js` : Rapports détaillés, tracking d'acquisition et attribution.
- `pages_integrations.js` : Connecteurs Cal.com, Pixel Ads, médias privés et files d'attente d'alertes.
- `pages_team.js` : Espaces de travail multi-tenants et passerelle agents IA (MCP).
- `pages_settings.js` : Paramètres de profil, sécurité InsForge, préférences de notifications.
- `pages_docs.js` : Académie de conversion, guides d'installation et didacticiels pas à pas.
- `modals.js` : Boîtes de dialogue (création de groupes WhatsApp, nouveau chat, jetons MCP, confirmation de déconnexion sécurisée).
- `events.js` : Écouteurs globaux d'événements (soumissions de formulaires, clics d'actions, inputs réactifs).

## Build Pipeline

Pour compiler et vérifier l'ensemble sans dépendance externe :
```bash
python3 web/assets/studio/build.py
node --check web/assets/studio.js
```
