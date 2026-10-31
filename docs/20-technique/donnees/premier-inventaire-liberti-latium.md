# Premier inventaire fonctionnel — démarrage du Latium

**Statut :** inventaire candidat, à confirmer dans le jeu  
**Périmètre :** jeu de base, Latium, premier palier Liberti  
**Lot :** catalogue initial enrichi

## 1. Objectif

Ce lot transforme les premiers éléments identifiés dans les sources officielles en entrées consultables dans le catalogue embarqué. Il ne constitue pas encore un référentiel de production validé.

Les entités intégrées portent le statut `candidate`. Leur présence signifie qu'un élément a été identifié dans une source documentaire ; elle ne signifie ni que toutes ses propriétés sont établies, ni qu'il est autorisé à alimenter le moteur de calcul.

## 2. Éléments recensés

### 2.1 Construction — Timber

La chaîne de démarrage décrite par Ubisoft comprend :

- **Woodcutter** : récolte le Wood dans une zone forestière ;
- **Sawmill** : transforme le Wood en Timber.

Le guide Anno Union indique un cycle de 30 secondes pour chacun des deux bâtiments. Le guide décrit donc une correspondance temporelle 1:1 entre les deux étapes à leur cadence nominale.

**Réserve :** le cycle seul ne suffit pas à déterminer le débit en unités par minute si la quantité produite par cycle n'est pas confirmée. Aucune recette chiffrée n'est donc créée à ce stade.

### 2.2 Besoin Food — Liberti

Les guides officiels identifient deux solutions alimentaires pour les Liberti du Latium :

- **Sardines**, fournies par le **Fishing Hut** ;
- **Porridge**, produit à partir d'Oats via l'**Oat Farm** et le **Porridge Stand**.

Le système de besoins facultatifs permet de choisir une option par catégorie pour accéder à l'amélioration résidentielle. Les deux biens ne doivent donc pas être interprétés comme deux consommations obligatoires simultanées.

### 2.3 Besoin Public Services — Liberti

Les bâtiments **Market** et **Tavern** sont cités comme deux options pour répondre au besoin Public Services.

Ils sont inventoriés comme bâtiments de service, sans créer artificiellement de marchandises ou de flux de consommation.

### 2.4 Besoin Fashion — Liberti

Les guides officiels citent la chaîne **Hemp Farm → Spinner** pour fournir des **Tunics**.

Le **Pileus** constitue une autre option de mode dans les sources secondaires consultées. La dénomination exacte du bâtiment aval et les détails de sa chaîne restent à confirmer en jeu ; ces entrées sont donc explicitement candidates et leur provenance est indiquée.

## 3. Données non intégrées volontairement

Les éléments suivants restent hors des recettes numériques tant que les quantités et unités ne sont pas établies :

- quantité de Wood récoltée par cycle ;
- quantité de Timber produite par cycle ;
- quantité de Sardines produite par cycle ;
- quantités d'Oats et de Porridge par cycle ;
- quantités de Hemp et de Tunics par cycle ;
- débits de consommation par résidence ou par habitant ;
- effets exacts des besoins sur la population et le revenu.

La valeur provisoire de 10 habitants par maison pour les Liberti reste au statut `to-observe` et n'est pas élevée au rang de valeur vérifiée par ce lot.

## 4. Implémentation

Les fichiers `resources.json` et `buildings.json` contiennent les biens et bâtiments identifiés. Chaque entrée conserve :

- un identifiant stable ;
- son statut de validation ;
- une description fonctionnelle concise ;
- les identifiants des sources documentaires du registre.

Les descriptions et références documentaires ne remplacent pas les preuves internes. Le modèle réserve `evidenceIds` aux observations et expérimentations réalisées dans le jeu.

Les recettes restent vides tant que les débits ne sont pas mesurés. Cette séparation empêche qu'une chaîne connue qualitativement soit interprétée comme une recette quantitativement exploitable.

## 5. Sources

- **SRC-001 — Anno Union, Getting started in Anno 117: Pax Romana** : chaîne Woodcutter / Sawmill, cycles de 30 secondes, règles générales de raccordement.
- **SRC-002 — Ubisoft News, Anno 117: Pax Romana – 5 Tips For Getting Started** : paliers Liberti et Waders, besoins Food / Public Services / Fashion, options Sardines / Porridge, Market / Tavern et Tunics.
- **SRC-009 — Guide communautaire Steam, 100% Efficient Production Chains** : piste secondaire pour la chaîne du Pileus et certains noms de bâtiments ; à confirmer et non réutilisée comme preuve interne.

Les sources sont décrites dans `registre-sources-donnees.md`. Leur présence ne vaut pas validation des droits de redistribution des données du jeu.

## 6. Critères de sortie du lot

- [x] Les premières ressources et bâtiments sont visibles dans le catalogue personnel.
- [x] Les descriptions indiquent le rôle connu des éléments.
- [x] Les références documentaires sont conservées au niveau des entités.
- [x] Les données candidates ne sont pas projetées dans le moteur.
- [x] Les données personnelles existantes sont fusionnées avec les nouvelles entrées de référence lors du chargement.
- [ ] Les quantités par cycle sont relevées en jeu.
- [ ] Les débits de consommation et effets des besoins sont mesurés.
- [ ] Les recettes validées sont ajoutées et testées dans le moteur.
