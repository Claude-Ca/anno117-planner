# Guide de démarrage développeur — Anno 117 Planner

## 1. Objectif du document

Ce guide permet à un développeur de préparer son environnement, de lancer Anno 117 Planner et de vérifier ses modifications avant de les proposer à l’intégration.

Il complète le [plan de développement](plan_de_developpement.md), qui décrit les lots fonctionnels et leur ordre de réalisation.

Le projet est une application desktop indépendante destinée à la planification de production dans *Anno 117: Pax Romana*. Elle n’est ni affiliée à Ubisoft ni approuvée par Ubisoft.

## 2. Prérequis

Les outils suivants sont nécessaires :

- **Git** : gestion du code source et des branches.
- **Node.js** : environnement d’exécution JavaScript.
- **pnpm** : gestionnaire de paquets du monorepo.
- Un éditeur compatible TypeScript, par exemple Visual Studio Code ou IntelliJ IDEA.

Les versions utilisées lors de la mise en place du socle desktop étaient :

- Node.js 24.22.1
- pnpm 12.15.0

Ces versions constituent une référence de l’environnement de développement initial, pas nécessairement les versions minimales officiellement requises. Consultez les fichiers de configuration du dépôt avant de modifier les versions utilisées par l’équipe.

Pour vérifier les outils disponibles :

```powershell
node --version
pnpm --version
git --version
```

## 3. Récupérer le projet

Cloner le dépôt :

```powershell
git clone https://github.com/Claude-Ca/anno117-planner.git
cd anno117-planner
```

Installer les dépendances du monorepo :

```powershell
pnpm install
```

Cette commande installe les dépendances des différents packages et applications déclarés dans le workspace.

### Autorisations de scripts de build

Lors de la première installation, pnpm peut demander d’autoriser certains scripts de build de dépendances.

Pour le socle desktop, deux dépendances ont nécessité une autorisation explicite :

- **electron** : nécessaire au fonctionnement de l’application desktop.
- **esbuild** : utilisé par les outils de build.

Si pnpm affiche une demande d’approbation, exécutez :

```powershell
pnpm approve-builds
```

Dans l’interface interactive, sélectionnez `electron` et `esbuild`, puis validez les choix.

Relancez ensuite :

```powershell
pnpm install
```

La configuration d’approbation est enregistrée dans `pnpm-workspace.yaml`. Elle doit être conservée dans le dépôt afin de rendre la configuration de l’environnement reproductible pour les autres contributeurs.

N’approuvez pas automatiquement tous les scripts proposés : vérifiez les dépendances concernées avant de leur permettre d’exécuter du code pendant l’installation.

## 4. Comprendre l’organisation du dépôt

Le projet utilise un monorepo pnpm.

| Répertoire | Responsabilité |
|---|---|
| `apps/desktop` | Application desktop Electron, interface React et outils Vite |
| `packages/core` | Logique métier et calculs de production indépendants de l’interface |
| `packages/ui` | Composants d’interface mutualisables |
| `documents` | Expression du besoin, plan de développement et documentation technique |

Le catalogue des données du jeu et la couche d’orchestration applicative pourront être structurés dans les lots ultérieurs, conformément au plan de développement.

### Principe d’architecture

La logique métier doit rester indépendante d’Electron et de React. Les calculs doivent pouvoir être testés sans lancer de fenêtre graphique.

Les modifications propres à l’interface ou au système desktop ne doivent pas introduire de dépendance du cœur métier vers Electron.

## 5. Démarrer l’application en développement

Depuis la racine du dépôt :

```powershell
pnpm --filter @anno117/desktop dev
```

Cette commande démarre l’environnement de développement Electron/Vite et ouvre la fenêtre de l’application.

Le mode développement est à privilégier pour travailler sur l’interface et vérifier rapidement les changements.

Pour arrêter l’application, fermez la fenêtre ou interrompez le processus dans le terminal si nécessaire.

## 6. Construire l’application

Pour générer les fichiers de production du desktop :

```powershell
pnpm --filter @anno117/desktop build
```

Les fichiers générés sont placés dans le répertoire de sortie configuré par Electron Vite, notamment `apps/desktop/out`.

La compilation de production permet de vérifier que les différentes parties de l’application peuvent être assemblées.

### Tester le lancement de la version compilée

Après un build réussi :

```powershell
pnpm --filter @anno117/desktop exec electron .
```

Cette commande lance Electron à partir du package desktop et utilise son point d’entrée déclaré dans `apps/desktop/package.json`.

Elle permet de vérifier le lancement de la version compilée, indépendamment du serveur de développement.

## 7. Vérifier le code

Les vérifications doivent être exécutées avant de proposer une modification à l’intégration.

### Exécuter les tests

Depuis la racine :

```powershell
pnpm test
```

Cette commande exécute les tests configurés dans le workspace, notamment ceux du cœur métier.

