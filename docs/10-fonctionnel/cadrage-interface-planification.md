# Cadrage fonctionnel — première interface de planification

**Version :** 0.1
**Date :** 31 octobre 2026
**Statut :** proposition de cadrage — décisions métier à valider
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

## 5. Décisions fonctionnelles à arbitrer

Les décisions restent centralisées dans `docs/00-gouvernance/registre-decisions.md`. Pour le lot 5, les plus directement concernées sont :

| Décision | Sujet | Conséquence pour l'interface |
|---|---|---|
| DEC-001 | Population, besoins en biens ou les deux comme point d'entrée | Détermine le parcours principal et le contrat d'entrée |
| DEC-002 | Saisie de la population : habitants, maisons ou maisons par palier | Détermine les champs et leur validation |
| DEC-003 | Sélection des besoins par palier, catégorie ou option | Détermine la granularité des objectifs |
| DEC-005 | Unité et période des taux de consommation | Détermine les libellés et les conversions présentées |
| DEC-006 | Précision numérique et arrondis d'affichage | Détermine les valeurs affichées et leur format |
| DEC-012 | Erreurs et résultats partiels | Détermine les états d'erreur et les diagnostics visibles |
| DEC-013 | Stocks et bâtiments existants | Détermine les données saisissables et l'interprétation des résultats |

Les décisions concernant les recettes à sorties multiples (DEC-009), la productivité (DEC-010) et la disponibilité locale des ressources (DEC-014) doivent aussi être respectées par le parcours, selon leur statut dans le registre. Le présent lot ne doit pas élargir implicitement le périmètre du moteur.

## 6. Options de point d'entrée du premier parcours

Les options suivantes sont soumises à arbitrage ; aucune n'est retenue dans ce document.

### Option A — Objectifs de population en premier

L'utilisateur définit le nombre de maisons par palier. Les besoins associés sont calculés à partir du catalogue de population, puis le bilan est présenté selon les bâtiments et recettes affectés.

- Avantage : correspond au modèle d'entrée `IslandInput.houses` déjà exposé par le moteur.
- Limites : suppose que les besoins par palier et les taux de consommation soient définis et que le catalogue soit suffisamment alimenté ; ne couvre pas une demande arbitraire de biens.

### Option B — Besoins en biens en premier

L'utilisateur saisit directement des quantités ou débits à produire.

- Avantage : permet de planifier une chaîne de production sans devoir définir une population.
- Limites : nécessite un contrat d'entrée et un cas d'usage qui ne sont pas présents dans le modèle actuel.

### Option C — Les deux modes

L'utilisateur peut démarrer soit par la population, soit par une liste de besoins en biens.

- Avantage : couvre les deux usages.
- Limites : augmente le périmètre initial et nécessite de définir deux parcours, leurs validations et la convergence vers un modèle de scénario cohérent.

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

## 9. Arbitrage attendu

Pour choisir le premier parcours à implémenter, le propriétaire du projet doit retenir l'une des options de la section 6 : **A — population**, **B — besoins en biens**, ou **C — les deux modes**.

Cette décision déterminera la prochaine tranche de code du lot 5.