# Audit du catalogue de données

**Projet :** Anno 117 Planner
**Version du document :** 1.0
**Statut :** Audit en cours — catalogue non validé pour intégration
**Dernière mise à jour :** 29 octobre 2026

## 1. Objectif

Ce document centralise les résultats de l'audit technique du catalogue de données destiné à Anno 117 Planner.

L'audit doit permettre de vérifier :

- la couverture des bâtiments, recettes, biens et besoins du jeu de base ;
- la cohérence des références entre les différentes catégories ;
- l'exclusion des données issues des DLC ;
- l'exactitude et la traçabilité des valeurs numériques ;
- la prise en compte des contraintes de production et de placement ;
- les écarts entre les versions des sources communautaires.

Les résultats présentés ci-dessous correspondent aux inventaires et contrôles déjà rapportés. Les contrôles qui restent à effectuer sont identifiés explicitement.

**Important :** un catalogue peut être cohérent sur le plan technique sans être exhaustif, exact dans toutes ses valeurs ou autorisé à la redistribution.

## 2. Périmètre de l'audit

Conformément à `docs/catalog-scope.md`, le catalogue V1 doit couvrir :

- le jeu de base d'Anno 117: Pax Romana ;
- la région Latium ;
- la région Albion ;
- les données nécessaires au calcul de production et de consommation des habitants.

Sont exclus :

- les données des DLC ;
- les éléments de Worldmap qui ne participent pas à la simulation des colonies ;
- les références orphelines résultant du filtrage ;
- les données dont la signification, la provenance ou l'appartenance au périmètre V1 n'est pas suffisamment établie.

## 3. Sources de données examinées

### 3.1 Catalogue communautaire `params-base.js`

L'inventaire rapporté est le suivant :

| Collection | Nombre d'éléments |
|---|---:|
| `factories` | 140 |
| `products` | 142 |
| `needs` | 77 |
| `residenceBuildings` | 9 |
| `populationLevels` | 9 |
| `workforce` | 9 |
| `fertilities` | 26 |

Ce fichier constitue un candidat pour établir le catalogue du jeu de base.

Cependant, les éléments suivants restent à confirmer :

- l'exhaustivité de chaque collection ;
- la correspondance exacte avec le contenu du jeu de base ;
- l'absence de données DLC résiduelles ;
- la cohérence des valeurs avec une version identifiable du jeu ;
- les conditions de réutilisation des données.

Le suffixe `base` dans le nom du fichier ne constitue pas une preuve suffisante de complétude ou de conformité au périmètre V1.

### 3.2 Catalogue communautaire `params.js`

L'inventaire rapporté est le suivant :

| Collection | Nombre d'éléments |
|---|---:|
| `factories` | 144 |
| `products` | 146 |
| `populationLevels` | 9 |
| `regions` | 3 |

Les trois régions recensées sont :

- Roman / Latium ;
- Celtic / Albion ;
- Meta / Worldmap.

Quatre ajouts ont été identifiés comme liés aux DLC dans cette version :

| Identifiant | Élément | DLC |
|---|---|---|
| `145102` | Good Obsidian | `67902` |
| `145220` | Good Idols | `67902` |
| `145221` | Good Boardgames | `67902` |
| `152719` | Roman Hippodrome, service ou produit | `67903` |

Ces éléments doivent être exclus de la V1, ainsi que les références qui en dépendent.

Leur identification ne suffit pas à démontrer que toutes les données DLC ont été recensées : un contrôle exhaustif des relations entre collections reste nécessaire.

### 3.3 Artefact communautaire version 2.1

Un autre artefact examiné est :

`anno117-community-2.1-c6a6e752.json`

Caractéristiques rapportées :

- taille : 158 607 octets ;
- version annoncée : 2.1 ;
- commit d'origine annoncé : `c6a6e752` ;
- fichier de planification associé : 27 120 octets ;
- fichier `starter-catalog` associé : 842 octets.

Inventaire de cet artefact :

| Élément | Nombre |
|---|---:|
| Produits de référence | 145 |
| Recettes ou usines | 144 |
| Usines avec entrées et sorties | 113 |
| Bâtiments associés à Roman | 71 |
| Bâtiments associés à Celtic | 73 |
| Niveaux de population | 9 |

Les catégories de produits annoncées sont :

| Catégorie | Nombre |
|---|---:|
| Matériaux de construction | 11 |
| Biens économiques | 102 |
| Produits de référence | 32 |
| **Total** | **145** |

Le fichier de planification indique les facteurs suivants :

| Profil | Facteur indiqué |
|---|---:|
| Low | 1,0 |
| Medium | 1,25 |
| High | 1,5 |

La signification exacte de ces facteurs, leur application aux différents besoins et leur correspondance avec les mécanismes du jeu restent à confirmer.

