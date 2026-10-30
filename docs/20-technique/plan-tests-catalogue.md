# Plan de tests — catalogue et moteur de données

**Version :** 1.0  
**Statut :** plan de test de référence — exécution partielle à ce stade  
**Périmètre :** `packages/game-data`, `packages/data-engine`, contrat avec `packages/core` et validation en jeu

## 1. Objectifs

Vérifier que les ensembles de données modulaires sont cohérents, que leur provenance est traçable, que l'agrégation est déterministe et que le `core` ne reçoit que des données admissibles. Vérifier également que l'application peut embarquer et charger le catalogue sans dépendance réseau.

Les fixtures automatisées sont synthétiques : elles vérifient le comportement technique et ne constituent jamais des données du jeu.

## 2. Niveaux de test

| Niveau | Périmètre | Responsabilité |
|---|---|---|
| T1 — Unitaire | Validation d'un module, statuts, preuves, unités et identifiants | `game-data` |
| T2 — Intégration | Références croisées et agrégation des modules | `data-engine` |
| T3 — Contrat | Projection vers `Catalog` et compatibilité du `core` | `data-engine` + `core` |
| T4 — Packaging | Chargement du catalogue embarqué, absence de réseau, version du manifeste | Application desktop |
| T5 — Fonctionnel en jeu | Comparaison des valeurs observées à l'interface et aux mesures de campagne | Campagne de référence |

## 3. Matrice de tests automatisés

| ID | Scénario | Résultat attendu | Niveau |
|---|---|---|---|
| CAT-001 | Manifeste complet et conforme | Accepté | T1 |
| CAT-002 | Version ou identifiant obligatoire absent | Erreur localisée | T1 |
| CAT-003 | Module obligatoire absent | Erreur bloquante | T1 |
| CAT-004 | Identifiant dupliqué dans un module | Erreur bloquante | T1 |
| CAT-005 | Référence vers ressource inconnue | Erreur bloquante | T2 |
| CAT-006 | Bâtiment associé à une région inconnue | Erreur bloquante | T2 |
| CAT-007 | Recette non référencée par son bâtiment | Erreur bloquante | T2 |
| CAT-008 | Débit nul, négatif ou non fini | Erreur bloquante | T1 |
| CAT-009 | Preuve interne absente ou inconnue | Erreur bloquante | T1 |
| CAT-010 | Preuve dérivée sans dépendance | Erreur bloquante | T1 |
| CAT-011 | Statut `observed` ou `disputed` | Non exposé au `core` | T3 |
| CAT-012 | Statut `verified` ou `derived` avec références valides | Éligible à la projection | T3 |
| CAT-013 | Ressource non vérifiée référencée par une recette | Recette exclue de la projection | T3 |
| CAT-014 | Même entrée chargée deux fois | Résultat déterministe, sans mutation | T2 |
| CAT-015 | Ordre des modules modifié | Même référentiel logique | T2 |
| CAT-016 | Catalogue incomplet mais sans incohérence bloquante | Diagnostics de couverture, pas de valeur inventée | T2 |
| CAT-017 | Contrat de sortie consommé par `computeIsland` | Compatibilité de type et résultat cohérent | T3 |
| CAT-018 | Chargement de l'application hors ligne | Aucun appel réseau requis | T4 |

## 4. Tests de campagne en jeu

Les essais manuels sont réalisés sur une nouvelle campagne. Pour chaque mesure, consigner la version du jeu, le contexte, les éventuels bonus/modificateurs, l'unité affichée, la méthode et la répétition.

| ID | Scénario | Vérification attendue |
|---|---|---|
| GAME-001 | Identification des régions Latium et Albion | Identifiants et libellés confirmés |
| GAME-002 | Observation des ressources naturelles d'une île | Disponibilités attachées à l'île observée, pas à la région entière |
| GAME-003 | Construction d'un premier bâtiment | Identité, région et recette disponibles |
| GAME-004 | Mesure d'une recette | Intrants, sorties et cadence reproduits |
| GAME-005 | Mesure d'un besoin de population | Résidents, unité, besoin et période cohérents |
| GAME-006 | Changement de condition ou modificateur | Effet isolé et documenté |
| GAME-007 | Reproduction d'une mesure | Écart dans la tolérance définie ou anomalie ouverte |
| GAME-008 | Comparaison avec le calculateur | Débits et bilans conformes aux observations |

Aucune tolérance numérique n'est présumée ici : elle doit être définie selon la précision de l'interface et la méthode de mesure avant chaque série.

## 5. Données de test et séparation des preuves

- Les tests automatisés utilisent des identifiants et valeurs explicitement synthétiques.
- Les données observées en jeu sont accompagnées de preuves internes.
- Les informations issues de sources secondaires ne servent pas de fixtures de référence et ne sont pas embarquées comme données vérifiées.
- Une donnée dérivée doit référencer les preuves dont elle dépend.
- Une donnée contestée ou non vérifiée ne doit jamais alimenter silencieusement les calculs.

## 6. Commandes de validation

Depuis la racine du dépôt :

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm --filter @anno117/game-data test
pnpm --filter @anno117/data-engine test
pnpm --filter @anno117/core test
```

Le packaging desktop et le contrôle d'absence d'accès réseau seront ajoutés aux tests d'intégration de l'application lorsque le chargement du catalogue y sera raccordé.

## 7. Critères de sortie

Le lot technique est prêt pour revue lorsque :
- tous les tests T1 à T3 sont automatisés et passent ;
- le contrat de projection est exercé par le `core` ;
- les erreurs de validation sont localisables ;
- les données non vérifiées ne sont pas exposées au calcul ;
- le manifeste et les modules sont chargés depuis le bundle local ;
- le plan de test et les résultats réellement exécutés sont à jour.

La validation T4/T5 reste ouverte tant que l'intégration desktop et la campagne en jeu ne sont pas réalisées.
