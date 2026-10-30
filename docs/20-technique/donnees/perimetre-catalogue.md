# Périmètre du catalogue de données

**Projet :** Anno 117 Planner
**Version du document :** 1.0
**Statut :** périmètre fonctionnel défini, couverture des données en cours de validation
**Dernière mise à jour :** 29 octobre 2026

## 1. Objectif

Ce document définit le périmètre fonctionnel du catalogue de données utilisé par Anno 117 Planner.

Il précise les données nécessaires au calcul de production et de consommation, les exclusions applicables à la première version (V1), les règles de modélisation et les conditions préalables à l'intégration des données dans le projet.

Il constitue la référence pour les travaux d'inventaire, de validation et de structuration du catalogue.

**Ce document ne valide ni l'exhaustivité du catalogue ni les droits de redistribution des données recensées.** Ces deux sujets font l'objet d'audits distincts.

## 2. Périmètre du jeu

### 2.1 Contenus inclus

La V1 couvre exclusivement le jeu de base d'Anno 117: Pax Romana, avec les deux régions jouables suivantes :

- **Latium**
- **Albion**

Les données provenant des extensions et DLC sont exclues du catalogue V1.

### 2.2 Contenus exclus

Sont exclus du périmètre V1 :

- les bâtiments, biens, besoins, recettes et autres contenus propres aux DLC ;
- les éléments de la région Worldmap qui ne participent pas à la simulation des colonies ;
- les données dont l'appartenance au jeu de base ne peut pas être établie ;
- les éléments dont la signification ou les valeurs ne sont pas suffisamment documentées pour être utilisés de manière fiable.

Une donnée incertaine ne doit pas être intégrée par défaut. Elle doit être identifiée comme telle et soumise à vérification.

### 2.3 Évolutivité

L'architecture doit permettre l'ajout ultérieur de contenus sans remettre en cause le moteur de calcul ni le format général du catalogue.

Cette extensibilité ne signifie pas que la V1 doit inclure des données de DLC.

Toute extension future du périmètre devra faire l'objet d'un inventaire, d'une validation technique et d'un examen des conditions de réutilisation applicables.

## 3. Objectifs fonctionnels

Le catalogue doit fournir les informations nécessaires pour calculer :

- la production théorique des bâtiments ;
- les quantités de biens consommées par les habitants ;
- les soldes entre production et consommation ;
- les besoins en main-d'œuvre ;
- les coûts d'entretien lorsqu'ils sont modélisés ;
- les contraintes de production associées aux bâtiments et aux ressources disponibles.

Les calculs doivent pouvoir être effectués sur plusieurs îles.

Le catalogue doit rester indépendant de l'interface graphique et du moteur de calcul. Les données de jeu ne doivent pas être dispersées dans les composants d'interface.

## 4. Catégories de données

### 4.1 Référentiels

Les référentiels regroupent les entités utilisées par plusieurs parties du catalogue :

- régions ;
- biens et ressources ;
- catégories de biens, lorsqu'elles sont utiles au calcul ou à la présentation ;
- types de main-d'œuvre ;
- autres identifiants nécessaires aux relations entre les entités.

Chaque entité doit disposer d'un identifiant stable dans le catalogue.

Les identifiants d'origine peuvent être conservés comme références de provenance, mais ils ne doivent pas être confondus avec les identifiants internes du modèle sans décision explicite.

### 4.2 Bâtiments et recettes de production

Pour chaque bâtiment de production retenu, le catalogue doit permettre d'identifier :

- son nom ;
- sa région d'appartenance ;
- ses recettes ;
- les biens consommés par chaque recette ;
- les biens produits ;
- les quantités d'entrée et de sortie ;
- la durée du cycle de production ;
- les besoins en main-d'œuvre, lorsqu'ils sont applicables ;
- les coûts d'entretien, lorsqu'ils sont applicables ;
- les contraintes de placement ou de ressources connues.

Les données doivent permettre de distinguer un bâtiment de ses recettes. Un bâtiment peut posséder plusieurs recettes ou variantes de production.

Les unités et conventions utilisées pour les durées et les flux doivent être documentées.

### 4.3 Population et résidences

Le catalogue doit représenter les niveaux de population du jeu de base dans les deux régions.

