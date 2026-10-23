# Anno 117 Planner — Plan de développement par lots

**Version :** 1.0  
**Date :** 23 octobre 2026  
**Statut :** Plan validé — réalisation progressive  
**Branche d’intégration :** `develop`  
**Technologies cibles :** Electron, React, TypeScript, Vite, pnpm, Vitest

---

## 1. Objectif

Le développement d’Anno 117 Planner est organisé en lots techniques et fonctionnels indépendants. Chaque lot doit apporter une évolution cohérente, testable et intégrable sans compromettre les fonctionnalités déjà validées.

Le développement suit un cycle Git identique pour tous les lots :

1. Partir d’une branche `develop` à jour.
2. Créer une branche `feature/*` dédiée au lot.
3. Réaliser uniquement les évolutions prévues dans le périmètre du lot.
4. Ajouter ou adapter les tests et la documentation.
5. Vérifier les critères de sortie du lot.
6. Effectuer une revue des modifications.
7. Merger la branche de fonctionnalité dans `develop`.
8. Vérifier que `develop` reste fonctionnelle.
9. Créer la branche du lot suivant depuis `develop` à jour.

Les lots ne doivent pas être fusionnés entre eux avant leur intégration dans `develop`. Chaque branche doit rester suffisamment limitée pour permettre une revue et un diagnostic simples.

## 2. Principes de développement

### 2.1. Préserver le périmètre fonctionnel

L’expression de besoin existante reste la référence fonctionnelle. Toute évolution de périmètre doit être explicitement décidée et documentée.

### 2.2. Privilégier les évolutions incrémentales

Les modifications doivent être limitées aux fichiers et composants nécessaires. Une refonte générale n’est pas justifiée lorsqu’une correction ciblée suffit.

### 2.3. Séparer métier et interface

Le moteur de calcul doit rester indépendant d’Electron, de React et de toute technologie d’interface.

- `packages/core` : règles métier et calculs.
- `packages/product` : cas d’usage et orchestration.
- `packages/game-data` : catalogue et données du jeu.
- `apps/desktop` : application de bureau et interface utilisateur.

### 2.4. Tester avant d’intégrer

Les tests existants doivent être conservés et enrichis. Aucun lot ne doit être déclaré validé si les vérifications prévues n’ont pas réellement été exécutées.

Les résultats de tests doivent être documentés avec les commandes utilisées et les éventuelles limitations de l’environnement.

### 2.5. Sécurité et propriété intellectuelle

Le code et la documentation restent soumis aux conditions de propriété intellectuelle du projet. Les données externes et dépendances doivent respecter leurs licences et conditions d’utilisation.

---

## 3. Vue d’ensemble des lots

| Lot | Branche cible | Objectif |
|---|---|---|
| 1 | `feature/core-stabilization-gpt` | Stabiliser le moteur et son API publique |
| 2 | `feature/desktop-electron-gpt` | Créer le socle Electron + React + Vite |
| 3 | `feature/product-use-cases-gpt` | Introduire les cas d’usage et relier le moteur |
| 4 | `feature/game-data-catalog-gpt` | Structurer et valider le catalogue du jeu |
| 5 | `feature/planner-ui-gpt` | Réaliser la première interface de planification |
| 6 | `feature/ui-foundations-gpt` | Ajouter internationalisation et thèmes |
| 7 | `feature/scenario-persistence-gpt` | Ajouter sauvegarde et export des scénarios |
| 8 | `feature/multi-island-planning-gpt` | Étendre la planification à plusieurs îles |

Les noms sont des propositions de référence. Ils peuvent être ajustés avant la création des branches, mais doivent ensuite rester cohérents avec le dépôt.

---

## 4. Détail des lots

### Lot 1 — Stabilisation du moteur métier

**Branche :** `feature/core-stabilization-gpt`

**Objectif :** rendre le moteur de calcul plus robuste, explicite et testable avant de construire l’application autour de lui.

#### Périmètre

