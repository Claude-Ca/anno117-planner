# Plan de gestion de configuration — Anno 117 Planner

**Version :** 1.0  
**Date :** 30 octobre 2026  
**Statut :** proposition de référence — à valider par PR et à appliquer dans les paramètres GitHub  
**Dépôt :** `Claude-Ca/anno117-planner`

## 1. Objet et documents de référence

Ce document définit les règles de gestion de configuration du dépôt : branches, flux d'intégration, versions, tags, commits et contrôles avant fusion.

Il complète le [Plan de développement par lots](plan-de-developpement.md), qui reste la référence pour le périmètre fonctionnel, l'ordre des lots, les dépendances et leurs critères de sortie. En cas de différence, le présent plan prévaut pour les conventions Git, les branches, les commits et les releases ; le plan de développement prévaut pour le contenu et l'acceptation des lots.

Documents et configurations associés :

- [Plan de développement par lots](plan-de-developpement.md) ;
- [Workflow CI](../../.github/workflows/ci.yml) ;
- [Ruleset de protection de `main` et `develop`](../../.github/rulesets/protect-main-develop.json) ;
- [Plan de tests du catalogue](../20-technique/plan-tests-catalogue.md), pour les contrôles techniques déjà définis.

## 2. Branches de référence

Le dépôt utilise un GitFlow simplifié autour de deux branches permanentes.

| Branche | Rôle | Règle |
|---|---|---|
| `main` | Référence des versions release publiées | Ne reçoit que les PR de release depuis `develop` et les PR de correctifs `fix/*` |
| `develop` | Branche d'intégration du développement courant | Reçoit les PR des branches `feature/*` et les retours de correctifs issus de `main` |

Les branches permanentes ne sont jamais utilisées comme branches de travail. Aucun développement fonctionnel ou correctif ne doit être commité directement sur `main` ou `develop`.

### 2.1. Branches de fonctionnalité — `feature/*`

- Créées à partir du dernier état de `develop`.
- Nommées `feature/<sujet-court>`, en minuscules, avec des mots séparés par des tirets.
- Destinées à un lot ou à une évolution fonctionnelle/technique cohérente.
- Soumises par Pull Request vers `develop`.
- Fusionnées après revue du diff et réussite du contrôle CI obligatoire.
- Fusionnées en Squash.
- Supprimées après confirmation de la fusion, sauf besoin explicite de conservation.