Les données nécessaires comprennent notamment :

- les niveaux de population ;
- les résidences associées ;
- le nombre d'habitants par résidence, lorsque cette valeur est définie ;
- les possibilités de progression entre niveaux ;
- les besoins associés aux différents niveaux ;
- les taux de consommation applicables.

Le modèle doit pouvoir représenter les branches de progression propres à Albion, sans supposer que tous les niveaux suivent une chaîne linéaire unique.

### 4.4 Besoins des habitants

Les besoins doivent être distingués des biens qui les satisfont.

Pour chaque besoin, il convient d'identifier, lorsque l'information est disponible :

- son identifiant ;
- son nom ;
- sa catégorie ;
- le bien ou le service associé ;
- les niveaux de population concernés ;
- le taux de consommation applicable ;
- les éventuelles conditions particulières ;
- la source de l'information.

Tous les besoins disponibles ne doivent pas être considérés automatiquement comme obligatoires.

Le calculateur doit permettre de sélectionner les besoins effectivement satisfaits sur une île. La consommation calculée doit correspondre à cette sélection.

La possibilité de satisfaire des besoins supplémentaires pour obtenir des attributs ou des avantages doit être distinguée des besoins nécessaires à la progression de la population.

Les règles exactes de consommation et de progression devront être confirmées lors de l'audit fonctionnel.

### 4.5 Entretien et main-d'œuvre

Les coûts d'entretien et les besoins en main-d'œuvre doivent être représentés séparément des flux de production.

Le modèle doit permettre de distinguer :

- les biens consommés comme intrants d'une recette ;
- les biens ou ressources associés à l'entretien ;
- les besoins en main-d'œuvre ;
- les valeurs non applicables ou inconnues.

Une valeur absente ne doit pas être interprétée automatiquement comme une valeur nulle.

### 4.6 Contraintes géographiques

Certaines productions dépendent des caractéristiques de l'île ou de l'emplacement du bâtiment.

Le catalogue doit permettre de documenter, selon les données disponibles :

- les fertilités agricoles ;
- les ressources ou gisements miniers ;
- les contraintes de littoral ;
- les zones de marais ;
- les emplacements fluviaux ;
- les emplacements de montagne ;
- les autres contraintes de placement nécessaires à la simulation.

Il convient de distinguer :

1. les prérequis intrinsèques d'un bâtiment ;
2. les ressources disponibles sur une île ;
3. les emplacements effectivement disponibles sur cette île.

La présence d'une recette dans le catalogue ne garantit donc pas que cette recette puisse être utilisée sur toutes les îles.

La V1 devra préciser le niveau de prise en compte de ces contraintes dans les calculs. Une contrainte recensée mais non simulée devra être explicitement signalée.

### 4.7 Services, merveilles et biens particuliers

Les services publics, les merveilles et les biens abstraits doivent être identifiés et classés avant leur intégration.

Ils ne doivent pas être assimilés automatiquement à des biens consommables ordinaires.

Les taux de consommation absents ou nuls doivent être examinés selon la nature de l'entité concernée. Ils ne constituent pas, à eux seuls, une preuve d'absence de consommation.

## 5. Principes de modélisation

### 5.1 Séparation des responsabilités

Le projet distingue trois responsabilités :

- **Catalogue de données :** décrit les entités du jeu et leurs relations.
- **Moteur de calcul :** interprète les données pour effectuer les calculs de production et de consommation.
- **Interface utilisateur :** permet de configurer une simulation et d'en consulter les résultats.

Le catalogue ne doit pas dépendre de l'interface graphique.

### 5.2 Références et intégrité

Chaque référence entre deux entités doit pouvoir être vérifiée.

Les contrôles doivent notamment détecter :

- les identifiants dupliqués ;
- les références à des biens inexistants ;
- les recettes associées à des bâtiments inexistants ;
- les relations incohérentes entre bâtiments et recettes ;
- les besoins associés à des biens inexistants ;
- les résidences faisant référence à des besoins absents ;
- les références à des données exclues du périmètre V1.

Une validation réussie des références ne suffit pas à démontrer que le catalogue est exhaustif.

### 5.3 Valeurs numériques

Les valeurs numériques doivent respecter les règles suivantes :

