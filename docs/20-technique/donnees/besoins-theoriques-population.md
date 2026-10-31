# Besoins théoriques par type d'habitant

## Objectif

Le Planner part du nombre de maisons par palier de population. Il en déduit les besoins à satisfaire et, lorsque le taux est connu, la quantité théorique de chaque ressource.

## Modèle

Chaque palier peut déclarer des options de besoin avec :

- `category` : alimentation, service public, habillement ou vie domestique ;
- `goodId` : ressource ou service associé à cette option ;
- `choiceGroupId` : groupe d'alternatives exclusives (par exemple, choisir un bien alimentaire) ;
- `buildingIds` : bâtiments associés à la fourniture ;
- `unlockAtHouses` : seuil de maisons, uniquement lorsqu'il a été vérifié ;
- `consumptionPerHousePerMinute` : taux de consommation par maison, uniquement lorsqu'il a été mesuré ou validé ;
- `status` et `sourceRefs` : traçabilité de la relation besoin/ressource.

Le seuil de déblocage et le taux de consommation sont deux données indépendantes. L'absence de taux ne doit jamais être interprétée comme une consommation nulle.

## Restitution dans le Planner

La saisie des maisons déclenche le recalcul sans bouton de validation. L'utilisateur choisit une option par groupe de besoin. Les bâtiments associés sont affichés comme pistes de fourniture.

Si le taux de consommation est absent, l'interface affiche « À quantifier » au lieu de fabriquer une quantité. Lorsqu'un taux est disponible, la quantité théorique est calculée ainsi :

`quantité par minute = nombre de maisons × consommation par maison et par minute`

Les recettes et rendements de production restent séparés de ce calcul résidentiel ; ils seront ajoutés lors d'une étape de validation ultérieure.

## État initial du Latium

Les options Sardines/Porridge, Tunics/Pileus et Market/Tavern sont inscrites comme relations candidates pour les Liberti. Les chaînes issues de sources communautaires restent explicitement candidates. Aucun taux de consommation ni seuil de déblocage n'est renseigné dans ce lot.

Le calculateur communautaire Anno 117 sert de référence de comparaison fonctionnelle, pas de source à recopier. Son dépôt indique que les valeurs d'équilibrage du jeu (dont les taux de consommation) ne sont pas couvertes par sa licence MIT. Toute réutilisation de ces valeurs doit donc faire l'objet d'une validation distincte des droits et de la provenance.
