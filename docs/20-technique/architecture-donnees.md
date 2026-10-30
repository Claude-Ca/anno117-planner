# Architecture des données

## Architecture cible et flux d'exécution

```mermaid
flowchart LR
  JSON[Modules JSON versionnés<br/>packages/game-data/catalogs] --> DESK[Desktop<br/>imports locaux Vite]
  DESK --> DE[Data engine<br/>loadGameData]
  DE --> VAL[Validation structurelle<br/>références et preuves]
  VAL --> REPO[DataRepository<br/>snapshot immuable]
  REPO --> PRODUCT[Product<br/>simulateCatalogProduction]
  PRODUCT --> CORE[Core<br/>computeIsland]
  CORE --> RESULT[Rapport de production]
  REPO --> STATUS[Résumé du catalogue<br/>et diagnostics]
```

Le desktop importe les modules JSON à la compilation. Il n'effectue aucun appel réseau ni lecture de fichiers de données à l'exécution. Les données sont transmises à `loadGameData`, qui valide leur structure, construit un snapshot isolé et expose une projection conservatrice au moteur de calcul.

Le cas d'usage `simulateCatalogProduction` reçoit le `DataRepository` validé et transmet sa projection `coreCatalog` au cas d'usage générique `simulateProduction`. Le chargement et la validation ne sont donc pas dupliqués dans la couche applicative.

## Responsabilités

- **`packages/game-data`** : types canoniques, modules JSON, statuts de vérification et règles de validation.
- **`packages/data-engine`** : agrégation des modules, validation bloquante, snapshot immuable et projection vers le contrat de `@anno117/core`.
- **`packages/product`** : orchestration des cas d'usage ; `simulateCatalogProduction` consomme le référentiel validé et délègue le calcul.
- **`packages/core`** : calcul métier, indépendant d'Electron et de React.
- **`apps/desktop`** : chargement des données locales au travers des imports Vite et affichage de l'état du catalogue. Le flux de simulation utilisateur n'est pas encore exposé dans l'IHM.

## Règles de sûreté des données

Seules les ressources, bâtiments, recettes et catégories de population ayant le statut `verified` ou `derived` peuvent entrer dans la projection du moteur. Les éléments `to-observe`, `observed`, `disputed` et `excluded` restent exclus des calculs. Une erreur structurelle bloque le chargement et est affichée dans l'interface.

Les régions Latium et Albion sont présentes comme périmètre de travail, au statut `to-observe`. Elles ne constituent pas une validation des caractéristiques de jeu. Les autres modules sont initialisés mais vides : le catalogue de production doit être établi par observation indépendante.

## État de l'intégration

- [x] Modules JSON locaux et modèle typé.
- [x] Validation structurelle et références internes.
- [x] Agrégation et projection vers le moteur de calcul.
- [x] Chargement du catalogue dans le renderer desktop.
- [x] Affichage du résumé des modules et des erreurs de validation.
- [x] API applicative connectant le référentiel modulaire au moteur (tests locaux à confirmer).
- [x] Build, démarrage et fonctionnement hors ligne du desktop confirmés localement le 30/10/2026.
- [ ] Vérification locale des nouveaux tests et du typecheck après raccordement de `packages/product`.
- [ ] Affichage d'une erreur de validation dans l'IHM.
- [ ] Constitution et validation du catalogue en jeu.

Les statuts ci-dessus distinguent les réalisations présentes dans le dépôt des vérifications locales effectivement rapportées.