- les durées de cycle doivent être valides et strictement positives lorsqu'elles sont applicables ;
- les quantités de flux doivent être finies et cohérentes avec leur définition ;
- les unités doivent être documentées ;
- les valeurs absentes, nulles ou non applicables doivent être distinguées ;
- les valeurs incertaines doivent être signalées plutôt que remplacées par des hypothèses silencieuses.

Les règles de validation doivent tenir compte des exceptions propres à chaque catégorie de données.

### 5.4 Provenance

Les données doivent être accompagnées d'une provenance permettant de retrouver leur origine.

Le niveau de traçabilité attendu est décrit dans `docs/data-sources.md`.

Une donnée dont la source ou la version ne peut pas être déterminée doit être identifiée comme non vérifiée.

## 6. Principes de calcul

### 6.1 Production théorique

La production théorique est calculée à partir des recettes, des quantités de sortie et de la durée du cycle, en tenant compte des paramètres de productivité effectivement pris en charge.

La présence d'une recette ne signifie pas que la production correspondante sera effectivement réalisée dans une simulation donnée.

### 6.2 Consommation

La consommation des habitants dépend des niveaux de population, des taux de consommation applicables et des besoins sélectionnés.

Les facteurs de consommation éventuellement proposés par des sources communautaires doivent être vérifiés avant d'être utilisés comme valeurs par défaut.

### 6.3 Limites du modèle

La V1 vise un calculateur de production et de consommation quantifiables, et non une simulation exhaustive de l'économie du jeu.

Les mécanismes non modélisés, tels que les effets d'objets, les événements, le commerce ou les modifications temporaires de productivité, ne doivent pas être présentés comme pris en charge.

Le moteur de calcul doit également distinguer les flux théoriques de recettes des effets réels d'un manque d'intrants. Si l'arrêt ou la réduction de production dû à des intrants manquants n'est pas simulé, cette limite doit être documentée.

## 7. Exclusions et filtrage du catalogue

Le filtrage V1 doit être appliqué de manière cohérente à toutes les catégories de données.

Il ne suffit pas de supprimer les bâtiments explicitement identifiés comme DLC. Il faut également examiner les références indirectes depuis :

- les recettes ;
- les biens ;
- les besoins ;
- les résidences ;
- les niveaux de population ;
- les fertilités et les gisements ;
- les autres entités liées.

Une donnée exclue ne doit pas laisser de référence orpheline dans le catalogue final.

Tout écart détecté après filtrage doit être expliqué et résolu avant la validation du catalogue.

## 8. Conditions préalables à l'intégration

Le catalogue ne peut être déclaré prêt pour intégration que lorsque les conditions suivantes sont remplies :

- [ ] Le périmètre des données est défini et documenté.
- [ ] Les données DLC et les références associées sont exclues.
- [ ] La couverture de Latium et d'Albion a été examinée.
- [ ] Les différences entre les versions des sources ont été expliquées.
- [ ] Les références croisées ont été contrôlées après filtrage.
- [ ] Les besoins, services et merveilles ont été classés.
- [ ] Les valeurs numériques et leurs unités ont été vérifiées ou signalées comme incertaines.
- [ ] Les contraintes géographiques sont documentées et leur prise en compte en V1 est définie.
- [ ] La provenance des données est enregistrée.
- [ ] Les conditions de réutilisation ont été examinées.
- [ ] Une validation explicite autorise l'intégration.

## 9. Documents associés

- `docs/data-catalog-audit.md` — inventaire, résultats de contrôles, anomalies et couverture.
- `docs/data-sources.md` — sources, versions, dates d'accès et provenance.
- `docs/data-licensing.md` — licences, droits et conditions de réutilisation.

Ces documents complètent le présent périmètre. En cas de divergence entre une hypothèse de travail et une donnée vérifiée, l'écart doit être documenté et soumis à décision plutôt que résolu implicitement.

## 10. Statut actuel

Le périmètre fonctionnel V1 est défini au niveau général : jeu de base, Latium et Albion, sans DLC, avec calcul de production et de consommation sur plusieurs îles.

La couverture réelle du catalogue, l'exactitude de toutes les valeurs et les conditions de réutilisation restent à valider.

**Aucune donnée ne doit être considérée comme approuvée pour intégration ou redistribution sur la seule base de ce document.**