- Définir les exports publics de `packages/core/src/index.ts`.
- Examiner les contrats des fonctions et types existants.
- Ajouter la validation des entrées : valeurs finies, taux, productivité, quantités et bâtiments existants.
- Définir les erreurs et comportements attendus pour les entrées invalides.
- Compléter les tests unitaires pour les cas limites et les erreurs.
- Vérifier la propagation des besoins, le calcul des bâtiments et les déficits.
- Vérifier le comportement relatif aux cycles de production.
- Clarifier la documentation du moteur et les commandes de test.

#### Hors périmètre

- Réécriture générale du moteur.
- Interface utilisateur.
- Catalogue exhaustif du jeu.
- Implémentation complète de plusieurs producteurs pour un même bien sans règles métier préalablement définies.
- Planification multi-îles.

#### Critères de sortie

- L’API publique est définie et utilisable.
- Les entrées invalides sont traitées explicitement.
- Les tests couvrent les comportements attendus et les principaux cas limites.
- Les règles métier existantes ne sont pas modifiées involontairement.
- Les tests et le contrôle TypeScript passent dans l’environnement de développement.
- La documentation décrit les limites qui restent ouvertes.

---

### Lot 2 — Socle de l’application Electron

**Branche :** `feature/desktop-electron-gpt`

**Objectif :** disposer d’une application de bureau minimale et fonctionnelle.

#### Périmètre

- Créer `apps/desktop`.
- Configurer Electron, React, TypeScript et Vite.
- Définir le processus principal Electron et le processus de rendu.
- Configurer un point d’entrée de développement utilisable depuis la racine du monorepo.
- Mettre en place une communication minimale et sécurisée entre le processus principal et le rendu, uniquement si nécessaire.
- Désactiver l’accès Node.js direct au rendu et privilégier `contextIsolation` et une API de préchargement limitée.
- Documenter les commandes de démarrage et de construction.

#### Hors périmètre

- Fonctionnalités métier complètes.
- Catalogue du jeu.
- Persistance des scénarios.
- Packaging et publication avancés.

#### Critères de sortie

- L’application démarre sous Windows.
- La fenêtre Electron affiche l’interface React.
- Le rechargement en développement fonctionne.
- La configuration de sécurité Electron est explicite.
- Les scripts du monorepo fonctionnent sans perturber `packages/core`.

---

### Lot 3 — Cas d’usage et intégration du moteur

**Branche :** `feature/product-use-cases-gpt`

**Objectif :** introduire une couche applicative qui orchestre les calculs métier.

#### Périmètre

- Créer `packages/product`.
- Définir un premier cas d’usage de simulation de production.
- Préparer les paramètres nécessaires à l’appel du moteur.
- Structurer les résultats : besoins, bâtiments théoriques, bâtiments existants et déficits.
- Utiliser des données de test simples et explicites.
- Ajouter des tests unitaires aux cas d’usage.
- Définir une frontière claire entre interface, orchestration et calcul métier.

#### Hors périmètre

- Interface complète.
- Catalogue exhaustif.
- Persistance.
- Gestion complète des scénarios multi-îles.

#### Critères de sortie

- Un cas d’usage peut être exécuté sans dépendance à Electron ou React.
- Les résultats du moteur sont correctement transformés en résultats applicatifs.
- Les tests valident l’orchestration et les erreurs attendues.
- Aucune logique de calcul métier n’est dupliquée dans `packages/product`.

---

### Lot 4 — Catalogue des données du jeu

**Branche :** `feature/game-data-catalog-gpt`

**Objectif :** séparer les données de production du code et préparer leur enrichissement progressif.

#### Périmètre

- Créer `packages/game-data`.
- Définir les structures de données pour les biens, bâtiments, recettes et taux de production.
- Introduire un premier jeu de données réduit, cohérent et vérifiable.
- Ajouter des validations de cohérence des données.
- Définir comment les données sont chargées et transmises aux cas d’usage.
- Documenter les unités, les sources et les hypothèses retenues.

#### Hors périmètre

- Collecte exhaustive de toutes les données du jeu.
- Import automatisé de données externes sans source et méthode validées.
- Logique de calcul directement intégrée au catalogue.

#### Critères de sortie

- Le catalogue est indépendant du moteur.
- Les données sont structurées et validables.
- Les données de test ne sont pas confondues avec les données présentées comme vérifiées.
- Un cas d’usage peut utiliser le catalogue sans dépendre de l’interface.