Exemple :

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/planner-ui
```

### 2.2. Branches de correctif — `fix/*`

Les branches `fix/*` sont réservées aux correctifs urgents ou correctifs de maintenance destinés à la version publiée.

- Créées à partir du dernier état de `main`.
- Nommées `fix/<sujet-court>`.
- Le correctif reste limité à la correction nécessaire à la version publiée.
- Une première Pull Request cible `main`.
- Après intégration dans `main`, une seconde Pull Request doit proposer le même correctif vers `develop` (merge-back).
- La branche `fix/*` est conservée jusqu'à la fusion de la PR de merge-back.
- Le correctif intégré à `main` donne lieu à une nouvelle version de type PATCH et à un nouveau tag.

Exemple de séquence :

```text
main
  └── fix/correction-import  ──PR──> main
                                  │
                                  └── nouvelle release PATCH (tag vX.Y.Z)
  fix/correction-import ──────PR de merge-back──────> develop
```

Le merge-back est obligatoire, même si le correctif semble également présent dans `develop`. La PR permet de vérifier et de tracer explicitement que la correction de production est bien répercutée dans la branche d'intégration.

### 2.3. Release — `develop` vers `main`

Aucune branche `release/*` dédiée n'est imposée dans ce GitFlow simplifié.

Lorsqu'un état de `develop` satisfait les critères de sortie des lots concernés et est jugé publiable :

1. Mettre `develop` à jour et vérifier son état.
2. Ouvrir une Pull Request de `develop` vers `main`.
3. Décrire le périmètre de la release et la version proposée.
4. Vérifier la réussite du contrôle CI obligatoire et relire le diff.
5. Fusionner en Squash.
6. Créer le tag de version sur le commit de `main` issu de la fusion.
7. Rédiger les notes de version et publier une GitHub Release si une distribution est réalisée.

La branche `main` représente ainsi le dernier état publié, et non l'espace d'intégration des développements en cours.

## 3. Règles de protection GitHub

Le fichier importable [`.github/rulesets/protect-main-develop.json`](../../.github/rulesets/protect-main-develop.json) définit un Ruleset actif ciblant exclusivement `main` et `develop`.

Il impose :

- une Pull Request pour toute mise à jour des deux branches ;
- le contrôle obligatoire `Tests, typecheck and build` ;
- une branche à jour avec sa cible avant fusion (contrôle strict) ;
- la résolution des conversations de revue avant fusion ;
- l'interdiction des force pushes ;
- l'interdiction de supprimer les branches protégées ;
- la fusion Squash comme seule méthode autorisée ;
- aucun acteur de contournement déclaré dans le Ruleset ;
- format des messages de commit contrôlé par une règle `commit_message_pattern` conforme à la nomenclature du chapitre 6.

La règle de commit impose le format du type et du scope, tout en autorisant le marqueur de rupture `!`. Les titres de Squash Merge doivent donc suivre la même convention.

Aucune approbation humaine obligatoire n'est imposée à ce stade : le dépôt a un contributeur principal et la revue du diff reste réalisée dans le processus de PR. Cette règle pourra être renforcée si d'autres contributeurs réguliers rejoignent le projet.

Le Ruleset ne protège pas les tags Git. Une règle distincte ciblant les tags de release `v*` pourra être ajoutée pour empêcher leur suppression ou leur déplacement.

## 4. Intégration continue obligatoire

Le workflow `CI` exécute les mêmes contrôles pour les Pull Requests ciblant `main` ou `develop`, ainsi que sur les pushes résultant des fusions sur ces branches.

Le job requis porte exactement le nom :

```text
Tests, typecheck and build
```

Il exécute :

1. `pnpm install --frozen-lockfile`
2. `pnpm test`
3. `pnpm -r typecheck`
4. `pnpm --filter @anno117/desktop build`

Le contexte du check requis dans le Ruleset doit conserver exactement ce nom. Tout changement de nom du job CI doit être répercuté dans le Ruleset avant de fusionner la modification.

Les contrôles locaux restent nécessaires avant ouverture de PR. La réussite CI ne remplace ni la revue du diff ni les critères fonctionnels du lot.

## 5. Versionnement

### 5.1. Format

Le projet applique le versionnement sémantique :

```text
MAJOR.MINOR.PATCH
```

Les tags Git de release utilisent le préfixe `v` :

```text
vMAJOR.MINOR.PATCH
```

Exemple : `v1.2.3`.

### 5.2. Règles d'incrémentation

| Composant | Incrément | Quand l'utiliser | Exemple |
|---|---|---|---|
| MAJOR | +1, MINOR et PATCH remis à 0 | Évolution incompatible avec la version précédente : rupture d'API, de format de scénario, de contrat de données ou de comportement attendu | `1.4.2 → 2.0.0` |
| MINOR | +1, PATCH remis à 0 | Nouvelle fonctionnalité compatible avec les usages et contrats existants | `1.4.2 → 1.5.0` |
| PATCH | +1 | Correction compatible, sans rupture de contrat ni changement fonctionnel incompatible | `1.4.2 → 1.4.3` |

Principes complémentaires :

- Une rupture de compatibilité entraîne une incrémentation ascendante de MAJOR.
- Une évolution compatible ajoute une version MINOR ou PATCH selon qu'il s'agit d'une fonctionnalité ou d'une correction.
- Une version publiée ne doit jamais être diminuée, réutilisée ou réaffectée à un autre contenu.
- Une correction publiée sur `main` via `fix/*` incrémente PATCH.
- Une version MINOR ou MAJOR est publiée depuis une PR de release `develop` vers `main`.
- Le contenu exact associé à un tag est immuable ; une correction ultérieure donne lieu à un nouveau numéro de version.

### 5.3. Version de référence actuelle

La version de référence produit retenue à ce stade est **1.0.0**. Aucun tag Git de release n'a été trouvé lors de la préparation de ce plan ; le premier tag devra être créé lors de la première publication effective.

Un écart de métadonnées est également présent : les fichiers `package.json` de `apps/desktop` et de `packages/product` indiquent actuellement `0.1.0`. Leur alignement avec la version de release devra être traité explicitement dans la préparation de la première publication, sans modification implicite au cours d'un lot documentaire.

## 6. Convention de nommage des commits

Les commits suivent la convention **Conventional Commits**.

Format :

```text
<type>(<scope>)!: <description courte à l'impératif>
```

- `type` est obligatoire.
- `scope` est facultatif ; lorsqu'il est présent, il précise le package, le domaine ou le composant concerné.
- `!` est facultatif et signale une rupture de compatibilité.
- La description est courte, explicite et commence par une formulation d'action.
- Le corps du commit peut expliquer le contexte et les conséquences.
- Un changement incompatible doit être documenté dans le pied de commit avec `BREAKING CHANGE:`.

### 6.1. Types autorisés

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `refactor` | Refactorisation sans changement fonctionnel attendu |
| `test` | Ajout ou modification de tests |
| `build` | Construction, packaging ou configuration des dépendances de build |
| `ci` | Workflow et configuration d'intégration continue |
| `chore` | Maintenance qui ne relève pas des autres catégories |
| `perf` | Amélioration des performances |
| `style` | Mise en forme sans changement de logique |
| `revert` | Annulation d'un commit précédent |

Le type standard est `docs` (avec un `s`), et non `doc`.

### 6.2. Exemples

```text
feat(planner): add population tier selector
fix(core): reject negative productivity
docs(config): define release workflow
refactor(data-engine): isolate catalog projection
test(product): cover modular catalog simulation
build(desktop): update electron build configuration
ci(github): run validation on main and develop
chore(deps): refresh pnpm lockfile
perf(core): optimize production graph traversal
style(ui): align form spacing
revert: feat(planner): add population tier selector
```

Pour une évolution incompatible :

```text
feat(product)!: replace the scenario input contract

BREAKING CHANGE: existing scenario files require migration to the new input format.
```

Les titres des Pull Requests et les messages de Squash Merge doivent respecter la même convention afin que l'historique de `develop` et `main` reste homogène.

## 7. Critères avant fusion

Toute Pull Request vers `develop` ou `main` doit respecter les critères suivants :

- périmètre décrit et cohérent avec le plan de développement ;
- branche source créée depuis la bonne branche de référence ;
- commits conformes à la nomenclature ;
- tests, typecheck et build exécutés localement selon le périmètre ;
- diff relu, sans fichier accidentel ni secret ;
- CI obligatoire au vert ;
- conversations de revue résolues ;
- branche source à jour avec sa cible ;
- stratégie de fusion Squash.

Pour une PR de release, la version cible et les notes de version doivent en plus être explicites.

Pour une PR `fix/*` vers `main`, la PR de merge-back vers `develop` doit être ouverte après la fusion du correctif dans `main` et suivie jusqu'à sa fusion.

## 8. État initial et actions de mise en place

État constaté lors de la rédaction :

- branche par défaut GitHub : `develop` ;
- `develop` contient le commit de fusion de la PR #9 ;
- `main` pointe encore sur le commit initial du dépôt et n'a pas encore reçu de release issue de `develop` ;
- aucun tag Git n'est actuellement présent ;
- le workflow CI existant a été étendu pour cibler `main` et `develop` ;
- le Ruleset de protection est fourni sous forme de JSON importable, mais doit encore être importé et activé dans les paramètres GitHub du dépôt.

Ordre de mise en place :

1. Importer `.github/rulesets/protect-main-develop.json` dans **Settings → Rules → Rulesets**.
2. Vérifier que le Ruleset cible bien uniquement `main` et `develop`, et qu'il est en état **Active**.
3. Ouvrir la PR de `feature/configuration-rules` vers `develop` et vérifier que la CI obligatoire s'exécute.
4. Après fusion de la configuration dans `develop`, préparer ultérieurement une première PR de release de `develop` vers `main`, avec décision explicite sur le passage à la version publiée `1.0.0` et l'alignement des métadonnées de packages.
5. Après cette première intégration sur `main`, vérifier une PR ciblant `main` pour confirmer que le check CI est bien disponible et obligatoire.

## 9. Révision du plan

Toute évolution de ces règles doit être proposée par Pull Request. La mise à jour doit préciser :

- la règle modifiée ;
- la raison du changement ;
- les impacts sur les branches et les releases ;
- les fichiers de configuration GitHub concernés ;
- les éventuelles adaptations requises dans le workflow CI.

Le présent document est versionné avec le code et constitue la référence de gestion de configuration du dépôt.
