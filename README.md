# Anno 117 Planner

Planificateur de production et de gestion des ressources pour **Anno 117: Pax Romana**.

## Présentation

Anno 117 Planner est un projet personnel visant à faciliter la planification des chaînes de production, l'optimisation des ressources et la gestion de plusieurs îles dans Anno 117: Pax Romana.

L'objectif est de développer une application de bureau permettant notamment de :

- Calculer les besoins en marchandises à partir de la population.
- Déterminer les capacités de production nécessaires.
- Analyser les chaînes de production et les éventuels déficits.
- Planifier la production et les transferts de ressources entre plusieurs îles.
- Comparer différents scénarios d'organisation et de développement.

Ces fonctionnalités constituent les objectifs du projet. Leur disponibilité dépendra de l'avancement du développement.

## Technologies

Le projet s'appuie sur les technologies suivantes :

- **TypeScript** pour le typage et la maintenabilité du code.
- **React** pour l'interface utilisateur.
- **Electron** pour l'application de bureau.
- **pnpm workspaces** pour l'organisation du monorepo.
- **Vitest** pour les tests unitaires.

## Architecture

Le dépôt est organisé autour d'un monorepo destiné à accueillir les composants suivants :

- `packages/core` : moteur métier indépendant de l'interface, calculs de production et règles de gestion.
- `packages/product` : logique applicative et orchestration des fonctionnalités.
- `packages/game-data` : catalogue des marchandises, bâtiments et recettes de production.
- `apps/desktop` : application de bureau basée sur React et Electron.

L'architecture cible sera mise en place progressivement. Tous les modules et fonctionnalités décrits ne sont pas nécessairement présents dans l'état actuel du dépôt.

## Objectifs techniques

Le développement vise les caractéristiques suivantes :

- Application de bureau compatible avec Windows.
- Planification multi-îles.
- Séparation entre moteur métier, données du jeu et interface.
- Tests automatisés.
- Interface en français et en anglais.
- Thèmes clair et sombre.
- Architecture modulaire et évolutive.

## Développement

Le projet est actuellement à un stade préliminaire.

Les instructions d'installation, de lancement et de test seront documentées au fur et à mesure de la mise en place de l'application et de ses scripts de développement.

## Licence et droits d'utilisation

**Tous droits réservés.**

Ce dépôt est un projet propriétaire. Aucun droit de copie, de redistribution, de modification, de réutilisation ou d'exploitation de son contenu n'est accordé sans autorisation préalable et écrite du titulaire des droits, sous réserve des dispositions légales applicables.

Consultez [`LICENCE.md`](LICENCE.md) pour les conditions détaillées.

## Marques et propriété intellectuelle de tiers

Anno 117: Pax Romana et les marques associées appartiennent à leurs titulaires respectifs. Ce projet est indépendant et n'est ni affilié à Ubisoft ni officiellement approuvé par Ubisoft.
