# Plan de gestion de configuration — Anno 117 Planner

**Version :** 1.1  
**Date :** 31 octobre 2026  
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
- Le correctif intégré à `main` donne lieu à une nouvelle version de type PATCH. Le tag stable `vX.Y.Z` n'est posé qu'après réussite du build, des tests, de l'installation et de la validation fonctionnelle de cette version.

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

Aucune branche `integration/*` ou `release/*` dédiée n'est créée. Le flux de release utilise uniquement les deux branches permanentes : `develop` pour l'intégration et `main` pour le candidat de release puis la version stable.

Le passage de `develop` vers `main` ne constitue pas à lui seul une publication. Il prépare un candidat qui doit encore passer la validation de release. **Le tag stable n'est posé qu'après la réussite de l'ensemble des contrôles de release.**

Séquence de release :

1. Vérifier que `develop` est à jour et que les critères de sortie des lots prévus sont satisfaits.
2. Ouvrir une Pull Request de `develop` vers `main`, avec la version cible, le périmètre et les notes de version.
3. Obtenir une CI verte et relire le diff, puis fusionner en Squash.
4. Construire le candidat depuis le commit désormais présent sur `main`.
5. Exécuter et consigner la checklist de validation : build de production, tests automatisés, installation sur l'environnement cible, démarrage et validation fonctionnelle/recette.
6. Tant que tous les contrôles ne sont pas concluants, ne pas créer le tag stable et ne pas annoncer la version comme publiée.
7. Après validation complète, poser le tag stable sur le commit exact de `main` qui a été testé et validé, puis publier les notes de version et la GitHub Release.

Si une validation échoue, aucun tag stable n'est créé. La correction est apportée dans le flux normal de développement, intégrée à `develop`, puis une nouvelle PR de release vers `main` est préparée et le cycle de validation est rejoué. Il n'est pas permis de déplacer un tag déjà publié pour corriger une release.

Les Release Candidates peuvent être identifiées par des tags de préversion, par exemple `v1.0.0-rc.1`, `v1.0.0-rc.2`. Ces tags identifient des candidats explicitement non stables ; ils ne remplacent pas le tag stable et ne sont pas créés pour une version qui n'a pas au minimum passé les contrôles de build et de tests. Le tag stable `v1.0.0` n'est posé qu'après la validation complète, installation comprise.

La branche `main` peut donc contenir temporairement un candidat non encore publié. Seuls les tags stables identifient les versions officiellement publiées.

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
- aucun acteur de contournement déclaré dans le Ruleset.

Le Ruleset effectivement enregistré dans GitHub a été relu après son import le 31 octobre 2026. Il contient les règles `deletion`, `non_fast_forward`, `pull_request` et `required_status_checks`. La règle `commit_message_pattern` présente dans le JSON fourni n'apparaît pas dans la configuration active retournée par GitHub : **la convention de commit du chapitre 6 est donc documentée, mais elle n'est pas encore bloquante côté GitHub**.

Pour activer cette dernière contrainte, ouvrir le Ruleset dans **Settings → Rules → Rulesets → Protect main and develop**, ajouter une restriction de métadonnées de commit, choisir `Restrict commit metadata`, puis `Must match a given regex pattern` et renseigner le motif Conventional Commits du fichier JSON. Enregistrer, puis relire la configuration effective pour confirmer que `commit_message_pattern` apparaît bien dans les règles actives.

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

### 5.3. Version de développement et première release stable

La version de développement actuelle reste **`0.1.0`**. Il n'est pas nécessaire de l'incrémenter à chaque lot ou à chaque fusion de fonctionnalité.

La première release stable visée est **`1.0.0`**. Ce numéro ne devient la version publiée qu'après validation complète de la release et pose du tag stable `v1.0.0`.

Les métadonnées actuellement examinées de `apps/desktop` et `packages/product` sont en `0.1.0`. Elles peuvent rester à cette valeur pendant le développement. Leur évolution vers la version candidate puis la version stable sera décidée lors de la préparation de la release, sans modification anticipée pendant les lots fonctionnels.

### 5.4. Release Candidates et validation avant tag stable

Une ou plusieurs versions candidates peuvent être produites avant la première release stable.

Leur numérotation respecte la syntaxe de préversion SemVer :

- `1.0.0-rc.1` : première candidate de la release `1.0.0` ;
- `1.0.0-rc.2` : candidate suivante après correction ;
- `1.0.0` : version stable, uniquement après validation complète.

Les tags de candidat utilisent le préfixe `v`, par exemple `v1.0.0-rc.1`. Ils doivent être déclarés comme préversions dans GitHub Releases lorsqu'une release est publiée pour test. Ils ne doivent jamais être présentés comme la version stable.

La validation de release doit au minimum attester les points suivants :

| Contrôle | Résultat attendu |
|---|---|
| Build de production | Build terminé sans erreur depuis le commit candidat |
| Tests automatisés | Tous les tests prévus passent |
| Typecheck | Tous les projets concernés passent |
| Installation | L'application s'installe sur l'environnement cible |
| Démarrage et validation fonctionnelle | L'application démarre et les parcours de recette retenus sont validés |
| Identification du contenu | Le commit de `main` testé est précisément identifié |

Le tag stable est créé **après** réussite de cette checklist et pointe sur le commit exact ayant été testé. Si une correction modifie le contenu, le candidat est reconstruit et les contrôles concernés sont rejoués ; le tag stable n'est pas posé sur l'ancien commit.

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
- aucun tag Git de release n'est actuellement présent ;
- le workflow CI cible les PR et les pushes sur `main` et `develop` ;
- le Ruleset `Protect main and develop` a été importé et activé manuellement par le propriétaire du dépôt le 31 octobre 2026 ;
- la lecture de sa configuration effective confirme les protections PR, CI, suppression et force push sur `main` et `develop` ;
- la règle `commit_message_pattern` n'a pas été conservée lors de l'import et reste à ajouter manuellement dans les restrictions de métadonnées ;
- la PR #10 porte le plan de gestion de configuration et reste ouverte pour intégrer ces règles documentaires ;
- la CI de la PR #10 a été observée en réussite sur le commit `9afc4b01370d52d503db4ee3a745eb71c43c0dce`.

Actions restantes :

1. Vérifier que le Ruleset importé cible bien uniquement `main` et `develop`, et qu'il reste en état **Active**.
2. Ajouter manuellement la restriction `commit_message_pattern`, puis vérifier qu'elle apparaît dans la configuration effective.
3. Vérifier que le check CI obligatoire bloque effectivement une PR vers chacune des branches permanentes.
4. Conserver la version de développement `0.1.0` jusqu'à la préparation d'une release candidate.
5. Pour la première release, préparer une candidate `1.0.0-rc.N`, la construire et la valider sur le contenu de `main`.
6. Ne créer le tag stable `v1.0.0` qu'après réussite du build, des tests, de l'installation et de la validation fonctionnelle.

## 9. Révision du plan

Toute évolution de ces règles doit être proposée par Pull Request. La mise à jour doit préciser :

- la règle modifiée ;
- la raison du changement ;
- les impacts sur les branches et les releases ;
- les fichiers de configuration GitHub concernés ;
- les éventuelles adaptations requises dans le workflow CI.

Le présent document est versionné avec le code et constitue la référence de gestion de configuration du dépôt.