---

### Lot 5 — Première interface de planification

**Branche :** `feature/planner-ui-gpt`

**Objectif :** permettre une première utilisation réelle de l’application, de la saisie jusqu’aux résultats.

#### Périmètre

- Construire un écran de planification simple.
- Permettre la sélection des besoins et la saisie des paramètres nécessaires.
- Appeler les cas d’usage applicatifs.
- Afficher les besoins calculés, les bâtiments requis et les déficits.
- Présenter les erreurs de saisie et les erreurs métier de manière compréhensible.
- Ajouter des tests aux composants ou flux lorsque cela apporte une couverture utile.

#### Hors périmètre

- Interface graphique définitive.
- Toutes les fonctionnalités de confort.
- Planification multi-îles.
- Système complet de sauvegarde.

#### Critères de sortie

- Un scénario simple peut être préparé dans l’interface.
- Les résultats affichés correspondent aux résultats applicatifs.
- Les erreurs sont visibles et ne provoquent pas de plantage non maîtrisé.
- Le moteur reste indépendant de React.

---

### Lot 6 — Fondations de l’interface : langues et thèmes

**Branche :** `feature/ui-foundations-gpt`

**Objectif :** rendre l’interface cohérente et préparer son utilisation dans les langues prévues.

#### Périmètre

- Mettre en place l’internationalisation français/anglais.
- Centraliser les libellés et messages.
- Ajouter les thèmes clair et sombre.
- Définir les règles de persistance des préférences uniquement si nécessaire.
- Vérifier la lisibilité des résultats, messages d’erreur et formulaires dans les deux thèmes.

#### Critères de sortie

- Les libellés de l’interface sont traduisibles sans modifier la logique métier.
- Le changement de langue fonctionne.
- Les thèmes clair et sombre sont cohérents.
- Aucun texte fonctionnel important n’est laissé involontairement dans une seule langue.

---

### Lot 7 — Sauvegarde et export des scénarios

**Branche :** `feature/scenario-persistence-gpt`

**Objectif :** permettre à l’utilisateur de conserver et de réutiliser son travail.

#### Périmètre

- Définir le format de scénario.
- Enregistrer et recharger un scénario.
- Valider les données chargées.
- Gérer les erreurs de lecture et d’écriture.
- Définir une stratégie de versionnement du format si nécessaire.
- Étudier l’export des résultats dans un format adapté au besoin.

#### Critères de sortie

- Un scénario sauvegardé peut être rechargé sans perte des paramètres pris en charge.
- Les fichiers invalides sont rejetés avec un message explicite.
- Le format est documenté.
- Les tests couvrent les opérations principales et les erreurs.

---

### Lot 8 — Planification multi-îles

**Branche :** `feature/multi-island-planning-gpt`

**Objectif :** étendre la planification en tenant compte des ressources et productions réparties entre plusieurs îles.

#### Périmètre

- Formaliser le modèle d’une île et d’un scénario multi-îles.
- Définir l’affectation des bâtiments et des productions aux îles.
- Définir les règles de disponibilité et de transfert des biens.
- Distinguer les déficits locaux des déficits globaux.
- Étendre les cas d’usage et l’interface en conséquence.
- Ajouter des tests sur les flux inter-îles et les cas limites.

#### Critères de sortie

- Les règles de répartition et de transfert sont documentées.
- Les calculs distinguent correctement besoins locaux et besoins globaux.
- Les tests démontrent que les transferts ne créent pas artificiellement de ressources.
- Les scénarios mono-île existants restent valides.

Ce lot nécessitera une conception fonctionnelle spécifique avant le développement. Il ne doit pas être anticipé par une complexification prématurée du moteur.

---

## 5. Processus Git standard pour chaque lot

### 5.1. Préparation

Avant de créer une branche :

- Vérifier que le répertoire de travail est propre ou identifier précisément les modifications en cours.
- Vérifier la branche courante.
- Vérifier l’état de `develop` et récupérer ses dernières modifications.
- Identifier les commits locaux qui doivent être conservés.

Aucune modification non commitée ne doit être écrasée ou perdue.

### 5.2. Création de la branche

