# Licences et conditions de réutilisation des données

**Projet :** Anno 117 Planner
**Version du document :** 1.0
**Statut :** Politique de travail — examen des droits à finaliser
**Dernière mise à jour :** 29 octobre 2026

## 1. Objectif

Ce document définit les principes à appliquer pour examiner les licences et les conditions de réutilisation du code, des données et des ressources utilisés par Anno 117 Planner.

Il vise à éviter toute confusion entre :

- le code développé pour Anno 117 Planner ;
- le code provenant d'outils communautaires ;
- les données techniques extraites ou reconstituées à partir de sources communautaires ;
- les éléments issus du jeu Anno 117: Pax Romana ;
- les textes, images, icônes et autres contenus publiés par des tiers.

La possibilité technique de récupérer ou de transformer une donnée ne constitue pas, à elle seule, une autorisation de la redistribuer.

**Aucune donnée ne doit être considérée comme approuvée pour redistribution tant que les conditions applicables à l'usage envisagé n'ont pas été examinées.**

Ce document définit une procédure de travail. Il ne constitue pas un avis juridique ni une conclusion définitive sur les droits applicables à chaque élément du catalogue.

## 2. Principes généraux

### 2.1 Séparer le code et les données

La licence du code source d'un outil ne s'applique pas automatiquement à tous les contenus utilisés par cet outil.

Par exemple, un projet communautaire peut distribuer son code sous licence MIT tout en indiquant explicitement que les ressources issues du jeu, les icônes, les images, les noms ou les valeurs associées restent soumis à des droits distincts.

Il faut donc examiner séparément :

1. le code du projet d'origine ;
2. les fichiers de données du projet d'origine ;
3. les éléments du jeu reproduits dans ces fichiers ;
4. les ressources tierces éventuellement incorporées ;
5. les transformations réalisées par Anno 117 Planner.

### 2.2 Distinguer accès public et droit de réutilisation

Une page web, un dépôt public ou un fichier accessible sans authentification n'est pas nécessairement librement réutilisable.

Avant toute intégration, il faut identifier les conditions de licence ou d'utilisation applicables et déterminer si elles couvrent l'usage envisagé.

En l'absence d'information suffisante, le statut doit rester **à examiner**. L'absence de restriction visible ne doit pas être interprétée automatiquement comme une autorisation.

### 2.3 Évaluer l'usage envisagé

L'examen doit tenir compte de l'usage réel des données :

- utilisation locale pendant le développement ;
- conservation de données dans le dépôt ;
- publication du catalogue dans un dépôt public ;
- distribution de l'application avec les données intégrées ;
- affichage de noms, descriptions ou icônes dans l'interface ;
- utilisation de données transformées ou dérivées.

Ces usages peuvent soulever des questions différentes. Une autorisation pour l'un ne doit pas être supposée couvrir les autres.

### 2.4 Conserver la provenance

Toute donnée intégrée doit être accompagnée d'une provenance identifiable.

La provenance ne remplace pas une autorisation, mais elle permet de comprendre l'origine du contenu, de retrouver les conditions applicables et de justifier les décisions prises.

Les informations attendues sont définies dans `docs/data-sources.md`.

## 3. Catégories de contenu

### 3.1 Code propre au projet

Le code développé spécifiquement pour Anno 117 Planner est distinct du catalogue de données.

Le README du projet indique actuellement « All rights reserved ».

Cette indication doit être vérifiée dans le dépôt et maintenue cohérente avec les éventuels fichiers de licence. La licence du code ne doit pas être interprétée comme une licence applicable aux éléments du jeu.

Aucune modification de la licence du code n'est prévue par le présent document.

### 3.2 Code provenant d'outils communautaires

Pour tout outil communautaire utilisé comme référence, il faut examiner :

- le fichier de licence du dépôt ;
- la version du code effectivement consultée ;
- les éventuelles mentions de tiers ;
- les conditions associées aux fichiers de données ;
- les éventuelles exclusions ou restrictions figurant dans la documentation.

Une licence permissive, telle que MIT, peut autoriser certaines utilisations du code sous réserve de ses conditions. Elle ne doit pas être considérée comme une autorisation générale de réutiliser tous les contenus présents dans le dépôt.

Si du code est effectivement repris dans Anno 117 Planner, les obligations correspondantes devront être respectées et documentées. La simple consultation d'un projet comme référence ne signifie pas nécessairement que son code a été incorporé.

### 3.3 Données techniques communautaires

Les données communautaires peuvent inclure :

- des identifiants ;
- des noms de biens et de bâtiments ;
- des recettes de production ;
- des durées de cycle ;
- des taux de consommation ;
- des relations entre bâtiments, besoins et biens ;
- des classifications et métadonnées.

