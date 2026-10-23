# Installation de l'environnement de développement

Ce document décrit pas à pas la mise en place d'un poste Windows pour travailler sur ce projet (monorepo TypeScript : `core`, `ui`, `product`). Toutes les commandes se lancent dans **PowerShell**, de préférence dans le terminal intégré de Visual Studio Code (`` Ctrl+` ``).

**Point de départ supposé :** Windows 10 ou 11 avec **Git** déjà installé (Git for Windows, Git Bash, extension Git, etc.). Tout le reste est installé ci-dessous.

## Versions de référence

Versions utilisées lors de la mise en place du projet. Les versions plus récentes de la même branche fonctionnent normalement.

| Outil | Version |
|---|---|
| Git | 2.56.0 |
| fnm | 1.39.0 |
| Node.js (LTS) | 24.22.1 |
| pnpm | 12.15.0 |

La version de Node exacte du projet est fixée par le fichier `.node-version` à la racine du dépôt.

## 1. Visual Studio Code

Si VS Code n'est pas installé :

```powershell
winget install Microsoft.VisualStudioCode
```

Fermez puis rouvrez PowerShell pour que la commande `code` soit reconnue.

## 2. Extensions VS Code

Installation en une seule fois, depuis PowerShell :

```powershell
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension vitest.explorer
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension usernamehw.errorlens
code --install-extension eamodio.gitlens
code --install-extension tauri-apps.tauri-vscode
code --install-extension rust-lang.rust-analyzer
```

| Extension | Rôle |
|---|---|
| ESLint | Détection d'erreurs dans le code |
| Prettier | Mise en forme automatique |
| Vitest | Lancer et déboguer les tests depuis l'éditeur |
| ES7+ React/Redux snippets | Raccourcis pour les composants React |
| Error Lens | Affiche les erreurs directement sur la ligne concernée |
| GitLens | Historique Git annoté (facultatif) |
| Tauri | Support du module `product` |
| rust-analyzer | Support du module `product` |

Si un identifiant est refusé, installez l'extension par son nom depuis le panneau Extensions de VS Code (`Ctrl+Shift+X`).

## 3. fnm (gestionnaire de versions de Node)

fnm installe Node dans le profil utilisateur, permet de changer de version par projet et se désinstalle proprement. Il est préféré à une installation directe de Node et à Docker (voir la section « Pourquoi pas Docker » en fin de document).

### 3.1 Installer fnm

```powershell
winget install Schniz.fnm
```

Fermez puis rouvrez le terminal, et vérifiez :

```powershell
fnm --version
```

### 3.2 Autoriser les scripts de profil PowerShell

Sans cela, PowerShell refuse de charger votre profil :

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 3.3 Activer fnm dans PowerShell

Cette étape est indispensable : sans elle, fnm installe Node mais le terminal ne le trouve pas.

```powershell
# Crée le fichier de profil s'il n'existe pas
if (!(Test-Path $PROFILE)) { New-Item -Path $PROFILE -ItemType File -Force }

# Ajoute la ligne d'initialisation de fnm (une seule fois)
$line = 'fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression'
if (-not (Select-String -Path $PROFILE -SimpleMatch $line -Quiet)) { Add-Content $PROFILE $line }
```

L'option `--use-on-cd` fait basculer automatiquement la version de Node quand vous entrez dans un dossier contenant un fichier `.node-version`.

Chargez fnm immédiatement dans la session en cours, sans attendre un nouveau terminal :

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

## 4. Node.js

```powershell
fnm install --lts
fnm default lts-latest
fnm use lts-latest
```

Vérification :

```powershell
node -v
npm -v
```

> Dans le dépôt du projet, `fnm install` (sans argument) installe directement la version indiquée dans `.node-version`.

## 5. pnpm (gestionnaire de paquets)

pnpm gère les workspaces du monorepo et partage un cache de paquets entre projets.

```powershell
npm install -g pnpm
pnpm -v
```

