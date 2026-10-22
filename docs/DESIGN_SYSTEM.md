# NÜM Funnel OS — Design System unifié v0.3

Le style de **Acquisition & Pixels** devient la direction **canonique de l’ensemble du dashboard SaaS**.

## Direction visuelle

- Palette : fond gris chaud `#F3F3F1`, panneaux blancs `#FFFFFF`, encre `#232426`, texte secondaire `#92949A`, orange corail d’action `#F1653B`.
- Sidebar grise lumineuse avec nav active blanche, pictogramme corail et marque noire.
- Topbar très claire, KPIs blancs et compacts, panneaux arrondis de 19–20 px, fines bordures neutres.
- Courbes corail, accents limités, grandes zones de respiration, champs et CTA sous forme de pilules.
- Tous les modules SaaS : Vue d’ensemble, Mes tunnels, Modèles, Builder, CRM, Inbox, Agents IA, Calendrier, Automatisations, Analyses, Acquisition & Pixels, Intégrations.
- Le **tunnel public conserve son identité propre**, afin que chaque client puisse publier une marque indépendante du back-office.

## Conception technique

Il s’agit d’un **prototype HTML/CSS/JS local**, aucun backend ni pixel réel. Les données, contacts et réservations du parcours sont simulés et enregistrés dans localStorage. CSS unifié à la fin de `styles.css` avec préfixe *UNIFIED DESIGN SYSTEM* ; conserver ce bloc comme base de tokens pour la migration React/Tailwind.

## Contrôles

- Navigation inter-modules, création/édition/aperçu de tunnel, contacts, réservations, événements de tracking testés localement.
- Aucun identifiant, secret, événement Pixel/CAPI envoyé à un fournisseur tiers.
