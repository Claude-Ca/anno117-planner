# Anno 117 Planner

Planificateur de production et de gestion des ressources pour **Anno 117: Pax Romana**.

## Présentation

Anno 117 Planner est un projet personnel visant à aider le joueur à comprendre ses besoins en ressources, dimensionner ses moyens de production et préparer l'organisation de ses îles.

Le projet vise notamment à :

- calculer les besoins en marchandises à partir de la population ;
- déterminer les capacités de production nécessaires ;
- analyser les chaînes de production et les éventuels déficits ;
- préparer la planification à l'échelle de plusieurs îles.

**Périmètre initial :** jeu de base, régions Latium et Albion. Le moteur de calcul initial raisonne localement, île par île ; il ne simule pas automatiquement la colonisation, le commerce ni les importations. Le joueur conserve la maîtrise de sa stratégie inter-îles. Les fonctionnalités décrites sont des objectifs de projet et ne sont pas nécessairement toutes implémentées.

## Technologies et architecture cible

Le projet s'appuie sur :

- **TypeScript** pour le typage et la maintenabilité ;
- **React** pour l'interface utilisateur ;
- **Electron** pour l'application de bureau ;
- **pnpm workspaces** pour l'organisation du monorepo ;
- **Vitest** pour les tests automatisés.

L'architecture cible sépare le moteur métier, la logique applicative, les données du jeu et l'application desktop :

- `packages/core` — moteur métier indépendant de l'interface ;
- `packages/product` — logique applicative et orchestration ;
- `packages/game-data` — catalogue des marchandises, bâtiments et recettes ;
- `apps/desktop` — application de bureau React/Electron.

Cette architecture est une cible évolutive : consulter le dépôt et le [plan de développement](docs/30-plans/plan-de-developpement.md) pour distinguer les éléments prévus de ceux effectivement présents.

## Documentation

La documentation est structurée par domaine et soumise à une politique documentaire commune.

| Domaine | Documentation |
|---|---|
| Gouvernance | [Décisions, règles et revues](docs/00-gouvernance/README.md) |
| Fonctionnel | [Expression du besoin et spécifications](docs/10-fonctionnel/README.md) |
| Technique | [Architecture, contrats et données](docs/20-technique/README.md) |
| Plans | [Plan de développement et pilotage](docs/30-plans/README.md) |
| Manuel | [Installation et guides](docs/40-manuel/README.md) |

Commencer par le [sommaire documentaire](docs/README.md) et la [politique documentaire](docs/00-gouvernance/politique-documentaire.md).

## Développement

Les procédures d'installation et de démarrage sont disponibles dans [la documentation développeur](docs/40-manuel/README.md). Les scripts et commandes doivent être vérifiés dans l'état courant du dépôt avant utilisation.

## Licence et droits d'utilisation

**Tous droits réservés.**

Ce dépôt est un projet propriétaire. Aucun droit de copie, de redistribution, de modification, de réutilisation ou d'exploitation de son contenu n'est accordé sans autorisation préalable et écrite du titulaire des droits, sous réserve des dispositions légales applicables.

Consultez [LICENCE.md](LICENCE.md) pour les conditions détaillées.

## Marques et propriété intellectuelle de tiers

Anno 117: Pax Romana et les marques associées appartiennent à leurs titulaires respectifs. Ce projet est indépendant et n'est ni affilié à Ubisoft ni officiellement approuvé par Ubisoft.