Ces chiffres décrivent cet artefact précis. Ils ne doivent pas être assimilés aux inventaires de `params-base.js` ou de `params.js` sans comparaison des versions et des définitions de chaque catégorie.

## 4. Résultats des contrôles de cohérence

Les résultats suivants ont été rapportés lors de l'audit technique des données source.

| Contrôle | Résultat rapporté | Interprétation |
|---|---:|---|
| Références de produits manquantes dans les flux | 0 | Aucune référence manquante détectée par ce contrôle |
| Références de maintenance classées comme produits | 140 | Classification rapportée |
| Références de maintenance classées comme main-d'œuvre | 140 | Classification rapportée |
| Références de maintenance non résolues | 0 | Aucune référence non résolue détectée par ce contrôle |
| Besoins sans produit associé | 0 | Aucune référence manquante détectée |
| Références de besoins absentes depuis les résidences | 1 | Anomalie à examiner après filtrage DLC |
| Niveaux de population manquants | 0 | Aucune référence manquante détectée |
| Types de main-d'œuvre manquants | 0 | Aucune référence manquante détectée |
| Durées de cycle invalides | 0 | Aucun cycle invalide détecté |
| Quantités de flux invalides | 0 | Aucune quantité invalide détectée |
| Régions inconnues | 0 | Aucune région inconnue détectée |
| Fertilités non résolues | 0 | Aucune référence de fertilité non résolue détectée |

Ces résultats concernent les contrôles exécutés sur les sources examinées. Ils ne constituent pas une validation complète du catalogue final après filtrage V1.

## 5. Anomalies et points particuliers

### 5.1 Référence de besoin liée à un DLC

Une résidence identifiée comme `Roman Celtic 02 Merchants`, GUID `6475`, référence le besoin `145224` avec un taux de consommation de `0.003529`.

Dans le catalogue complet, ce besoin correspond à `Need Roman Celtic Household Idols`. Il est associé au produit `145220`, désigné comme « Statuettes », et au DLC `67902`.

Le besoin et le produit ne figurent pas dans `params-base.js`.

Cette situation est compatible avec un écart de filtrage entre le catalogue complet et le catalogue de base. Elle ne doit pas être considérée automatiquement comme une erreur de la source complète.

**Action requise :**

1. vérifier la référence dans les sources d'origine ;
2. confirmer le rattachement au DLC ;
3. exclure le besoin et le produit du catalogue V1 ;
4. vérifier que la référence de résidence est elle aussi filtrée ;
5. relancer les contrôles de cohérence après filtrage.

Le catalogue final ne doit conserver aucune référence orpheline provenant de cette exclusion.

### 5.2 Taux `needConsumptionRate` nuls

Un premier examen a relevé 55 entrées dont `needConsumptionRate` vaut `null`.

Certaines concernent des services publics ou des merveilles, notamment des entrées associées à `isBuilding: true`.

Une valeur `null` peut indiquer que le taux n'est pas applicable ou qu'il n'est pas renseigné. Elle ne signifie pas nécessairement que la consommation est nulle.

**Action requise :**

- inventorier les 55 entrées ;
- les classer par type de besoin et nature de l'entité ;
- identifier les services, merveilles et besoins consommables ordinaires ;
- déterminer les règles de représentation applicables ;
- documenter les exclusions et les valeurs non applicables.

Aucun remplacement automatique par zéro ne doit être effectué avant cette classification.

### 5.3 Écarts entre versions

Les inventaires des trois sources présentent des différences de nombre et de structure.

Ces écarts peuvent provenir de versions différentes, de périmètres distincts ou de règles de classification différentes.

**Action requise :**

- identifier précisément la version de chaque source ;
- comparer les identifiants plutôt que les seuls nombres ;
- établir la liste des éléments ajoutés, supprimés ou modifiés ;
- expliquer chaque écart significatif ;
- choisir une source de référence par catégorie, si cette décision est justifiée.

Les données provenant de versions différentes ne doivent pas être fusionnées sans traçabilité.

## 6. Contraintes géographiques et de placement

Les sources communautaires recensent des fertilités, des gisements et des contraintes propres à certains bâtiments.

### 6.1 Fertilités relevées

**Latium :**

- Mackerel ;
- Lavender ;
- Resin ;
- Olives ;
- Grapes ;
- Flax ;
- Murex Snails ;
- Sandarac ;
- Oysters ;
- Sturgeon.

**Albion :**

- Barley ;
- Herbs ;
- Dye Plants ;
- Resin ;
- Saltwort ;
- Small Birds ;
- Flax ;
- Beaver ;
- Ponies ;
- Sea Shells.

Ces listes constituent un inventaire de catégories observées. Elles ne démontrent pas que toutes les fertilités sont disponibles sur chaque île.

### 6.2 Gisements relevés

**Latium :**

- Iron Ore ;
- Uncut Marble ;
- Minerals ;
- Gold Ore.