Le statut juridique de ces informations ne doit pas être déduit uniquement de la licence du programme qui les expose.

L'examen doit distinguer, dans la mesure du possible :

- les informations factuelles ;
- les structures et compilations de données ;
- les descriptions et contenus rédactionnels ;
- les éléments repris directement du jeu ;
- les créations ou annotations propres à la communauté.

Le traitement applicable peut varier selon la nature des éléments, leur origine, la juridiction concernée et les conditions d'utilisation de la source.

### 3.4 Éléments provenant d'Ubisoft et du jeu

Les éléments liés à Anno 117 peuvent notamment comprendre :

- les noms et désignations des biens ;
- les noms des bâtiments ;
- les recettes et valeurs d'équilibrage ;
- les identifiants issus des fichiers du jeu ;
- les icônes et images ;
- les descriptions et textes d'interface ;
- les autres ressources reproduisant le contenu du jeu.

Ces éléments doivent faire l'objet d'un examen distinct des licences du code communautaire.

Le fait qu'un outil communautaire les utilise ou les publie ne démontre pas, à lui seul, que leur redistribution est autorisée dans un autre projet.

Tant que les conditions applicables ne sont pas établies, leur intégration dans un catalogue redistribué doit rester en attente.

### 3.5 Contenus publiés sous licence documentaire

Certaines sources communautaires, notamment des wikis, peuvent publier leur contenu sous une licence documentaire telle que la GNU Free Documentation License (GFDL).

Il faut vérifier :

- les pages et contenus réellement couverts ;
- la version de la licence applicable ;
- les éventuelles exceptions ;
- la portée de la licence sur les contributions et les éléments tiers ;
- les obligations de conservation des mentions, d'attribution ou de redistribution.

Une licence appliquée au contenu d'un wiki ne doit pas être interprétée comme une autorisation générale de redistribuer les éléments Ubisoft éventuellement reproduits sur ce wiki.

## 4. Sources identifiées et statut de l'examen

