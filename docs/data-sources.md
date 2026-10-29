# Registre des sources et provenance des données

**Projet :** Anno 117 Planner
**Version du document :** 1.0
**Statut :** Registre initial — sources identifiées, validation incomplète
**Dernière mise à jour :** 29 octobre 2026

## 1. Objectif

Ce document recense les sources utilisées pour étudier et construire le catalogue de données d'Anno 117 Planner.

Il définit les informations à conserver pour assurer la traçabilité des données, comparer les versions disponibles et justifier les décisions prises lors de leur intégration.

Le registre couvre notamment :

- les sources officielles ;
- les outils et catalogues communautaires ;
- les fichiers de données exploités ;
- les versions et références de code utilisées ;
- les transformations appliquées ;
- les contrôles effectués ;
- les réserves concernant la fiabilité, la couverture et les droits de réutilisation.

Ce document est complémentaire de `docs/data-catalog-audit.md`, qui décrit les résultats de l'audit technique.

**La présence d'une source dans ce registre ne signifie pas que ses données sont validées ou autorisées à être redistribuées.**

## 2. Principes de traçabilité

### 2.1 Une provenance identifiable

Chaque source doit pouvoir être identifiée sans ambiguïté.

Dans la mesure du possible, les informations suivantes doivent être conservées :

- identifiant interne de la source ;
- titre et éditeur ou auteur ;
- URL d'origine ;
- date de consultation ;
- version, date de publication ou commit ;
- nom du fichier utilisé ;
- empreinte du fichier lorsque cela est pertinent ;
- périmètre de données couvert ;
- conditions de réutilisation connues ;
- statut de validation.

Lorsqu'une information n'est pas disponible, elle doit être indiquée comme inconnue ou non vérifiée. Elle ne doit pas être inventée.

### 2.2 Distinguer les sources selon leur usage

Les sources peuvent remplir des fonctions différentes :

- **Source officielle :** documente les règles du jeu et peut permettre de confirmer certains comportements.
- **Source communautaire descriptive :** présente des informations sur les biens, bâtiments, besoins ou contraintes du jeu.
- **Source technique :** fournit des structures de données, identifiants, recettes ou valeurs numériques.
- **Source de recoupement :** permet de comparer une valeur ou une règle avec une autre source.

Une source peut appartenir à plusieurs catégories, mais son rôle doit être explicite.

### 2.3 Ne pas confondre provenance et validation

Trois questions doivent être examinées séparément :

1. D'où provient la donnée ?
2. La donnée est-elle techniquement cohérente et suffisamment exacte pour être utilisée ?
3. Les conditions de réutilisation permettent-elles l'usage envisagé ?

Une réponse positive à l'une de ces questions ne préjuge pas des deux autres.

### 2.4 Conserver les versions

Lorsqu'un catalogue communautaire évolue, l'audit doit pouvoir retrouver la version effectivement examinée.

Pour un dépôt Git, conserver le commit précis si celui-ci est disponible. Pour un fichier téléchargé, conserver le nom, la date de récupération et, si possible, une empreinte SHA-256.

Une URL pointant vers la branche principale d'un dépôt ne suffit pas à identifier durablement une version.

## 3. Registre initial des sources

Les sources suivantes ont été identifiées pendant l'audit. Les dates d'accès et les versions exactes qui n'ont pas été établies restent à compléter.