Deux messages peuvent apparaître et sont sans gravité :

- `npm warn install-scripts ... pnpm` : si pnpm répond à `pnpm -v`, rien à faire. En cas de comportement anormal, relancez `npm install -g --allow-scripts=pnpm`.
- « New major version of npm available » : la mise à jour de npm n'est pas nécessaire.

## 6. Rust et outils C++ (uniquement pour le module `product`)

Cette étape n'est **pas nécessaire** pour travailler sur `core` et `ui`, qui s'exécutent dans le navigateur. Elle ne devient utile qu'au moment de construire l'installateur Windows avec Tauri. Vous n'aurez pas à écrire de Rust.

```powershell
winget install Rustlang.Rustup
winget install Microsoft.VisualStudio.2022.BuildTools --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
```

WebView2 est déjà présent sur Windows 11 et sur la plupart des Windows 10 à jour. Les prérequis officiels et leurs éventuelles évolutions sont décrits ici : <https://tauri.app/start/prerequisites/>. Ces commandes n'ont pas encore été validées dans le cadre de ce projet : en cas de difficulté, la documentation de Tauri fait foi.

## 7. Récupérer et lancer le projet

```powershell
git clone <URL_DU_DEPOT> anno117-planner
cd anno117-planner
fnm install
pnpm install
code .
```

## 8. Vérification

Depuis la racine du dépôt :

```powershell
pnpm test
pnpm typecheck
```

Les tests de `core` doivent passer au vert et la vérification de types ne doit signaler aucune erreur.

Contrôle de l'environnement complet :

```powershell
git --version
fnm --version
node -v
pnpm -v
```

## 9. Dépannage

| Symptôme | Cause et solution |
|---|---|
| `error: We can't find the necessary environment variables to replace the Node version` | Le terminal a été ouvert avant la création du profil. Lancez `fnm env --use-on-cd --shell powershell \| Out-String \| Invoke-Expression`, puis `fnm default lts-latest` et `fnm use lts-latest`. |
| `node` introuvable dans un nouveau terminal | Le profil n'est pas chargé. Affichez-le avec `notepad $PROFILE` et vérifiez la présence de la ligne `fnm env`. Ouvrez ensuite un nouveau terminal. |
| Le profil semble correct mais `node` reste introuvable | Windows PowerShell 5 et PowerShell 7 ont chacun leur propre `$PROFILE`. Vérifiez dans la liste déroulante du terminal VS Code quel shell est utilisé, puis refaites la section 3.3 dans celui-ci. |
| « L'exécution de scripts est désactivée sur ce système » | Lancez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, puis rouvrez le terminal. |
| `winget` n'est pas reconnu | Installez ou mettez à jour « Programme d'installation d'application » (App Installer) depuis le Microsoft Store. |
| `code` n'est pas reconnu | Fermez et rouvrez PowerShell après l'installation de VS Code. |
| « Ignored build scripts » après `pnpm install` | Message informatif de pnpm. Les outils du projet (Vitest notamment) fonctionnent sans ces scripts. |

## Pourquoi pas Docker

Docker n'apporte pas d'avantage pour ce projet : l'installateur Windows de Tauri ne peut pas être construit dans un conteneur Linux, le rechargement à chaud de Vite est lent sur un dossier Windows monté, et la couche supplémentaire complique le diagnostic des erreurs. fnm offre l'essentiel de l'isolation. L'installateur Windows sera construit par GitHub Actions sur un runner Windows.

## Annexe : création initiale du squelette

Pour mémoire, commandes utilisées pour initialiser le dépôt (à ne pas rejouer sur un dépôt cloné) :

```powershell
mkdir anno117-planner
cd anno117-planner
git init -b main
Set-Content .node-version "24.22.1"
mkdir packages\core\src, packages\ui, apps\product, data

# Après création des fichiers package.json, tsconfig.json et pnpm-workspace.yaml :
pnpm --filter @anno117/core add -D typescript vitest
```