| Source | Objet de l'examen | Statut actuel |
|---|---|---|
| [Anno Union](https://www.anno-union.com/getting-started-in-anno-117-pax-romana/) | Guide officiel et règles du jeu | Conditions de réutilisation à vérifier pour tout contenu repris |
| [Ubisoft News](https://news.ubisoft.com/en-gb/article/4fvALjiPTxYODChSgRb1Mk/anno-117-pax-romana-5-tips-for-getting-started) | Contenu rédactionnel officiel | Conditions de réutilisation à vérifier |
| [Anno Companion — Goods](https://anno-companion.com/wiki/117/goods) | Informations descriptives sur les biens | Licence et portée exacte à examiner |
| [Anno Companion — Fertilities and Lodes](https://anno-companion.com/wiki/117/fertilities_and_lodes) | Informations sur les fertilités et gisements | Licence et portée exacte à examiner |
| [Anno 117 Tools](https://anno117.tools/) | Catalogue et données communautaires | Conditions applicables aux données à établir |
| [anno-mods/anno-117-calculator](https://github.com/anno-mods/anno-117-calculator) | Code et données du calculateur communautaire | Examiner séparément le code, les données et les mentions de tiers |
| [Licence du calculateur communautaire](https://github.com/anno-mods/anno-117-calculator/blob/main/LICENSE) | Licence du code et réserves sur les actifs tiers | Analyse à finaliser sur la version exacte |
| [Dépôt Anno 117 Planner](https://github.com/Claude-Ca/anno117-planner) | Code propre au projet et documentation | Vérifier la cohérence des mentions de licence du projet |

Ce tableau constitue un registre initial, et non une validation juridique de chacune des sources.

## 5. Politique d'intégration des données

### 5.1 Conditions préalables

Avant qu'un lot de données puisse être intégré dans le dépôt, les points suivants doivent être examinés :

- sa provenance exacte ;
- la version de la source ;
- son appartenance au périmètre fonctionnel V1 ;
- sa cohérence technique ;
- les transformations effectuées ;
- les conditions de réutilisation applicables ;
- les obligations d'attribution ou de conservation des mentions ;
- les restrictions éventuelles concernant la redistribution.

Une validation technique ne remplace pas l'examen des droits.

### 5.2 Statuts de décision

Chaque source ou lot de données doit disposer d'un statut explicite :

- **À examiner :** les informations disponibles sont insuffisantes pour décider.
- **En cours de validation :** l'examen technique ou documentaire est engagé.
- **Accepté pour l'usage défini :** les contrôles requis ont été effectués et les conditions applicables ont été examinées pour cet usage précis.
- **Accepté avec réserves :** l'utilisation est limitée à un périmètre documenté, sous réserve de conditions explicites.
- **Exclu :** la donnée n'est pas intégrée, avec une justification documentée.

Le statut doit préciser l'usage évalué. Une source acceptée pour une consultation interne ne doit pas être considérée automatiquement comme autorisée à être intégrée dans une application distribuée.

### 5.3 Gestion des incertitudes

Lorsqu'un élément soulève une question de droits non résolue :

1. ne pas le marquer comme libre de réutilisation ;
2. consigner la source et la question en suspens ;
3. rechercher les conditions applicables ;
4. exclure provisoirement l'élément du lot destiné à la redistribution ;
5. soumettre le cas à une décision documentée.

L'incertitude ne doit pas être masquée par une transformation technique ou par une nouvelle structure de données.

## 6. Attribution et mentions de tiers

Lorsque les conditions applicables l'exigent, les mentions d'attribution, notices de licence et références aux auteurs doivent être conservées.

Pour chaque source intégrée, il convient de déterminer :

- si une attribution est requise ;
- si le texte d'une licence doit être distribué ;
- si les mentions de copyright doivent être conservées ;
- si des restrictions s'appliquent aux œuvres dérivées ou à la redistribution ;
- si une mention de non-affiliation est nécessaire ou pertinente.

Les mentions de tiers doivent être regroupées dans un emplacement adapté, par exemple un fichier de notices de tiers, si cela correspond aux obligations effectivement identifiées.

Aucune attribution ne doit laisser entendre qu'Ubisoft approuve ou soutient Anno 117 Planner sans fondement explicite.

## 7. Licence du catalogue et licence du projet

Le choix d'une licence pour le code du projet et celui d'une licence pour le catalogue sont deux décisions distinctes.

Le projet ne doit pas annoncer que le catalogue complet est placé sous une licence libre si certains éléments sont soumis à des droits tiers ou si leur statut n'est pas établi.

Avant de publier une licence pour le catalogue, il faut déterminer :

- quels éléments ont été créés spécifiquement pour le projet ;
- quels éléments proviennent de sources tierces ;
- quelles conditions s'appliquent aux données transformées ;
- quels éléments doivent être exclus de la distribution ;
- si une licence unique est appropriée ou si plusieurs catégories doivent être traitées séparément.

Le présent document ne choisit ni n'accorde de licence nouvelle aux données du jeu.

## 8. Liste de contrôle avant publication

Avant toute publication d'un catalogue de données ou d'une application contenant ce catalogue :

- [ ] La provenance de chaque catégorie de données est documentée.
- [ ] Les versions des sources sont identifiées autant que possible.
- [ ] Les licences du code et des données sont examinées séparément.
- [ ] Les mentions de tiers et les réserves des dépôts sources sont prises en compte.
- [ ] Les conditions de réutilisation des contenus issus du jeu ont été examinées.
- [ ] Les obligations d'attribution et de conservation des notices sont identifiées.
- [ ] Les éléments au statut incertain sont exclus de la distribution ou font l'objet d'une décision documentée.
- [ ] Le contenu publié correspond à l'usage effectivement évalué.
- [ ] Les fichiers de licence et les mentions du dépôt sont cohérents.
- [ ] Une décision explicite autorise la publication du lot concerné.

## 9. Actions restantes

Les actions suivantes restent à effectuer :

1. examiner les fichiers de licence des sources communautaires dans leur version exacte ;
2. vérifier les réserves explicites concernant les éléments Ubisoft et les données du jeu ;
3. examiner la portée des licences des wikis et les éventuelles exceptions relatives aux contenus tiers ;
4. déterminer les conditions applicables aux données qui seraient conservées dans le catalogue redistribué ;
5. établir la liste des éléments à exclure si leur statut n'est pas suffisamment clair ;
6. décider si un fichier de notices de tiers est nécessaire et quelles mentions il doit contenir ;
7. vérifier la cohérence entre la politique de données et les mentions de licence du code du projet.

Si une question juridique reste déterminante pour la publication, il conviendra d'obtenir une analyse adaptée avant de redistribuer les données concernées.

## 10. Conclusion

Anno 117 Planner doit maintenir une séparation explicite entre le code du projet, les données communautaires et les éléments provenant du jeu.

Les licences des outils communautaires et des wikis doivent être examinées dans leur contexte exact. Elles ne constituent pas automatiquement une autorisation de redistribuer tous les contenus présents dans leurs dépôts ou leurs pages.

**Statut actuel : examen des droits à finaliser.** Le catalogue ne doit pas être considéré comme autorisé à la redistribution tant que les conditions applicables à son contenu réel et à l'usage prévu n'ont pas été établies.

## 11. Documents associés

- `docs/catalog-scope.md` — périmètre fonctionnel du catalogue.
- `docs/data-catalog-audit.md` — inventaire, contrôles et anomalies.
- `docs/data-sources.md` — sources et provenance des données.
