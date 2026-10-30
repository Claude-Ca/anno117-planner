# Anno 117 Planner — Expression de besoin

- **Version :** 1.0 initiale
- **Statut :** Base de référence à valider
- **Date :** 23 octobre 2026
- **Projet :** Anno 117 Planner
- **Langue :** Français

## 1. Objet et finalité du projet

Anno 117 Planner est une application de bureau destinée à aider le joueur d’**Anno 117: Pax Romana** à planifier, dimensionner et organiser ses chaînes de production.

L’application doit permettre de comprendre les besoins en ressources induits par un objectif de développement, de calculer les moyens de production nécessaires et, à terme, d’organiser les flux de production à l’échelle de plusieurs îles.

Le projet doit être construit progressivement, avec une séparation claire entre les règles métier, les données du jeu et l’interface utilisateur.

Cette expression de besoin constitue le référentiel initial du projet. Elle devra évoluer de façon maîtrisée, en fonction des décisions fonctionnelles, des résultats des tests et des enseignements tirés de l’utilisation de l’application.

## 2. Objectifs fonctionnels

L’application poursuit les objectifs suivants :

1. Calculer les besoins en biens et en ressources nécessaires au développement d’une population ou à la réalisation d’objectifs de production.
2. Décomposer les besoins en remontant les chaînes de production.
3. Déterminer le nombre de bâtiments de production nécessaires pour couvrir les besoins calculés.
4. Prendre en compte les paramètres qui influencent la productivité.
5. Identifier les déficits de production et les besoins qui ne sont pas couverts.
6. Permettre de répartir les besoins et les moyens de production sur plusieurs îles. Cette fonctionnalité fait partie du périmètre fonctionnel de la V1 ; sa réalisation est planifiée dans le lot 8 du plan de développement.
7. Fournir des données de production structurées, maintenables et vérifiables.
8. Offrir une interface de bureau utilisable en français et en anglais, avec un thème clair et un thème sombre.

## 3. Périmètre fonctionnel

### 3.1 Calcul des besoins

L’utilisateur doit pouvoir exprimer un objectif de planification sous une forme qui reste à préciser : besoins en biens, objectif de population, ou combinaison des deux.

L’application calcule les besoins directs associés aux objectifs saisis, selon les règles et les données disponibles.

Les besoins doivent pouvoir être agrégés par bien afin de fournir une vue synthétique des ressources nécessaires.

### 3.2 Calcul des chaînes de production

À partir des besoins en biens finaux, le moteur doit identifier les ressources intermédiaires et les productions amont nécessaires.

Le calcul doit parcourir les chaînes de production définies dans le catalogue du jeu et propager les besoins de manière cohérente.

Les résultats doivent permettre de comprendre quelles productions sont nécessaires pour satisfaire les objectifs initiaux.

### 3.3 Dimensionnement des bâtiments

L’application doit calculer le nombre de bâtiments nécessaires à partir des besoins et des capacités de production définies.

Le dimensionnement doit tenir compte des taux de production et des facteurs de productivité applicables.

Lorsque le calcul aboutit à un nombre fractionnaire de bâtiments alors que les installations sont indivisibles, le résultat doit être arrondi de manière à couvrir le besoin, sous réserve des règles métier qui seront formalisées.

### 3.4 Productivité

Le moteur doit pouvoir intégrer les effets de productivité qui influencent les capacités de production.

Les modalités de calcul, les limites des bonus et malus, ainsi que le cumul de plusieurs effets devront être définis à partir des règles retenues pour le jeu.

### 3.5 Déficits et résultats

L’application doit mettre en évidence les besoins qui ne sont pas couverts par les capacités de production prises en compte.

Les résultats devront distinguer, selon le modèle fonctionnel retenu :
- les besoins calculés ;
- les capacités de production disponibles ou nécessaires ;
- les déficits éventuels ;
- les éventuelles incohérences ou données manquantes.

