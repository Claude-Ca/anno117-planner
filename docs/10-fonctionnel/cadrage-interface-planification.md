# Cadrage fonctionnel — première interface de planification

**Version :** 0.2
**Date :** 31 octobre 2026
**Statut :** cadrage initial validé pour le parcours population — décisions complémentaires ouvertes
**Lot :** 5 — première interface de planification
**Branche :** `feature/planner-ui-gpt`

## 1. Objet

Ce document établit le point de départ vérifié du lot 5 et identifie les décisions fonctionnelles et les écarts de contrat qui doivent être traités avant de développer le flux de saisie et de simulation.

Il ne constitue pas une validation du besoin ni une décision implicite sur les règles encore ouvertes. Les propositions servent à préparer l'arbitrage du propriétaire du projet.

## 2. État réel du dépôt sur develop

État contrôlé sur le commit `ee27d0d7df505dd9337e9798cc452f2ba2aead88`.

### 2.1 Interface desktop actuelle

`apps/desktop/src/renderer/src/App.tsx` affiche actuellement un état du catalogue : chargement, validation, métadonnées du manifeste et nombre d'éléments par module. Il ne contient pas encore d'écran de planification, de formulaire de scénario ni de restitution d'un calcul.

### 2.2 Catalogue embarqué

Les fichiers JSON contiennent actuellement :

| Module | Nombre d'entrées | Statut |
|---|---:|---|
| Ressources / biens | 0 | Vide |
| Bâtiments | 0 | Vide |
| Recettes de production | 0 | Vide |
| Population et besoins | 0 | Vide |
| Disponibilités insulaires | 0 | Vide |
| Preuves | 0 | Vide |
| Régions | 2 | Latium et Albion, statut `to-observe` |

Le manifeste indique le jeu de base et les deux régions du périmètre V1. Cela définit le périmètre de travail, pas la validation des données du jeu.

`loadGameData` ne projette vers `core` que les ressources, bâtiments, recettes et paliers de population au statut `verified` ou `derived`. Avec l'état actuel des fichiers, le catalogue exploitable par le moteur est donc vide.

**Conséquence :** une simulation réelle basée sur les données du jeu ne peut pas encore être présentée comme fonctionnelle. Les jeux synthétiques utilisés dans les tests restent adaptés à la vérification technique, mais ne doivent pas être présentés comme des données Anno 117.

## 3. Contrat applicatif effectivement disponible

Le cas d'usage `simulateCatalogProduction` reçoit :

- un `DataRepository` construit par `loadGameData` ;
- un objet `IslandInput` comprenant :
  - `name` : nom de l'île ;
  - `houses` : nombre de maisons par palier de population ;
  - `built` : nombre de bâtiments déjà construits, par identifiant de bâtiment ;
  - `productivity` (facultatif) : facteur de productivité par bâtiment ;
  - `recipeAssignments` (facultatif) : nombre de bâtiments affectés à chaque recette.

Le résultat fourni par le moteur contient :

- la population totale calculée ;
- les recettes et les bâtiments affectés ;
- les débits effectifs d'intrants et de sorties ;
- les bilans par bien : demande, production affectée, déficit, surplus et indicateur de résultat non résolu ;
- les diagnostics d'affectation non résolue.

La couche React doit appeler le cas d'usage applicatif ; elle ne doit pas reproduire les calculs métier.

## 4. Écarts entre le besoin du lot 5 et le contrat existant

Le plan de développement prévoit de présenter les besoins calculés, les bâtiments requis et les déficits. Le contrat actuel permet de présenter les affectations existantes et les bilans calculés, mais il ne fournit pas encore :

- un objectif direct de quantité de biens à produire indépendant des paliers de population ;
- une sélection individualisée des besoins par habitant ou par catégorie ;
- un calcul automatique du nombre de bâtiments à construire pour couvrir la demande ;
- un stock initial de biens à consommer avant la production ;
- une stratégie d'affectation automatique des bâtiments aux recettes.

Ces écarts doivent être traités dans les contrats métier ou les lots concernés. L'interface ne doit pas calculer elle-même les valeurs manquantes ni interpréter les affectations existantes comme un dimensionnement optimal.

## 5. Décisions fonctionnelles et statut

Les décisions restent centralisées dans `docs/00-gouvernance/registre-decisions.md`.

Les décisions suivantes sont maintenant validées :

- **DEC-001 :** le premier parcours démarre par les objectifs de population (option A).
- **DEC-002 :** l'utilisateur saisit un nombre de maisons par palier ; le nombre d'habitants est calculé par le moteur à partir de `residentsPerHouse`.

Les points suivants restent à arbitrer :

