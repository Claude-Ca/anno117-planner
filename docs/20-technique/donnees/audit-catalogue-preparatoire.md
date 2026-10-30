# Anno 117 Planner --- cadrage et audit du catalogue

**Statut :** audit préparatoire.\
**Périmètre validé :** jeu de base, Latium et Albion, calcul de
production et de consommation quantifiable.\
**Règle :** aucune modification du code ni intégration des données avant
validation de l'audit et clarification des droits.

## 1. Décisions de périmètre

### Inclus en V1

-   Jeu de base uniquement ; régions jouables Latium et Albion.
-   Planification multi-îles.
-   Biens, recettes, intrants, extrants, durées de cycle et
    consommations quantifiables des résidents.
-   Contraintes géographiques lorsque nécessaires et suffisamment
    documentées.
-   Provenance et statut des données.

### Exclus de la V1

-   DLC et données de la carte du monde.
-   Simulation économique complète, logistique physique, congestion,
    effets complexes, spécialistes, objets et bonus non explicitement
    modélisés.
-   Icônes, textures et images Ubisoft sans autorisation appropriée.

### Extensibilité

Prévoir des métadonnées de région, version, pack de contenu, source et
disponibilité pour permettre l'ajout ultérieur de DLC sans refonte. Ceci
est une cible d'architecture, pas une modification déjà implémentée.

## 2. Axe A --- Couverture du catalogue

### Volumes observés dans `params-base.js`

  Structure                Volume
  ---------------------- --------
  `factories`                 140
  `products`                  142
  `needs`                      77
  `residenceBuildings`          9
  `populationLevels`            9
  `workforce`                   9
  `fertilities`                26

Ces nombres décrivent les tableaux de la source auditée ; ils ne
prouvent pas l'exhaustivité du jeu de base ni l'inclusion pertinente de
chaque entrée.

### Contrôles structurels déjà exécutés

-   Produits absents dans les flux de recettes : **0**.
-   Références d'entretien : **140 produits et 140 références de
    main-d'œuvre**, aucune non résolue.
-   Besoins pointant vers des produits absents : **0**.
-   Niveaux de population et main-d'œuvre absents : **0**.
-   Cycles ou quantités de flux invalides : **0**.
-   Régions inconnues et fertilités non résolues : **0**.

Une référence DLC a été identifiée : la résidence
`Residence Roman Celtic 02 Merchants` référence le besoin `145224`
(Household Idols / Statuettes), présent dans `params.js` avec
`dlcUnlocks: [67902]` mais absent de `params-base.js`. Le catalogue V1
devra exclure ce besoin sans modifier la source tierce.

### À faire

-   Recouper produits et bâtiments avec des sources indépendantes.
-   Classer biens consommables, matières premières, matériaux de
    construction, produits abstraits, services et références non
    stockables.
-   Identifier recettes alternatives, importations et productions
    régionales.
-   Attribuer à chaque entrée un statut : `included`, `excluded-dlc`,
    `out-of-scope` ou `unverified`.

**Critère de sortie :** chaque entrée candidate a une catégorie, une
région, une provenance, un statut de contenu et des références validées.

## 3. Axe B --- Populations et besoins

### Neuf types de population recensés

-   Latium : Liberti, Plebeians, Equites, Patricians.
-   Albion : Waders, Smiths, Aldermen, Mercators, Nobles.

Albion comporte deux branches : Waders → Smiths → Aldermen et Waders →
Mercators → Nobles. Le modèle doit représenter cette bifurcation.

### Catégorisation des besoins

-   **Bien consommable quantifiable** : produit et taux documentés.
-   **Service/bâtiment public** : satisfait par un bâtiment ou une
    couverture de service.
-   **Merveille/bâtiment spécial** : condition distincte à documenter.
-   **Non quantifié / incertain** : non intégré aux calculs de flux
    avant validation.

Les `needConsumptionRate: null` ne doivent pas être convertis
arbitrairement en zéro. Les exemples examinés semblent liés à des
services ou merveilles ; il faut classer systématiquement les 55 valeurs
nulles signalées par le premier audit.

### À faire

-   Construire une matrice résidence × besoin avec catégorie,
    produit/service, taux, unité et source.
-   Vérifier l'unité des taux et leur lien avec les facteurs de
    consommation.
-   Distinguer besoins essentiels et optionnels.
-   Exclure proprement les références DLC.
-   Ne pas traiter les services et merveilles comme des biens
    consommables.

**Critère de sortie :** tout besoin quantifié inclus a une unité, un
produit, un niveau de population, une catégorie et une provenance
documentés.

## 4. Axe C --- Recettes et contraintes de production

Pour chaque recette, inventorier : bâtiment, durée et unité du cycle,
intrants, extrants, carburant éventuel, région, déblocage, contraintes
géographiques, statut base/DLC et source.

Les sources officielles indiquent que les bâtiments nécessitent
notamment routes, main-d'œuvre et accès à un entrepôt ; certaines
productions d'Albion sont liées aux marais. Ces contraintes doivent être
distinguées des calculs de flux théoriques.

Le moteur actuel calcule les flux théoriques ; il ne simule pas
entièrement l'arrêt en cascade des chaînes en manque d'intrants, le
placement, les routes, le transport ni la congestion. La documentation
doit le dire explicitement.

### À faire