La présentation détaillée de ces informations sera précisée lors de la conception de l’interface.

### 3.6 Catalogue de données

Les biens, bâtiments, recettes et paramètres de production doivent être décrits dans un catalogue structuré, distinct du moteur de calcul.

Ce catalogue devra pouvoir être complété et corrigé sans nécessiter une réécriture des algorithmes.

Les données utilisées devront être vérifiables. Les valeurs de production et les règles spécifiques au jeu ne seront considérées comme validées qu’après confrontation à des références fiables ou à des tests de référence.

### 3.7 Planification multi-îles

La V1 doit permettre de représenter plusieurs îles et de répartir entre elles les besoins et les moyens de production. Cette fonctionnalité est réalisée dans le lot 8 du plan de développement, après la mise en place des fondations nécessaires.

La modélisation des transferts de ressources, des stocks locaux, des contraintes de transport et des arbitrages de production reste à définir.

Cette fonctionnalité ne doit pas être considérée comme déjà implémentée dans le moteur actuel : elle constitue une exigence produit V1 dont la conception et la réalisation restent à effectuer.

### 3.8 Interface utilisateur

L’application cible un environnement de bureau sous Windows, avec une interface construite à partir de React et Electron.

L’interface devra proposer :
- une utilisation en français et en anglais ;
- un thème clair et un thème sombre ;
- une présentation lisible des besoins, des chaînes de production et des résultats de calcul.

Les écrans détaillés, les mécanismes de sauvegarde et les modalités d’export restent à spécifier.

## 4. Principes de conception

### 4.1 Séparation des responsabilités

Le moteur métier doit être indépendant de l’interface graphique.

Les calculs ne doivent pas dépendre de React ou d’Electron. Ils doivent pouvoir être exécutés et testés de manière autonome.

### 4.2 Architecture modulaire

Le projet vise une architecture organisée autour des responsabilités suivantes :

- `apps/desktop` : application de bureau et interface utilisateur ;
- `packages/core` : types métier et algorithmes de calcul ;
- `packages/product` : cas d’usage et orchestration applicative ;
- `packages/game-data` : catalogue des données de production.

Cette organisation constitue l’architecture cible. L’existence et le niveau d’achèvement de chaque module doivent être vérifiés dans le dépôt.

### 4.3 Évolution progressive

Le projet doit être développé par fonctionnalités cohérentes, avec des modifications incrémentales et testables.

Les fonctionnalités futures ne doivent pas imposer de réécrire le cœur de calcul lorsque leur intégration peut être anticipée raisonnablement.

### 4.4 Déterminisme et testabilité

À entrées, données et paramètres identiques, le moteur doit produire des résultats identiques.

Les règles métier doivent être couvertes par des tests automatisés indépendants de l’interface.

### 4.5 Qualité et maintenabilité

Le projet doit progressivement intégrer :
- des tests automatisés ;
- des contrôles statiques et de qualité du code ;
- une stratégie de validation fonctionnelle ;
- des indicateurs de qualimétrie ;
- une documentation cohérente avec le code livré.

Les seuils de qualité et de couverture seront définis ultérieurement.

## 5. Besoin initial de fiabilisation du moteur

Avant d’étendre significativement l’interface, le moteur de production existant doit être analysé, compris et fiabilisé.

Cette première étape doit notamment permettre de :

1. documenter le comportement actuel du calculateur ;
2. vérifier les règles de propagation des besoins ;
3. vérifier le calcul du nombre de bâtiments ;
4. tester les effets des paramètres de productivité ;
5. identifier les limites du modèle actuel, notamment la gestion éventuelle de plusieurs producteurs pour un même bien ;
6. détecter les entrées incohérentes et les chaînes de production cycliques ;
7. compléter les tests automatisés sur les cas nominaux et les cas limites ;
8. définir une API publique claire pour le package `packages/core`.

