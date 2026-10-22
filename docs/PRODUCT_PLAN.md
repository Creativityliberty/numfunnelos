# NÜM Funnel OS — état produit, backlog et critères de lancement

## 1. Ce qui est développé dans cette livraison

La présente arborescence constitue une **première application SaaS locale persistante**. Elle ne doit pas être confondue avec les anciens prototypes HTML statiques APP 7 et Studio v0.3. Les données métier sont désormais servies par une API et stockées dans PostgreSQL lorsque le projet est démarré avec Docker.

**Opérationnel :** sessions utilisateurs, inscription/connexion, workspace, isolation multi-tenant, création de tunnels, copie du template APP 7, édition de textes et couleurs, version immuable publiée, dépublication, formulaires publics, enregistrement des prospects, consentements indépendants, dépôt d'idée APP 7, CRM, calendrier interne sans double réservation, export ICS, historique événementiel, courbes, brouillons email et scénario de préparation de brouillon après inscription.

**Connecteurs préparés :** AgentMail (stockage chiffré de clés par workspace, envoi sur action humaine, endpoint webhook avec vérification de signature) et Cal.com (lien de réservation externe). **Non configurés tant que les identifiants externes ne sont pas fournis.** Le Pixel OpenAI peut être référencé, mais il reste volontairement inactif : aucune requête Ads ni CAPI n'est émise.

## 2. Différence assumée avec le blueprint initial

La cible stratégique demeure React/TypeScript + Laravel + PostgreSQL + Redis avec workflows durables. Pour pouvoir fournir ici une **tranche verticale vérifiée**, le code exécutable repose actuellement sur FastAPI/SQLAlchemy + JavaScript natif + PostgreSQL Docker. Les contrats HTTP et le template JSON permettent une migration ultérieure, mais cette migration **n'est pas livrée**.

## 3. Priorités de développement — dans l'ordre

### M2 — Durcissement de la plateforme
- Migrations Alembic ou équivalent, sauvegardes et reprise après incident.
- Limitation de débit distribuée, audit des dépendances, export/suppression des données personnelles et rétention des consentements.
- Invitation des collaborateurs avec RBAC détaillé ; réinitialisation du mot de passe ; emails transactionnels réels.
- Pipeline CI : tests API PostgreSQL, tests navigateur sur les vraies pages HTTP, lint, contrôle responsive et accessibilité.

### M3 — Éditeur visuel généraliste
- Bibliothèque de blocs typés, gestion de pages et d'étapes, réorganisation drag-and-drop, propriétés conditionnelles, responsive preview.
- Validation JSON des templates, historique de versions, import/export, prévisualisation du brouillon privée.
- Séparation des composants publics et des widgets du Studio. APP 7 reste le template de référence.

### M4 — Communication & réservation
- Connexion AgentMail vérifiée avec véritables comptes, webhooks idempotents, boîtes et conversations, templates, délivrabilité et opt-out.
- Intégration réelle Cal.com : disponibilité, fuseaux, webhooks signés, annulations et reprogrammation. Calendrier interne utilisé jusqu'à cette étape.
- Automations via file de tâches/queue avec retries, idempotence, journal et validation humaine pour les actions sensibles.

### M5 — Offre et facturation
- Catalogue d'offres, panier/checkout, Stripe ou autre prestataire, paiements webhooks signés, remboursements et reçus.
- Abonnement SaaS (tenant, forfaits, quotas, limites et usage) **séparé** des paiements réalisés dans les funnels.
- Aucun montant de revenu ne doit être dérivé des seuls statuts CRM.

### M6 — Acquisition & Pixels
- Consent Management Platform adaptée à chaque domaine/tunnel, journal de consentement et révocation.
- Destinations publicitaires par workspace : OpenAI Ads, puis Meta et Google selon les API effectivement accessibles.
- Événements serveur vérifiés, `event_id` idempotent, `oppref`/`obref` lorsque légitimes, UTM, Outbox, réessais, déduplication Pixel/CAPI et tests de non-envoi sans consentement.
- L'optimisation Ads et les métriques de dépenses n'apparaissent que lorsque des données externes réelles ont été connectées.

### M7 — Commercialisation et exploitation
- Domaines personnalisés, DNS/TLS, vérification des domaines, SEO, bandeaux légaux, gestion des erreurs, monitoring et alerting.
- Onboarding, facturation tenant, organisation des paramètres, partage de templates, gestion des permissions.
- Conditions de vente, documentation d'hébergement et dossier RGPD prêt pour exploitation en France/UE.

## 4. Démonstration APP 7 utilisée comme preuve de bout en bout

```text
Signup SaaS + création de workspace
  -> APP 7 créé en brouillon
  -> édition du texte et de la couleur
  -> Publication immuable
  -> Page /f/{slug} accessible
  -> Prénom/email -> consentements séparés
  -> Formation 11 chapitres
  -> Projet décrit -> CRM qualifié
  -> (option) choix d'un créneau -> booking SQL
  -> Analytics internes + journal d'événements
  -> Préparation brouillon de bienvenue si consentement marketing
```

Ce parcours est une **prise d'intérêt**, non une vente ou une inscription payante. Ni le prix du programme, ni la vidéo finale de Lionel, ni le prestataire de paiement n'ont été fournis. Ne pas inventer de témoignages, transactions ou garanties de revenus.

## 5. Critères de passage en production

Tous les points suivants devront être démontrés sur l'environnement cible avant une ouverture publique : migrations reproductibles, backups restaurés, emails réellement testés, authentification renforcée, protections antispam, permissions et isolation multi-tenant testées sur PostgreSQL, tests E2E navigateur + accessibilité, politiques RGPD, TLS, webhooks vérifiés et dédupliqués, suivi du consentement, supervision et journal d'audit. Docker compose local ne constitue pas à lui seul une preuve d'aptitude à la production.