Les tests doivent vérifier les comportements attendus, les cas limites et les erreurs de validation.

### Vérifier TypeScript

Pour vérifier les packages et applications disposant d’un script `typecheck` :

```powershell
pnpm -r typecheck
```

Cette commande exécute les vérifications TypeScript récursivement dans le workspace.

Un contrôle ciblé du desktop est également possible :

```powershell
pnpm --filter @anno117/desktop typecheck
```

### Vérifier les espaces et fins de ligne du diff

```powershell
git diff --check
```

Cette commande détecte notamment les espaces superflus et certains problèmes de whitespace dans les changements suivis par Git.

Pour afficher les modifications suivies :

```powershell
git diff
```

Pour obtenir un résumé :

```powershell
git diff --stat
```

Pour afficher l’état du dépôt, y compris les nouveaux fichiers non suivis :

```powershell
git status --short
```

Attention : `git diff` et `git diff --stat` ne présentent pas les fichiers non suivis. Ceux-ci apparaissent dans `git status --short`. Après `git add`, utilisez `git diff --cached` pour examiner les changements indexés avant le commit.

### Vérifications non encore configurées

Au moment de la rédaction de ce guide, les scripts suivants ne sont pas configurés à la racine du projet :

```powershell
pnpm lint
pnpm format:check
```

Ils ne doivent donc pas être considérés comme des contrôles disponibles tant que les outils correspondants et leurs scripts n’ont pas été ajoutés.

## 8. Workflow de contribution

Le développement s’effectue sur une branche dédiée à un lot ou à une fonctionnalité.

### Avant de commencer

Mettre à jour la branche de référence :

```powershell
git switch develop
git pull
```

Créer une branche de fonctionnalité :

```powershell
git switch -c feature/nom-de-la-fonctionnalite
```

Utiliser un nom explicite, cohérent avec le sujet traité.

### Pendant le développement

- Limiter les modifications au périmètre de la branche.
- Ajouter ou adapter les tests en fonction des comportements modifiés.
- Éviter les changements sans rapport avec la fonctionnalité.
- Vérifier régulièrement l’état du dépôt avec `git status --short`.

### Avant de proposer l’intégration

Exécuter les contrôles pertinents :

```powershell
pnpm test
pnpm -r typecheck
git diff --check
git status --short
```

Si le desktop a été modifié, vérifier également :

```powershell
pnpm --filter @anno117/desktop build
```

Examiner le diff, vérifier les nouveaux fichiers et s’assurer qu’aucun fichier généré ou secret n’est ajouté par erreur.

Créer ensuite un commit décrivant clairement le changement :

```powershell
git add .
git diff --cached
git commit -m "feat: description de la fonctionnalité"
```

La revue et la fusion dans `develop` interviennent après validation des changements.

Après la fusion, mettre à jour `develop` avant de commencer le lot suivant.

## 9. Diagnostic rapide

### La fenêtre Electron ne démarre pas

1. Vérifier que `pnpm install` s’est terminé correctement.
2. Vérifier les autorisations de build de `electron` et `esbuild`.
3. Relancer l’installation si nécessaire.
4. Examiner les messages d’erreur du terminal.
5. Tester la compilation :

```powershell
pnpm --filter @anno117/desktop build
```

### La compilation réussit mais le lancement de production échoue

Vérifier que le point d’entrée déclaré dans `apps/desktop/package.json` correspond au fichier généré et que le chemin du preload dans le processus principal correspond bien au fichier compilé.

Les chemins des fichiers générés peuvent différer de ceux des fichiers TypeScript sources.

### Les tests ou le contrôle TypeScript échouent

Relever la première erreur significative, identifier le package concerné et corriger la cause avant d’intégrer les changements. Éviter de désactiver un contrôle pour faire passer artificiellement la validation.

### Git signale des modifications inattendues

Utiliser :

```powershell
git status --short
git diff
git diff --cached
```

Ces commandes permettent de distinguer les modifications non indexées, les fichiers indexés et les changements à examiner avant le commit.

## 10. Documentation de référence

Avant d’intervenir sur une fonctionnalité, consulter :

- [`expression_de_besoin.md`](expression_de_besoin.md) : objectifs et exigences du projet.
- [`plan_de_developpement.md`](plan_de_developpement.md) : lots prévus, ordre de réalisation et avancement.
- Le `README.md` et les fichiers `package.json` des packages concernés, lorsqu’ils sont disponibles.

En cas de divergence entre ce guide et la configuration réelle du dépôt, vérifier les scripts, les dépendances et les fichiers de configuration avant de modifier les commandes de référence.

---

**Principe général :** toute contribution doit rester compréhensible, testable et limitée à son périmètre. Le cœur métier doit demeurer indépendant de l’interface desktop, et les changements doivent être examinés avant leur fusion dans `develop`.
