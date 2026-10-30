# Stratégie de constitution et de validation du catalogue en jeu

**Version :** 1.0  
**Statut :** méthode proposée — campagne de vérification à réaliser

## 1. Objectif

Constituer un catalogue propre à Anno 117 Planner, embarqué dans l'application et vérifié indépendamment. Les sources externes déjà étudiées ont servi à comprendre le domaine et à identifier des pistes. Elles ne constituent pas une autorisation de copier leurs bases ni une preuve de l'exactitude des valeurs.

## 2. Règle de constitution

Une donnée intégrée au catalogue doit être établie par :
- observation directe dans le jeu ;
- expérimentation reproductible ;
- calcul dérivé de données observées, avec formule et références explicites.

Les informations provenant de sources secondaires peuvent guider les vérifications. Tant qu'elles ne sont pas confirmées indépendamment, elles restent des pistes d'audit et ne sont pas publiées comme données validées du catalogue embarqué.

## 3. Statuts des données

| Statut | Signification | Utilisation |
|---|---|---|
| `to-observe` | Élément identifié, observation non réalisée | Liste de vérification uniquement |
| `observed` | Observation effectuée, contrôle incomplet | Donnée de travail |
| `verified` | Observation recoupée ou expérimentation répétée | Candidat à l'intégration |
| `derived` | Calcul explicite à partir de données vérifiées | Candidat à l'intégration avec dépendances |
| `disputed` | Écart ou contradiction constaté | Non utilisable comme référence |
| `excluded` | Hors périmètre ou non applicable | Non chargé par le moteur |

Un statut technique ne constitue pas une conclusion juridique sur les droits relatifs aux éléments du jeu.

## 4. Informations à relever

Selon la catégorie, consigner :
- identifiant interne stable et libellé de travail ;
- région et catégorie ;
- bâtiment et recette associés ;
- intrants et sorties ;
- quantité par cycle et durée du cycle ;
- unité et conditions de mesure ;
- besoin, population ou résidence concernée ;
- fertilité ou gisement requis ;
- version du jeu ;
- date de l'observation ;
- méthode et répétitions ;
- résultat, incertitude et commentaire ;
- identifiants des observations sources pour les valeurs dérivées.

Les captures ou notes de campagne peuvent être conservées comme preuves de travail, sans être incorporées au catalogue de production.

## 5. Déroulement de la campagne de référence

1. Démarrer une nouvelle campagne sans utiliser de progression préexistante.
2. Identifier les premiers éléments du périmètre Latium et noter leur disponibilité.
3. Relever les biens, bâtiments et recettes dès qu'ils deviennent accessibles.
4. Mesurer les durées et quantités dans des conditions reproductibles.
5. Relever les besoins de population et les paramètres de résidence au moment où ils deviennent observables.
6. Répéter les mesures sensibles et noter les éventuels modificateurs.
7. Relever séparément les fertilités et gisements de l'île ; ne pas généraliser une disponibilité à toute une région.
8. Répéter la démarche pour Albion lorsque la progression le permet.
9. Comparer les observations au catalogue de travail et documenter les écarts.
10. Mettre à jour le catalogue et ses tests.

## 6. Gestion des incertitudes

Ne jamais :
- remplacer une donnée inconnue par zéro ;
- déduire une valeur exacte d'un affichage arrondi sans noter l'incertitude ;
- extrapoler la disponibilité d'une île à toutes les îles d'une région ;
- fusionner des mesures prises sous des modificateurs différents ;
- qualifier une donnée de vérifiée sur la seule base d'une source communautaire.

Les écarts sont conservés jusqu'à leur résolution. Une valeur calculée doit indiquer sa formule et ses dépendances.

## 7. Première liste de vérification

Les audits préparatoires identifient des catégories à examiner, sans garantir leur exhaustivité. Elles constituent une liste de départ pour la campagne, pas un catalogue validé.

### Latium — pistes à observer
- Fertilités et ressources naturelles : maquereau, lavande, résine, olives, raisin, lin, escargots murex, sandaraque, huîtres, esturgeon.
- Gisements : minerai de fer, marbre brut, minerais, minerai d'or.

### Albion — pistes à observer
- Fertilités et ressources naturelles : orge, herbes, plantes tinctoriales, résine, salicorne, petits oiseaux, lin, castor, poneys, coquillages.
- Gisements : minerai de fer, minerai de cuivre, minerai d'argent, minerai d'étain, granite.

Ces libellés sont des traductions de travail des catégories recensées lors de l'étude. Ils devront être confrontés à l'interface du jeu et ne constituent pas des identifiants définitifs.

## 8. Critères de validation d'un lot

Un lot est candidat à l'intégration lorsque :
- son périmètre est défini ;
- les identifiants sont stables ;
- les valeurs ont une méthode d'établissement explicite ;
- les mesures nécessaires ont été répétées ou recoupées ;
- les unités et conditions sont documentées ;
- les références croisées sont cohérentes ;
- les incertitudes sont explicites ;
- les tests de validation passent ;
- les droits et conditions d'utilisation ont été examinés séparément.

## 9. Livrables de campagne

Chaque session de vérification doit produire :
- les notes d'observation ;
- les données ajoutées ou corrigées ;
- les écarts et questions restantes ;
- les tests associés ;
- la mise à jour de l'audit et du registre de décisions si nécessaire.