-   Vérifier les liens réciproques bâtiment/recette.
-   Auditer les recettes alternatives et les recettes sans intrants.
-   Recouper durées et quantités avec une source indépendante quand
    possible.
-   Classer fertilités, gisements, côtes, marais, forêts et emplacements
    spéciaux.
-   Distinguer production locale et importation.
-   Définir la productivité de référence (par défaut 100 %, sans bonus).

**Critère de sortie :** chaque recette incluse possède un cycle valide,
des flux valides, un bâtiment, une région, un statut de contenu et des
prérequis documentés.

## 5. Axe D --- Provenance et licences

### Sources de travail

1.  Documentation officielle Anno Union / Ubisoft pour les mécaniques.
2.  Anno Companion pour biens, fertilités et gisements.
3.  Anno 117 Tools pour le recoupement des biens et bâtiments.
4.  `anno-mods/anno-117-calculator` comme référence technique à auditer.
5.  Guides communautaires comme sources de recoupement, avec
    version/date.

### Règles

-   La licence MIT du code du calculateur communautaire ne constitue pas
    une autorisation générale de redistribuer les noms, valeurs
    d'équilibrage, icônes ou autres éléments Ubisoft.
-   Ne pas copier le catalogue communautaire dans le dépôt.
-   Ne pas intégrer d'icônes/images du jeu sans autorisation.
-   Renommer les champs, modifier les identifiants ou convertir un JSON
    ne constitue pas une reconstruction indépendante.
-   Tenir un registre par ensemble : URL, date d'accès, version/commit,
    données consultées, méthode de vérification, statut des droits et
    décision.
-   Si les droits ne sont pas établis, ne pas publier l'ensemble ;
    envisager une collecte indépendante ou demander une autorisation.
-   Une revue juridique est recommandée avant publication si une
    incertitude significative subsiste.

### Documents envisagés

-   `LICENCE.md` : code original, actuellement « Tous droits réservés ».
-   `DATA-LICENSE.md` : statut des données, sans accorder des droits que
    le projet ne possède pas.
-   `THIRD-PARTY-NOTICES.md` : attribution et éléments tiers.

Ne finaliser ces documents qu'après inventaire des données réellement
utilisées.

## 6. Modèle cible --- principes non implémentés

Catalogue indépendant du moteur et de l'interface. Entités envisagées
: - `Source` : URL, titre, version, date d'accès, provenance, statut des
droits. - `Good` : identifiant interne stable, catégorie, région, statut
de contenu, source. - `Building` : fonction, région, recettes,
main-d'œuvre, contraintes. - `Recipe` : bâtiment, cycle, intrants,
extrants, carburant, prérequis, source. - `PopulationTier` / `Residence`
: population, besoins, branches de progression, taux. - `Need` :
catégorie, produit/service, taux, attributs éventuels, mode de
satisfaction. - `IslandConstraint` : fertilité, gisement, contrainte de
placement. - `ContentPack` : jeu de base ou extension.

Les identifiants internes ne doivent pas dépendre des GUID de la source
communautaire. Une correspondance conservée pour audit doit rester
isolée et ne doit pas être interprétée comme une autorisation de
redistribution.

## 7. Plan de travail avant tout changement de code

1.  Axe A : listes inclus/exclus/non vérifiés et écarts de couverture.
2.  Axe B : matrice des neuf résidences et classification des besoins.
3.  Axe C : inventaire des recettes et contraintes, avec unités.
4.  Axe D : registre de provenance et décision de réutilisation pour
    chaque ensemble.
5.  Produire un rapport de couverture final.
6.  Faire valider ce rapport par le propriétaire du projet.
7.  Mettre à jour et faire valider la documentation du dépôt.
8.  Seulement ensuite, implémenter ou modifier catalogue et code, avec
    tests associés.

## 8. Références

-   Anno Union --- Getting started:
    https://www.anno-union.com/getting-started-in-anno-117-pax-romana/
-   Ubisoft News --- 5 tips for getting started (conseils généraux):
    https://news.ubisoft.com/en-gb/article/4fvALjiPTxYODChSgRb1Mk/anno-117-pax-romana-5-tips-for-getting-started
-   Ubisoft News --- Guide d'Albion (particularités régionales):
    https://news.ubisoft.com/en-gb/article/2E5rwI4XBSJFJjUzcBxU2x/anno-117-pax-romana--a-guide-to-albion-part-1
-   Anno Companion --- Goods: https://anno-companion.com/wiki/117/goods
-   Anno Companion --- Fertilities and Lodes:
    https://anno-companion.com/wiki/117/fertilities_and_lodes
-   Anno 117 Tools: https://anno117.tools/
-   Anno 117 Tools --- Production Buildings:
    https://anno117.tools/buildings/groups/production-buildings
-   Calculateur communautaire:
    https://github.com/anno-mods/anno-117-calculator
-   Planner: https://github.com/Claude-Ca/anno117-planner

## 9. Statut global

**Audit en cours --- aucune donnée approuvée pour intégration ou
redistribution.**

Les contrôles structurels réalisés sur `params-base.js` sont
encourageants mais ne prouvent ni l'exhaustivité du jeu de base, ni
l'exactitude de chaque valeur, ni les droits de redistribution. Les
quatre axes et leurs critères de sortie doivent être traités avant toute
intégration.