| ID | Source | Type | Utilisation prévue | Statut |
|---|---|---|---|---|
| SRC-001 | [Anno Union — Getting Started in Anno 117: Pax Romana](https://www.anno-union.com/getting-started-in-anno-117-pax-romana/) | Officielle | Règles générales, progression de population et contraintes de production | Source identifiée ; recoupement à poursuivre |
| SRC-002 | [Ubisoft News — 5 tips for getting started](https://news.ubisoft.com/en-gb/article/4fvALjiPTxYODChSgRb1Mk/anno-117-pax-romana-5-tips-for-getting-started) | Officielle | Recoupement de règles de jeu et conseils | Source identifiée ; recoupement à poursuivre |
| SRC-003 | [Anno Companion — Goods](https://anno-companion.com/wiki/117/goods) | Communautaire descriptive | Classification des biens et de leurs usages | Source identifiée ; conditions de réutilisation à examiner |
| SRC-004 | [Anno Companion — Fertilities and Lodes](https://anno-companion.com/wiki/117/fertilities_and_lodes) | Communautaire descriptive | Fertilités, gisements et contraintes géographiques | Source identifiée ; couverture à vérifier |
| SRC-005 | [Anno 117 Tools](https://anno117.tools/) | Outil communautaire | Comparaison du catalogue et inventaire des éléments | Source identifiée ; périmètre exact à vérifier |
| SRC-006 | [Anno 117 Tools — Production buildings](https://anno117.tools/buildings/groups/production-buildings) | Outil communautaire | Recoupement des bâtiments de production | Source identifiée ; version et couverture à vérifier |
| SRC-007 | [anno-mods/anno-117-calculator](https://github.com/anno-mods/anno-117-calculator) | Dépôt communautaire | Structure des données et comparaison des recettes | Source identifiée ; commit de référence à consigner |
| SRC-008 | [Licence du calculateur communautaire](https://github.com/anno-mods/anno-117-calculator/blob/main/LICENSE) | Document de licence | Examiner les conditions applicables au code et les réserves sur les éléments tiers | Analyse juridique à compléter |
| SRC-009 | [Guide communautaire Steam — chaînes de production](https://steamcommunity.com/sharedfiles/filedetails/?id=3607540019) | Communautaire descriptive | Recoupement secondaire des chaînes de production | Source identifiée ; actualité et couverture à vérifier |
| SRC-010 | [Dépôt Anno 117 Planner](https://github.com/Claude-Ca/anno117-planner) | Dépôt du projet | Documentation des décisions et de la structure du projet | Source interne au projet ; ne constitue pas une source de droits sur les données du jeu |

Ce registre est initial. Il devra être complété avec les références exactes des fichiers utilisés, les dates de consultation et les versions réellement retenues.

## 4. Fichiers de données communautaires examinés

### 4.1 `params-base.js`

**Source :** catalogue communautaire associé au calculateur Anno 117.
**Fichier :** `params-base.js`.
**Version exacte :** à confirmer.
**Commit d'origine :** à confirmer.
**Date de consultation :** à compléter.

Collections recensées :

- `factories` : 140 éléments ;
- `products` : 142 éléments ;
- `needs` : 77 éléments ;
- `residenceBuildings` : 9 éléments ;
- `populationLevels` : 9 éléments ;
- `workforce` : 9 éléments ;
- `fertilities` : 26 éléments.

**Usage envisagé :** source candidate pour la constitution du catalogue du jeu de base.

**Réserves :**

- la couverture complète du jeu de base n'est pas démontrée ;
- les différences avec les autres versions doivent être expliquées ;
- l'exclusion de toutes les données DLC doit être vérifiée ;
- les conditions de réutilisation doivent être examinées avant toute redistribution.

### 4.2 `params.js`

**Source :** catalogue communautaire associé au calculateur Anno 117.
**Fichier :** `params.js`.
**Version exacte :** à confirmer.
**Commit d'origine :** à confirmer.
**Date de consultation :** à compléter.

Collections recensées :

- `factories` : 144 éléments ;
- `products` : 146 éléments ;
- `populationLevels` : 9 éléments ;
- `regions` : 3 éléments.

Quatre éléments ont été identifiés comme associés aux DLC dans cette version :

- `145102` — Good Obsidian, DLC `67902` ;
- `145220` — Good Idols, DLC `67902` ;
- `145221` — Good Boardgames, DLC `67902` ;
- `152719` — Roman Hippodrome, DLC `67903`.

**Usage envisagé :** comparaison avec `params-base.js` pour repérer les différences de couverture et les dépendances aux DLC.

**Réserves :**

- le fichier complet ne constitue pas directement le catalogue cible de la V1 ;
- toutes les dépendances vers les éléments DLC doivent être recensées ;
- les valeurs et la couverture doivent être comparées à une version de référence.

### 4.3 Artefact `anno117-community-2.1-c6a6e752.json`

**Nom :** `anno117-community-2.1-c6a6e752.json`.
**Taille rapportée :** 158 607 octets.
**Version annoncée :** 2.1.
**Commit d'origine annoncé :** `c6a6e752`.
**Date de consultation :** à compléter.

Fichiers associés recensés :

- fichier de planification : 27 120 octets ;
- `starter-catalog` : 842 octets.

Inventaire rapporté :

- 145 produits de référence ;
- 144 recettes ou usines ;
- 113 usines avec entrées et sorties ;
- 144 bâtiments ;
- 9 niveaux de population.

**Usage envisagé :** comparaison des inventaires, des recettes et des facteurs de consommation avec les autres sources.

**Réserves :**

- cet artefact correspond à une version précise du calculateur communautaire ;
- son inventaire ne doit pas être fusionné directement avec les données des autres fichiers ;
- les facteurs de planification Low, Medium et High doivent être interprétés et vérifiés avant utilisation.

Les chemins d'origine, la version du dépôt et les empreintes de ces fichiers doivent être ajoutés dès qu'ils sont disponibles.

## 5. Règles d'attribution des données

Chaque lot de données intégré au catalogue doit pouvoir être relié à une ou plusieurs sources.

Lorsque plusieurs sources ont été utilisées, leur rôle doit être explicité :

- source initiale ;
- source de confirmation ;
- source de recoupement ;
- source utilisée pour résoudre un écart.

Une donnée dérivée doit également conserver la provenance des données dont elle dépend.

Par exemple, une recette calculée à partir d'une quantité de sortie et d'une durée de cycle doit référencer les informations sources utilisées pour déterminer ces deux valeurs.

Les transformations appliquées doivent être documentées : conversion d'unités, normalisation des identifiants, filtrage DLC ou adaptation au modèle interne.

Aucune transformation ne doit effacer silencieusement une incertitude ou une différence entre les sources.

## 6. Schéma minimal du registre de provenance

Le registre pourra évoluer vers un format structuré. Le schéma conceptuel minimal est le suivant :

| Champ | Description |
|---|---|
| `id` | Identifiant interne stable de la source |
| `title` | Titre de la source |
| `url` | URL d'origine |
| `accessedAt` | Date de consultation |
| `version` | Version, publication ou commit, si disponible |
| `fileName` | Nom du fichier utilisé, si applicable |
| `sha256` | Empreinte du fichier, si disponible |
| `scope` | Catégories de données et périmètre couverts |
| `usage` | Rôle de la source dans le projet |
| `licenseStatus` | État de l'examen des conditions de réutilisation |
| `validationStatus` | État de validation technique |
| `notes` | Réserves, écarts et décisions associées |

Ce tableau décrit les informations à conserver. Il ne constitue pas une modification du modèle TypeScript existant.

Le schéma final devra rester compatible avec les types effectivement retenus dans `packages/game-data`.

## 7. Statuts de validation recommandés

Les statuts suivants sont recommandés pour le suivi des sources et des lots de données :

- **Identifiée** : source repérée, mais pas encore examinée en détail.
- **Examinée** : contenu consulté et usage envisagé documenté.
- **Vérifiée techniquement** : références et valeurs contrôlées dans le périmètre des tests exécutés.
- **À confirmer** : information incomplète, contradictoire ou insuffisamment étayée.
- **Acceptée pour intégration** : couverture et cohérence validées, provenance conservée et conditions de réutilisation examinées pour l'usage envisagé.
- **Exclue** : source ou données écartées du catalogue, avec justification.

Ces statuts ne doivent pas être interprétés comme des conclusions juridiques définitives. Une source techniquement vérifiée peut rester exclue si les conditions de réutilisation ne permettent pas l'usage prévu.

## 8. Actions restantes

### Priorité 1 — Identification des versions

- [ ] Retrouver le dépôt et le commit exacts des fichiers `params-base.js` et `params.js`.
- [ ] Consigner les dates de consultation.
- [ ] Identifier l'origine exacte des fichiers JSON communautaires examinés.
- [ ] Calculer et conserver les empreintes des fichiers sources disponibles localement.

### Priorité 2 — Couverture et recoupement

- [ ] Comparer les identifiants entre les différentes versions.
- [ ] Documenter les ajouts, suppressions et changements de valeurs.
- [ ] Identifier la source de référence pour chaque catégorie.
- [ ] Conserver les sources de confirmation utilisées pour les valeurs sensibles.

### Priorité 3 — Traçabilité des données

- [ ] Associer les bâtiments et recettes à leurs sources.
- [ ] Associer les biens et besoins à leurs sources.
- [ ] Associer les résidences et niveaux de population à leurs sources.
- [ ] Documenter les conversions et transformations appliquées.
- [ ] Conserver les incertitudes et les décisions prises.

### Priorité 4 — Conditions de réutilisation

- [ ] Examiner les licences des dépôts et outils communautaires.
- [ ] Distinguer les licences du code des droits sur les éléments du jeu.
- [ ] Documenter les restrictions et réserves éventuelles.
- [ ] Exclure les données pour lesquelles les conditions de réutilisation ne sont pas établies ou compatibles avec l'usage prévu.

## 9. Critères de validation

Le registre sera considéré comme suffisamment complet pour accompagner une intégration lorsque :

- chaque source utilisée est identifiable ;
- la version effectivement examinée est consignée lorsque cette information est disponible ;
- les données intégrées sont traçables jusqu'à leur source ;
- les transformations et conversions sont documentées ;
- les écarts entre sources sont expliqués ;
- les incertitudes sont explicites ;
- les conditions de réutilisation ont été examinées séparément de la validation technique.

## 10. Conclusion

Plusieurs sources officielles et communautaires ont été identifiées pour soutenir la construction du catalogue d'Anno 117 Planner.

Leur rôle, leur couverture et leur version doivent toutefois être précisés avant de pouvoir considérer le registre comme complet. Les données de sources différentes ne doivent pas être fusionnées sans justification et sans traçabilité.

**Statut actuel : registre initial, à compléter.** L'inscription d'une source dans ce document n'autorise pas, à elle seule, l'intégration ou la redistribution de ses données.

## 11. Document associé

- `docs/catalog-scope.md` — périmètre fonctionnel du catalogue.
- `docs/data-catalog-audit.md` — résultats de l'audit technique.
- `docs/data-licensing.md` — licences et conditions de réutilisation.