**Albion :**

- Iron Ore ;
- Copper Ore ;
- Silver Ore ;
- Tin Ore ;
- Granite Block.

La présence d'un gisement dans une région ne signifie pas que chaque île possède ce gisement.

### 6.3 Contraintes à vérifier

Les contraintes identifiées comprennent notamment :

- les fertilités nécessaires aux cultures ;
- les surfaces ou conditions requises par certains élevages ;
- le littoral et les fertilités aquatiques ;
- les zones de prairie, forêt ou marais ;
- les emplacements fluviaux ;
- les emplacements miniers en montagne.

**Action requise :**

1. associer les contraintes aux bâtiments concernés ;
2. distinguer les prérequis des bâtiments des ressources disponibles sur une île ;
3. documenter les contraintes qui ne seront pas simulées en V1 ;
4. définir les validations nécessaires lorsqu'un bâtiment est ajouté à une île.

## 7. Limites de l'audit actuel

Les contrôles déjà rapportés portent principalement sur la cohérence référentielle et la validité de certaines valeurs numériques.

Ils ne démontrent pas encore :

- l'exhaustivité de chaque collection ;
- la couverture intégrale des chaînes de production du jeu de base ;
- l'exactitude de tous les taux et cycles par rapport au jeu ;
- l'absence de toute donnée DLC dans toutes les relations ;
- la bonne classification de tous les besoins, services et merveilles ;
- la prise en compte complète des contraintes géographiques ;
- la compatibilité juridique de la réutilisation ou de la redistribution.

Ces limites doivent être levées ou explicitement acceptées avant de déclarer le catalogue prêt à intégrer.

## 8. Plan d'action de l'audit

### Phase A — Stabiliser les sources

- [ ] Enregistrer la version et le commit de chaque source.
- [ ] Conserver les fichiers sources et leurs empreintes lorsque cela est possible.
- [ ] Documenter le périmètre annoncé de chaque source.
- [ ] Définir la source de référence pour chaque catégorie de données.

### Phase B — Vérifier la couverture

- [ ] Comparer les identifiants de bâtiments entre les sources.
- [ ] Comparer les recettes et leurs entrées/sorties.
- [ ] Comparer les biens et leurs catégories.
- [ ] Comparer les besoins, résidences et niveaux de population.
- [ ] Comparer les données de main-d'œuvre et d'entretien.
- [ ] Examiner les fertilités, gisements et contraintes de placement.
- [ ] Justifier les écarts détectés.

### Phase C — Filtrer le périmètre V1

- [ ] Exclure les données DLC.
- [ ] Exclure les données hors périmètre Worldmap.
- [ ] Vérifier les références indirectes vers les données exclues.
- [ ] Relancer tous les contrôles de cohérence après filtrage.

### Phase D — Valider les valeurs

- [ ] Vérifier les durées de cycle.
- [ ] Vérifier les quantités d'entrée et de sortie.
- [ ] Vérifier les taux de consommation.
- [ ] Classer les taux absents ou nuls.
- [ ] Vérifier les unités et les facteurs de consommation.
- [ ] Marquer explicitement les valeurs incertaines.

### Phase E — Décider de l'intégration

- [ ] Terminer l'examen de la provenance.
- [ ] Terminer l'examen des conditions de réutilisation.
- [ ] Documenter les limites connues.
- [ ] Soumettre les écarts et décisions ouvertes à validation.
- [ ] Autoriser explicitement l'intégration du catalogue.

## 9. Critères de sortie

L'audit sera considéré comme suffisamment avancé pour une décision d'intégration lorsque :

- la couverture du jeu de base dans les deux régions aura été examinée ;
- les différences entre versions auront été expliquées ;
- les données DLC auront été filtrées dans toutes les collections ;
- les références croisées seront cohérentes après filtrage ;
- les besoins, services et merveilles auront été classés ;
- les valeurs numériques auront été vérifiées ou signalées comme incertaines ;
- les contraintes géographiques seront documentées ;
- la provenance et les conditions de réutilisation seront examinées ;
- une décision explicite aura été prise concernant l'intégration.

## 10. Conclusion

Les sources communautaires examinées fournissent une base utile pour poursuivre l'audit technique. Plusieurs points restent toutefois à traiter : les écarts entre versions, le filtrage des DLC, la classification des besoins non consommables, les contraintes de placement et la vérification de la couverture du catalogue.

**Statut final de ce document : audit en cours.**

Le catalogue n'est pas encore validé pour intégration ou redistribution. Aucun import de données ne doit être considéré comme autorisé sur la seule base des contrôles référentiels déjà réalisés.

## 11. Documents associés

- `docs/catalog-scope.md` — périmètre fonctionnel V1.
- `docs/data-sources.md` — registre des sources et provenance.
- `docs/data-licensing.md` — licences et conditions de réutilisation.
