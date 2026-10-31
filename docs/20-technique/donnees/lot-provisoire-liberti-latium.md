# Premier lot quantitatif provisoire — Liberti du Latium

**Statut :** amorçage de catalogue — valeurs à mesurer en jeu  
**Périmètre :** jeu de base, Latium, palier Liberti  
**Révision :** 0.1

## Décision

Le catalogue commence à contenir des données même lorsque leur précision n'est pas encore suffisante pour les qualifier de validées. Le statut `to-observe` signifie que l'enregistrement est une hypothèse de travail et ne doit pas être présenté comme une donnée de référence.

## Données introduites

| Élément | Valeur / présence | Statut | Justification |
|---|---:|---|---|
| Palier Liberti (Latium) | 10 habitants par maison | `to-observe` | Valeur initiale provisoire destinée à permettre les premiers essais ; à mesurer dans une résidence neuve sans bonus |
| Sardines | ressource finale | `to-observe` | Besoin alimentaire attesté ; Anno Union indique +1 Population et +1 Income par résidence lorsque le besoin est satisfait |
| Porridge | ressource finale | `to-observe` | Besoin alimentaire attesté ; Anno Union indique +2 Population lorsque le besoin est satisfait |
| Avoine | ressource brute | `to-observe` | Intrant de la chaîne de porridge ; à confirmer dans l'interface et la recette |
| Fishing Hut | bâtiment Latium | `to-observe` | Bâtiment de production des sardines indiqué par la documentation de démarrage |
| Oat Farm | bâtiment Latium | `to-observe` | Bâtiment amont indiqué par les calculateurs communautaires ; à confirmer |
| Porridge Stand | bâtiment Latium | `to-observe` | Bâtiment de production du porridge indiqué par les calculateurs communautaires ; à confirmer |

Les effets +1 Population pour les sardines et +2 Population pour le porridge sont des **attributs de besoin par résidence**, pas des valeurs de consommation. Le modèle modulaire `PopulationTier` distingue désormais les besoins (`needs`) des taux de consommation historiques par habitant. Chaque besoin peut référencer un bien/service, une catégorie, un taux par résidence lorsqu'il est mesuré, des effets (population, revenu) et un modificateur multiplicatif facultatif. Le tableau `needs` de Liberti reste vide dans ce lot : les effets mentionnés ici ne sont pas encore injectés comme données tant qu'ils n'ont pas été observés et associés à une preuve interne.

## Consommation : décision de ne pas inventer de conversion

Le schéma modulaire sépare maintenant deux niveaux : `consumptionPerResident` (compatibilité avec le moteur actuel) et `needs[].consumptionPerHousePerMinute` (mesure par résidence, propre à un besoin). Aucun convertisseur automatique n'est appliqué entre ces unités. Le champ `consumptionModifier` permet de conserver un facteur multiplicatif documenté lorsqu'il sera observé ; il ne modifie pas encore le calcul du moteur `core`.

Le calculateur communautaire `anno-mods/anno-117-calculator` distingue :
- un `needConsumptionRate` attaché à chaque besoin de résidence ;
- le nombre de résidences construites ;
- un facteur global de consommation ;
- des modificateurs de consommation provenant de bonus.

Son code calcule la demande comme un taux par résidence multiplié par le nombre de maisons et par les facteurs actifs. Le modèle de données du projet expose actuellement `consumptionPerResident`, donc un taux par habitant.

Ces deux grandeurs ne sont pas interchangeables sans connaître le nombre de résidents de référence et la configuration de consommation utilisée. En conséquence, `consumptionPerResident` reste vide pour Liberti dans ce premier commit. Ce n'est pas une absence définitive de données : c'est un point de modélisation à traiter avant d'afficher des besoins en biens/minute.

## Temps de production

Anno Union documente des cycles de 30 secondes pour le bûcheron et la scierie, ainsi que des exemples de chaînes plus longues. La page communautaire Anno Land affiche un cycle de 60 secondes pour la production de sardines et le stand de porridge. Ces temps ne sont pas encore convertis en débits dans le catalogue : la quantité produite par cycle et les conditions de rendement doivent être vérifiées.

## Sources de recherche

- [Anno Union — Getting started in Anno 117: Pax Romana](https://www.anno-union.com/getting-started-in-anno-117-pax-romana/) : catégories des besoins Liberti, exemples Sardines (+1 Population, +1 Income) et Porridge (+2 Population), chaînes et temps de certains cycles.
- [Anno Union — Fulfil Needs Your Way](https://www.anno-union.com/devblog-fulfil-needs-your-way/) : distinction besoins de consommation / services, consommation à l'échelle de l'île, activation et besoins optionnels.
- [Anno Land — Production chains](https://anno.land/en/anno-117-tools/production-chains/) : recoupement communautaire des bâtiments et temps de cycle affichés.
- [anno-mods/anno-117-calculator](https://github.com/anno-mods/anno-117-calculator) : étude du modèle de consommation par résidence et des modificateurs. Le dépôt est sous MIT pour son code, mais précise que les noms, valeurs d'équilibrage et ressources du jeu restent des éléments Ubisoft tiers ; aucune donnée brute n'est copiée dans ce catalogue.

## Campagne de validation en jeu

1. Créer une résidence Liberti neuve, sans bonus ni effet de zone.
2. Relever la population à l'état initial et confirmer ou corriger la valeur provisoire de 10.
3. Activer uniquement Sardines ; relever l'évolution de population et de revenu.
4. Revenir à l'état initial, activer uniquement Porridge ; relever l'évolution de population.
5. Activer les deux besoins simultanément ; vérifier si les effets se cumulent.
6. Mesurer séparément la consommation des biens sur une durée suffisamment longue pour neutraliser les arrondis d'interface.
7. Répéter avec plusieurs résidences et noter le facteur de consommation sélectionné.
8. Relever les cycles et quantités de sortie des bâtiments, à 100 % de productivité et sans bonus.

Après observation, remplacer les hypothèses, renseigner la version exacte du jeu et ajouter les preuves internes. Le statut ne devra passer à `observed` ou `verified` qu'après ces relevés.

## Limites du lot

Ce lot n'est pas encore un catalogue de production complet. Les recettes, quantités par cycle, besoins non alimentaires, services publics, habillement, coûts et consommation par habitant restent à intégrer. L'objectif de ce premier lot est d'amorcer le calculateur et de rendre visibles les hypothèses à tester, sans transformer les inconnues en zéros.

## Exploitation par le moteur de calcul

Le moteur exploite désormais les besoins résidentiels lorsqu'ils sont explicitement marqués comme satisfaits dans les paramètres de l'île.

Pour chaque palier et chaque besoin satisfait :
- le bonus de population est ajouté par maison au socle du palier ;
- le bonus de revenu est agrégé par maison (valeur abstraite, sans unité monétaire ni simulation économique) ;
- la demande associée est calculée à partir du taux mesuré par maison et par minute, multiplié par le nombre de maisons et par le modificateur de consommation éventuel.

Les flux historiques exprimés par habitant sont calculés sur la population totale après bonus. Les besoins non satisfaits ne génèrent ni bonus ni demande. Le moteur ne déduit pas automatiquement qu'un besoin est satisfait à partir d'une production suffisante : la satisfaction est une donnée d'entrée explicite, car l'allocation entre plusieurs besoins et la disponibilité réelle des biens ne sont pas encore simulées.

Les bonus et taux restent facultatifs. Tant qu'ils ne sont pas observés, ils doivent rester absents du catalogue. Le moteur n'utilise pas les enregistrements au statut to-observe par simple présence : la projection vers core doit continuer à filtrer les données non validées.