Créer une branche dédiée à partir de `develop` à jour, avec le nom défini pour le lot.

Exemple pour le lot 1 :

```bash
git status
git switch develop
git pull --ff-only
git switch -c feature/core-stabilization-gpt
```

Ces commandes supposent que le travail en cours est sauvegardé et que le dépôt distant utilise `origin`.

Si `develop` n’existe pas encore sur le dépôt distant, sa création et sa publication doivent être réalisées explicitement avant de poursuivre.

### 5.3. Développement et commits

- Limiter les modifications au périmètre du lot.
- Faire des commits cohérents et compréhensibles.
- Éviter les modifications de formatage massives non nécessaires.
- Ajouter les tests en même temps que les évolutions.
- Mettre à jour la documentation concernée.
- Ne pas modifier une règle métier ambiguë sans décision explicite.

### 5.4. Validation avant merge

Exécuter les contrôles pertinents pour le lot :

- tests unitaires ;
- contrôle TypeScript ;
- lint ;
- formatage ;
- construction de l’application si elle existe et si le lot la concerne.

Les commandes exactes doivent être celles réellement configurées dans le dépôt. Un contrôle non exécuté doit être indiqué comme tel, jamais présenté comme réussi.

### 5.5. Merge vers `develop`

Le merge est autorisé lorsque :

- les critères de sortie du lot sont satisfaits ;
- les tests concernés passent ;
- les changements ont été relus ;
- aucune régression connue ne subsiste ;
- la documentation est à jour.

Le mode de merge — merge commit ou squash — doit suivre la convention retenue pour le dépôt. Éviter de mélanger plusieurs stratégies sans raison.

### 5.6. Après le merge

- Vérifier que `develop` contient les changements attendus.
- Exécuter les contrôles d’intégration disponibles.
- Supprimer la branche de fonctionnalité après confirmation du merge, si la politique du dépôt le prévoit.
- Créer la branche suivante depuis `develop` à jour.

---

## 6. Règles de gestion des dépendances entre lots

Les lots doivent suivre l’ordre défini dans ce document, sauf décision explicite.

Si une dépendance technique ou fonctionnelle impose une modification du plan :

1. Identifier le blocage.
2. Déterminer le lot auquel appartient réellement la modification.
3. Éviter d’introduire une fonctionnalité complète dans la branche d’un autre lot.
4. Si un prérequis manque, l’intégrer dans un lot dédié ou mettre à jour le plan.
5. Documenter la décision et son impact sur les branches.

Un lot peut nécessiter plusieurs petits commits, mais il ne doit pas devenir un regroupement de sujets sans lien.

---

## 7. Documentation et traçabilité

Chaque lot doit mettre à jour la documentation affectée par ses changements.

Les documents de référence sont notamment :

- `documents/EXPRESSION_DE_BESOIN.md` : référence fonctionnelle ;
- `documents/PLAN_DE_DEVELOPPEMENT.md` : séquencement des lots ;
- les documents d’architecture et de décisions techniques, à compléter au fil du projet ;
- le README et la documentation de développement.

Les décisions structurantes — règles de calcul, modèle de données, sécurité Electron, persistance — doivent être documentées lorsqu’elles sont prises.

---

## 8. Règle de clôture d’un lot

Un lot est considéré comme terminé uniquement lorsque :

1. Son périmètre est respecté.
2. Ses critères de sortie sont satisfaits.
3. Les tests et contrôles prévus ont été exécutés.
4. La documentation nécessaire est à jour.
5. Les modifications ont été revues.
6. Le merge vers `develop` est terminé.
7. `develop` est dans un état vérifié.

**Le merge ne remplace pas la validation.** Il constitue l’intégration d’un lot qui a déjà satisfait ses critères de sortie.

---

## 9. Première action à réaliser

Le premier lot à ouvrir est `feature/core-stabilization-gpt`.

Avant sa création, vérifier l’état réel de `feature/production-calculator-gpt` et de `develop`. Le travail déjà présent doit être conservé et son rattachement clarifié avant toute opération de branchement.

La première livraison doit rester limitée à la stabilisation du moteur métier et à son API publique. La création de l’application Electron ne commencera qu’après validation et intégration de ce premier lot.
