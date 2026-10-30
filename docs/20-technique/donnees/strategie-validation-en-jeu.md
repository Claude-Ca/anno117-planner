# Stratégie de constitution et de validation du catalogue en jeu

**Version :** 1.1  
**Statut :** méthode de référence — campagne de vérification à réaliser

## 1. Objectif

Constituer un catalogue propre à Anno 117 Planner, embarqué dans l'application et vérifié indépendamment. Les sources externes déjà étudiées ont servi à comprendre le domaine et à identifier des pistes. Elles ne constituent ni une autorisation de copier leurs bases ni une preuve de l'exactitude des valeurs.

## 2. Règle de constitution

Une donnée intégrée au catalogue doit être établie par observation directe, expérimentation reproductible ou calcul dérivé de données observées avec formule et références explicites.

Les informations provenant de sources secondaires peuvent guider les vérifications. Tant qu'elles ne sont pas confirmées indépendamment, elles restent des pistes d'audit et ne sont pas publiées comme données validées du catalogue embarqué.

## 3. Statuts des données

| Statut | Signification | Utilisation |
|---|---|---|
| `to-observe` | Élément identifié, observation non réalisée | Liste de vérification, preuve non requise |
| `observed` | Observation effectuée, contrôle incomplet | Donnée de travail avec preuve interne |
| `verified` | Observation recoupée ou expérimentation répétée | Candidat à l'intégration avec preuve |
| `derived` | Calcul explicite à partir de données vérifiées | Candidat à l'intégration avec dépendances |
| `disputed` | Écart ou contradiction constaté | Non utilisable comme référence, preuve conservée |
| `excluded` | Hors périmètre ou non applicable | Non chargé par le moteur, preuve non requise |

Une preuve interne conserve sa méthode, sa date, la version du jeu et les notes de mesure. Une preuve dérivée référence les preuves dont elle dépend. Les statuts `to-observe` et `excluded` peuvent ne pas posséder de preuve ; les autres statuts en exigent au moins une.

Un statut technique ne constitue pas une conclusion juridique sur les droits relatifs aux éléments du jeu.

## 4. Informations à relever

Selon la catégorie, consigner l'identifiant interne, le libellé, la région, le bâtiment et la recette, les intrants et sorties, les quantités et durées, les unités et conditions de mesure, le besoin de population, les fertilités et gisements, la version du jeu, la date, la méthode, les répétitions, l'incertitude et les références aux observations sources.

Les captures et notes de campagne peuvent être conservées comme preuves de travail sans être incorporées au catalogue de production.

## 5. Déroulement de la campagne de référence

1. Démarrer une nouvelle campagne.
2. Confirmer le périmètre Latium et relever les premières disponibilités.
3. Relever les biens, bâtiments et recettes au fil de leur déblocage.
4. Mesurer les durées et quantités dans des conditions reproductibles.
5. Relever les besoins de population et paramètres résidentiels.
6. Répéter les mesures sensibles et noter les modificateurs.
7. Relever fertilités et gisements séparément pour chaque île.
8. Répéter la démarche pour Albion lorsque la progression le permet.
9. Comparer les observations au catalogue de travail et documenter les écarts.
10. Mettre à jour les données, preuves, tests et documents associés.

## 6. Gestion des incertitudes

Ne jamais remplacer une donnée inconnue par zéro, déduire une valeur exacte d'un affichage arrondi sans noter l'incertitude, extrapoler la disponibilité d'une île à toute une région, fusionner des mesures prises sous des modificateurs différents ou qualifier une donnée de vérifiée sur la seule base d'une source communautaire.

Les écarts sont conservés jusqu'à leur résolution. Une valeur calculée indique sa formule et ses dépendances.

## 7. Première liste de vérification

Les audits préparatoires identifient des catégories à examiner, sans garantir leur exhaustivité. Elles constituent une liste de départ pour la campagne, pas un catalogue validé.

### Latium — pistes à observer
- Fertilités et ressources naturelles : maquereau, lavande, résine, olives, raisin, lin, escargots murex, sandaraque, huîtres, esturgeon.
- Gisements : minerai de fer, marbre brut, minerais, minerai d'or.

### Albion — pistes à observer
- Fertilités et ressources naturelles : orge, herbes, plantes tinctoriales, résine, salicorne, petits oiseaux, lin, castor, poneys, coquillages.
- Gisements : minerai de fer, minerai de cuivre, minerai d'argent, minerai d'étain, granite.

Ces libellés sont des traductions de travail issues de l'étude préparatoire. Ils devront être confrontés à l'interface du jeu et ne constituent pas des identifiants définitifs.

## 8. Critères de validation d'un lot

Un lot est candidat à l'intégration lorsque son périmètre est défini, ses identifiants sont stables, les valeurs ont une méthode d'établissement explicite, les mesures ont été répétées ou recoupées, les unités et conditions sont documentées, les références croisées sont cohérentes, les incertitudes sont explicites, les tests passent et les droits sont examinés séparément.

## 9. Livrables de campagne

Chaque session produit les notes d'observation, les données ajoutées ou corrigées, les écarts et questions restantes, les tests associés et la mise à jour de l'audit ou du registre de décisions si nécessaire.