Si une implémentation existe, le travail doit commencer par l'auditer et vérifier sa conformité au besoin. En cas de reprise depuis un dépôt vide ou de reconstruction complète, le moteur doit être spécifié puis développé à partir des exigences et critères de ce document ; aucune implémentation antérieure n'est un prérequis.

## 6. Contraintes techniques connues

Les choix techniques exprimés à ce stade sont les suivants :

- langage : TypeScript ;
- interface : React ;
- application de bureau : Electron ;
- organisation du dépôt : monorepo avec pnpm workspaces ;
- tests : Vitest ;
- contrôles de code : ESLint et Prettier ;
- cible principale : Windows.

Les commandes réellement configurées dans le dépôt et la compatibilité effective de l’ensemble devront être vérifiées avant de définir les procédures de développement et de livraison.

## 7. Documentation du projet

Le répertoire `docs/` centralise la documentation de référence.

Il a vocation à accueillir progressivement :

- la présente expression de besoin ;
- la spécification fonctionnelle détaillée ;
- la documentation d’architecture ;
- la stratégie et les rapports de tests ;
- les indicateurs et rapports de qualimétrie ;
- le manuel utilisateur ;
- le manuel développeur ;
- la documentation SCIDL, dont le périmètre exact reste à confirmer ;
- les décisions fonctionnelles et techniques importantes.

La documentation doit rester cohérente avec le logiciel réellement livré. Les résultats des tests peuvent révéler un écart par rapport au besoin, mais ne doivent pas modifier implicitement ce besoin : toute évolution fonctionnelle doit être explicitement décidée et documentée.

## 8. Propriété et diffusion

Le projet est un projet propriétaire, avec une mention « Tous droits réservés ».

Aucune autorisation générale de réutilisation, de reproduction ou de redistribution du code n’est prévue sans accord préalable du titulaire des droits, sous réserve des droits de tiers et des exceptions prévues par la loi.

Le projet est indépendant et n’est pas présenté comme un produit officiel ou affilié à Ubisoft.

Les dépendances tierces devront respecter leurs licences respectives.

## 9. Points restant à arbitrer

Les points suivants ne sont pas encore figés :

1. **Entrées de planification :** besoins en biens, objectifs de population, ou les deux dès la première version.
2. **Périmètre du calcul :** besoins théoriques uniquement ou prise en compte des stocks et bâtiments existants.
3. **Unités et périodes :** unités utilisées pour les besoins et taux de production.
4. **Producteurs multiples :** comportement lorsqu’un même bien peut être fabriqué par plusieurs bâtiments ou recettes.
5. **Gestion des erreurs :** traitement des biens inconnus, données incomplètes, valeurs invalides et cycles.
6. **Multi-îles :** gestion des stocks, transferts, transports et priorités.
7. **Sauvegarde et export :** formats et fonctions attendus.
8. **Catalogue :** sources de référence et procédure de validation des données du jeu.
9. **Distribution :** versions de Windows supportées et modalités de packaging.
10. **Qualimétrie :** outils, indicateurs, seuils et critères de livraison.
11. **SCIDL :** signification exacte, périmètre et contenu attendu du document.
12. **Priorisation :** ordre des fonctionnalités après la fiabilisation du moteur.

Ces arbitrages devront être consignés au fur et à mesure, sans présenter comme acquises des décisions qui n’ont pas encore été prises.

## 10. Critère général de réussite

Anno 117 Planner devra permettre à un joueur de préparer un plan de production compréhensible et cohérent à partir d’objectifs explicites, en s’appuyant sur des données vérifiables et un moteur de calcul testé.

Le produit devra évoluer de façon incrémentale, avec une traçabilité entre le besoin, les règles fonctionnelles, l’implémentation, les tests et la documentation.

---

**Fin de l’expression de besoin — version initiale 1.0**

Ce document est une synthèse des besoins et orientations exprimés à ce jour. Il doit être validé par le propriétaire du projet avant d’être considéré comme une baseline approuvée.
