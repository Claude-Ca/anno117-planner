# Matrice de preuves — premier lot de données de population

**Projet :** Anno 117 Planner  
**Version :** 0.1  
**Statut :** Piste de recherche — aucune donnée du catalogue validée  
**Date :** 31 octobre 2026

## 1. Objectif et décision de périmètre

Cette matrice organise le premier lot de recherche visant à débloquer le parcours de planification par nombre de maisons. Elle sépare les faits publiquement documentés, les informations encore à mesurer dans le jeu et les éléments qui ne doivent pas être introduits dans le catalogue embarqué.

La politique du projet exige que les données du catalogue embarqué soient établies par observation directe, expérimentation reproductible ou calcul dérivé de données observées. Les sources externes ci-dessous servent donc à préparer la campagne et à cibler les vérifications ; elles ne constituent pas, à elles seules, des preuves suffisantes pour changer un enregistrement en `verified` ou `derived`.

**Résultat de ce lot documentaire :** aucun enregistrement de population, besoin, taux de consommation ou nombre d'habitants par maison n'est ajouté au catalogue. Les sources officielles consultées identifient les branches de population et les grandes catégories de besoins, mais ne donnent pas une base quantitative complète et reproductible pour le calculateur.

## 2. Sources examinées

| ID | Source | Apport constaté | Limites pour le catalogue |
|---|---|---|---|
| SRC-001 | [Anno Union — Getting started in Anno 117: Pax Romana](https://www.anno-union.com/getting-started-in-anno-117-pax-romana/) | Catégories de besoins, progression des niveaux, exemples de chaînes, temps de cycle de certaines productions et principe de consommation des résidences | Ne constitue pas un inventaire exhaustif des biens, bâtiments et paramètres quantitatifs. Les exemples ne remplacent pas une observation versionnée du jeu. |
| SRC-002 | [Ubisoft News — 5 tips for getting started](https://news.ubisoft.com/en-gb/article/4fvALjiPTxYODChSgRb1Mk/anno-117-pax-romana-5-tips-for-getting-started) | Confirme les résidents de départ Liberti/Waders, les catégories Food/Public Services/Fashion et quelques exemples de biens et services | Guide de démarrage, non exhaustif et insuffisant pour les taux de consommation et habitants par maison. |
| SRC-011 | [Ubisoft News — A guide to Albion, Part 1](https://news.ubisoft.com/en-us/article/2E5rwI4XBSJFJjUzcBxU2x/anno-117-pax-romana-a-guide-to-albion-part-1) | Confirme Waders comme population de départ d'Albion, les options de besoins initiales et les branches Smiths/Mercators | Présentation narrative, non exhaustive ; ne fournit pas les valeurs numériques nécessaires au moteur. |
| SRC-003 | [Anno Companion — Goods](https://anno-companion.com/wiki/117/goods) | Piste communautaire de recoupement des biens | Couverture, version et conditions de réutilisation à vérifier avant tout usage de données. |
| SRC-007 | [anno-mods/anno-117-calculator](https://github.com/anno-mods/anno-117-calculator) | Piste technique communautaire pour comprendre les structures de recettes et de besoins | Version exacte et conditions applicables aux données du jeu à examiner ; ne pas importer directement. |

Les sources officielles sont des sources de recoupement des mécaniques, pas des sources quantitatives exhaustives. Les sources communautaires sont conservées comme pistes d'audit uniquement.

## 3. Population : inventaire de travail à vérifier en jeu

Les noms ci-dessous sont rapportés par les sources officielles consultées. Ils servent à organiser la campagne d'observation et ne sont pas encore des enregistrements du catalogue.

| Région | Palier / branche | Libellé documenté | Statut dans cette matrice | Vérifications requises |
|---|---|---|---|---|
| Latium | 1 | Liberti | À observer | Libellé localisé en jeu, identifiant stable, habitants de base par maison, effets de chaque besoin, conditions de mesure |
| Latium | 2 | Plebeians / Plebeii selon localisation à vérifier | À observer | Libellé exact, habitants par maison, besoins et éventuels effets cumulés |
| Latium | 3 | Equites | À observer | Libellé exact, habitants par maison, besoins et effets cumulés |
| Latium | 4 | Patricians | À observer | Libellé exact, habitants par maison, besoins et effets cumulés |
| Albion | 1 | Waders | À observer | Libellé exact, habitants par maison, options de besoins et effets cumulés |
| Albion | 2, branche celtique | Smiths | À observer | Libellé exact, conditions de branche, habitants par maison, besoins |
| Albion | 2, branche romanisée | Mercators | À observer | Libellé exact, conditions de branche, habitants par maison, besoins |
| Albion | 3, branche celtique | Aldermen | À observer | Libellé exact, habitants par maison, besoins |
| Albion | 3, branche romanisée | Nobles | À observer | Libellé exact, habitants par maison, besoins |

La source officielle Anno Union présente la progression du Latium comme une succession linéaire et Albion comme une progression avec choix entre Smiths et Mercators. Les noms anglais sont conservés ici comme termes de recherche ; les identifiants et libellés de catalogue devront suivre les règles de nommage du projet et les observations du jeu.

## 4. Besoins de population : pistes de vérification

La documentation officielle décrit, pour les résidents de départ, trois catégories de besoins : nourriture, services publics et habillement. Elle indique que plusieurs besoins sont optionnels au sein d'une catégorie et que la satisfaction de besoins peut modifier différents attributs des résidences, dont la population et les revenus.

La documentation officielle indique également que le deuxième palier ajoute une catégorie de besoins domestiques et que les règles de progression s'appuient sur des points de fourniture par catégorie. Ces éléments sont des règles à confirmer dans l'interface du jeu avant modélisation.

| Domaine | Ce qu'indiquent les sources | Mesures nécessaires avant intégration |
|---|---|---|
| Nombre d'habitants par maison | Les résidents occupent des maisons et la satisfaction de besoins peut modifier l'attribut Population | Valeur de base par palier ; effet de chaque besoin ; cumul ou plafonnement ; conditions et modificateurs |
| Consommation de biens | Les besoins de consommation demandent des quantités de biens ; les résidences consomment des biens | Taux par résidence, unité, période, règles de cumul et précision d'affichage |
| Services publics | Certains besoins sont couverts par des bâtiments de service et une portée | Effet exact sur la population et autres attributs ; rayon et conditions de couverture si dans le périmètre |
| Besoins optionnels | Plusieurs options peuvent exister au sein d'une catégorie | Distinguer besoin minimal pour progression et besoins effectivement satisfaits ; ne pas supposer qu'une seule option est toujours suffisante pour le calcul de consommation |
| Paliers supérieurs | Les besoins et les catégories évoluent avec la progression | Inventaire exhaustif en jeu, catégories, points requis et effets quantitatifs |

**Point bloquant pour le calculateur :** le mode choisi par le projet prend le nombre de maisons comme entrée. Il faut donc mesurer une valeur de population reproductible par maison et préciser comment les besoins satisfaits modifient cette valeur. Les sources consultées ne suffisent pas à établir ces valeurs sans ambiguïté.

## 5. Protocole d'observation proposé

Pour chaque palier et région, une observation doit enregistrer :

1. Version/build du jeu, langue et date.
2. Région et palier exacts tels qu'affichés dans l'interface.
3. État de la résidence et nombre de maisons.
4. Population affichée avant satisfaction des besoins, si cet état est accessible.
5. Population après satisfaction de chaque besoin, un par un, en conservant les autres paramètres constants.
6. Quantité de biens consommée et intervalle de mesure, si elle est exposée par l'interface.
7. Présence de bonus, spécialistes, recherches, bâtiments de service ou autres modificateurs.
8. Capture ou note de preuve et répétition de la mesure lorsque le résultat peut varier.
9. Identifiants internes retenus et lien entre chaque valeur du catalogue et sa preuve.

Les mesures de taux de consommation doivent être faites sur un intervalle assez long pour distinguer un taux réel d'un affichage arrondi. Ne pas inférer un taux exact à partir d'une variation unique si l'interface ne permet pas une mesure précise.

## 6. Critères d'acceptation du premier lot quantitatif

Le premier lot pourra être proposé au catalogue lorsque :

- [ ] le libellé et l'identité du palier ont été observés en jeu ;
- [ ] la valeur d'habitants par maison est mesurée et reproductible ;
- [ ] les effets des besoins sont distingués de la valeur de base ;
- [ ] les taux de consommation possèdent une unité et une période définies ;
- [ ] les valeurs et leurs conditions de mesure sont documentées ;
- [ ] chaque valeur est reliée à une preuve interne ;
- [ ] les références croisées du catalogue passent les tests ;
- [ ] les conditions de réutilisation des éléments éventuellement dérivés de sources tierces sont examinées séparément.

## 7. Limites et prochaines actions

Cette matrice ne prétend pas valider les neuf types de résidents, leurs taux de consommation, les recettes ou les temps de production. Elle transforme les informations descriptives disponibles en une liste de vérification explicite.

Prochaines actions :

1. Réaliser une première session d'observation pour les Liberti en Latium.
2. Mesurer les habitants par maison et les effets des besoins de base, en isolant les variables.
3. Définir le format de preuve interne et relier chaque valeur au registre des preuves.
4. Ajouter uniquement les enregistrements dont les critères d'acceptation sont satisfaits.
5. Refaire le même travail pour Waders en Albion, puis étendre progressivement les autres paliers.

**Conclusion :** les sources officielles suffisent à cadrer la progression et les grandes catégories de besoins, mais pas à remplir de manière responsable le catalogue quantitatif. Le premier lot de données de jeu reste donc bloqué par l'observation in-game ; aucune valeur numérique n'est inventée ni importée depuis une source secondaire.