| Décision | Sujet | Conséquence pour l'interface |
|---|---|---|
| DEC-001 | Entrée par objectifs de population | **Validée — option A** |
| DEC-002 | Saisie par nombre de maisons pour chaque palier | **Validée — maisons par palier** |
| DEC-003 | Sélection des besoins par palier, catégorie ou option | Détermine la granularité des objectifs |
| DEC-005 | Unité et période des taux de consommation | Détermine les libellés et les conversions présentées |
| DEC-006 | Précision numérique et arrondis d'affichage | Détermine les valeurs affichées et leur format |
| DEC-012 | Erreurs et résultats partiels | Détermine les états d'erreur et les diagnostics visibles |
| DEC-013 | Stocks et bâtiments existants | Détermine les données saisissables et l'interprétation des résultats |

Les décisions concernant la sélection des besoins par niveau/catégorie (DEC-003), les unités de consommation (DEC-005), la précision numérique et les arrondis d'affichage (DEC-006), les erreurs et résultats partiels (DEC-012) ainsi que les stocks et bâtiments existants (DEC-013) restent ouvertes. Le premier écran ne propose donc pas de filtre optionnel par besoin, de stock initial ni d'affectation de bâtiments. Il présente les flux de consommation effectivement définis dans les paliers validés, sans prétendre régler la classification des besoins optionnels.

Les décisions concernant les recettes à sorties multiples (DEC-009), la productivité (DEC-010) et la disponibilité locale des ressources (DEC-014) doivent aussi être respectées par le parcours, selon leur statut dans le registre.

## 6. Parcours retenu pour la première tranche

Le premier écran suit le parcours population (option A) :

1. L'utilisateur donne un nom à l'île qu'il planifie.
2. L'interface présente les paliers de population présents dans la projection validée du catalogue.
3. L'utilisateur saisit un nombre entier de maisons pour chaque palier ; la valeur initiale est zéro.
4. Le cas d'usage `simulateCatalogProduction` reçoit le nom de l'île et la répartition des maisons par palier. Les bâtiments construits et les affectations de recettes ne sont pas saisis dans cette première tranche.
5. L'interface restitue la population totale et les besoins de consommation renvoyés par le moteur, exprimés dans l'unité interne par minute.
6. Les erreurs de saisie ou de calcul sont présentées sans interrompre l'application.

L'interface ne calcule pas elle-même les taux de consommation, les besoins ou les capacités de production. Elle utilise les valeurs des paliers de population validés et le résultat du cas d'usage.

### Limites du premier parcours

- Aucun besoin en bien n'est saisi directement.
- Aucun choix individuel de besoin optionnel ou de catégorie n'est proposé tant que DEC-003 n'est pas arbitrée et représentée dans le modèle.
- Aucun stock initial ni bâtiment existant n'est saisi tant que DEC-013 n'est pas arbitrée.
- Aucun dimensionnement automatique des bâtiments n'est affiché : le contrat actuel ne fournit pas ce résultat.
- Aucun transfert ou approvisionnement inter-îles n'est simulé.
- Les paliers doivent être présents dans `coreCatalog.tiers`, donc être exploitables selon les règles de validation du catalogue. Les niveaux non vérifiés ou incomplets ne sont pas proposés à la saisie.

## 7. Proposition de séquencement du lot 5

1. **Arbitrage fonctionnel :** valider le mode d'entrée initial et les décisions nécessaires à la saisie.
2. **Conception de l'écran :** définir le parcours, les champs, les états vides, les erreurs et les résultats attendus.
3. **Vérification du contrat applicatif :** identifier les évolutions de `core` ou `product` nécessaires avant de demander à l'interface des résultats non fournis par le moteur.
4. **Implémentation incrémentale :** construire les composants React et relier le flux au cas d'usage applicatif.
5. **Tests :** vérifier le parcours nominal, les erreurs, les états sans données et la cohérence entre résultats affichés et résultats du cas d'usage.
6. **Validation manuelle :** démarrer l'application Windows et vérifier le flux complet avec un jeu synthétique clairement signalé, puis avec les données du jeu lorsqu'elles seront validées et intégrées.

## 8. Conditions de sortie du cadrage

- Le mode d'entrée est explicitement choisi et consigné dans DEC-001.
- La représentation de la population et des besoins est spécifiée (DEC-002 et DEC-003).
- Les unités, périodes et règles d'affichage nécessaires au parcours sont déterminées.
- Les écarts entre les résultats attendus et les sorties actuelles du moteur sont affectés au bon lot.
- Les critères d'acceptation de l'écran et des erreurs sont rédigés.
- Aucune donnée synthétique n'est confondue avec le catalogue du jeu.
- Aucune règle non validée n'est implémentée par défaut.

## 9. Décision actée et suite

Le propriétaire du projet a retenu **A — population** le 31 octobre 2026. DEC-001 et DEC-002 sont consignées comme validées dans le registre de gouvernance.

La première tranche peut donc implémenter la saisie des maisons par palier et la restitution de la population totale et des besoins calculés. Les données réelles du catalogue restent un prérequis à l'exécution d'une simulation Anno 117 ; en leur absence, l'interface doit afficher un état vide explicite plutôt que des données fictives.