# Registre des décisions fonctionnelles — Anno 117 Planner

**Version :** 0.5  
**Date :** 31 octobre 2026  
**Statut :** registre évolutif — décisions validées et décisions encore à arbitrer

## 1. Objet et règles d'utilisation

Ce registre centralise les décisions fonctionnelles qui influencent plusieurs documents, contrats techniques ou lots de développement.

Statuts :
- **À arbitrer** : aucune décision validée ;
- **Proposition** : une option est suggérée pour discussion, sans valeur normative ;
- **Validée** : décision explicitement approuvée par le propriétaire du projet ;
- **Remplacée** : décision antérieure remplacée par une décision ultérieure.

Aucune proposition ou hypothèse ne doit être codée comme une règle validée. Lorsqu'une décision est prise, consigner sa date, sa justification, les documents impactés et les tests de référence à ajouter.

## 2. Décisions suivies

| ID | Sujet | Question à trancher | Dépendances | Statut |
|---|---|---|---|---|
| DEC-001 | Entrée de planification | Le premier parcours du lot 5 démarre à partir d'objectifs de population. La saisie directe de besoins en biens est exclue de cette première tranche, sans préjuger d'une évolution ultérieure. | Expression de besoin, cas d'usage, UI | **Validée — population en premier** |
| DEC-002 | Population | La saisie se fait par nombre de maisons pour chaque palier de population. Le nombre d'habitants est calculé à partir de `residentsPerHouse`. | Consommation, catalogue | **Validée — maisons par palier** |
| DEC-003 | Besoins des habitants | Comment sélectionner les besoins par niveau et catégorie, y compris besoins optionnels et effets de progression ? | Consommation, données | À arbitrer |
| DEC-004 | Unité de temps | Quelle unité commune est utilisée pour les débits internes ? | Moteur, catalogue, tests | **Validée — minute** |
| DEC-005 | Unités de consommation | Quelle unité et quelle période décrivent les taux de consommation des habitants ? | Moteur, catalogue | À arbitrer |
| DEC-006 | Précision numérique | Quelle précision interne et quelle stratégie de représentation numérique sont requises ? | Moteur, tests, affichage | À arbitrer |
| DEC-007 | Arrondis | Les quantités nécessitant un nombre entier d'installations sont arrondies à l'entier supérieur ; le stade d'arrondi des autres valeurs reste à préciser. | Moteur, résultats, tests | **Partiellement validée — entier supérieur pour le dimensionnement** |
| DEC-008 | Recettes multiples et optimisation | Combiner les recettes et optimiser selon l'ordre global, complexité de chaîne, nombre de bâtiments, puis surplus ; les métriques exactes restent à définir. | Moteur, UI, données, tests | **Partiellement validée — ordre de priorité retenu** |
| DEC-009 | Recettes multi-sorties | Comment prendre en compte les coproduits lorsqu'une recette produit plusieurs biens ? | Moteur, données, tests | À arbitrer |
| DEC-010 | Productivité | Quels modificateurs sont pris en charge en V1 et comment se cumulent-ils ? | Moteur, données | À arbitrer |
| DEC-011 | Main-d'œuvre et entretien | Sont-ils des contraintes de calcul, des indicateurs ou hors périmètre du moteur initial ? | Moteur, cas d'usage | À arbitrer |
| DEC-012 | Erreurs et résultats partiels | Quelles entrées invalident une requête et quels cas retournent un résultat partiel avec diagnostics ? | Moteur, cas d'usage, UI | À arbitrer |
| DEC-013 | Stocks et bâtiments existants | Sont-ils pris en compte dans la première version des cas d'usage ? Dans quel ordre par rapport aux besoins ? | Lot 3, modèle de scénario | À arbitrer |
| DEC-014 | Disponibilité locale des ressources | La faisabilité d'une recette est évaluée localement sur l'île planifiée, selon les ressources naturelles et les productions locales disponibles. Le joueur décide lui-même de sa stratégie globale. | Catalogue, moteur, scénario d'île | **Validée — calcul local en première approche** |
| DEC-015 | Colonisation et commerce inter-îles | Les importations dépendent de conditions de jeu, notamment la colonisation d'une autre île ou la mise en place du commerce. Le moteur initial doit-il simuler ces mécanismes ? | Lot 8, stratégie globale | **Hors périmètre du calcul local initial** — aucune importation supposée automatique |
| DEC-016 | Sauvegarde et export | Quels formats, quelles données et quelle stratégie de versionnement sont attendus ? | Lot 7 | À arbitrer |
| DEC-017 | Plateforme et distribution | Quelles versions de Windows et quel format de livraison sont ciblés ? | Desktop, livraison | À arbitrer |
| DEC-018 | Qualité | Quels contrôles et seuils sont requis pour déclarer la V1 livrable ? | CI, tests, livraison | À arbitrer |
| DEC-019 | Catalogue de référence | Quelle source est retenue par catégorie après comparaison, et quelles données sont acceptées pour intégration ? | Audit des données, droits | À arbitrer |
| DEC-020 | SCIDL | Que signifie SCIDL dans le contexte du projet et quel livrable est attendu ? | Documentation | À arbitrer |

## 3. Décisions validées

### DEC-001 — Entrée de planification par la population

- **Question :** choisir le mode d'entrée du premier parcours de planification.
- **Options considérées :** population ; besoins en biens ; les deux modes.
- **Décision retenue :** population en premier (option A).
- **Justification :** le modèle applicatif actuel expose déjà les maisons par palier via `IslandInput.houses` et calcule la population ainsi que les besoins associés.
- **Conséquences fonctionnelles :** le premier parcours commence par la saisie des maisons par palier ; aucun mode de saisie directe des biens n'est ajouté dans cette tranche.
- **Documents à mettre à jour :** cadrage de l'interface, plan de développement et spécifications de l'écran.
- **Tests ou exemples de référence :** vérifier la conversion des nombres de maisons en entrée du cas d'usage, la population calculée et les besoins correspondants.
- **Date et validation :** 31 octobre 2026 — choix confirmé par le propriétaire du projet.

### DEC-002 — Saisie des maisons par palier

- **Question :** quelle granularité de saisie utiliser pour représenter la population ?
- **Options considérées :** nombre direct d'habitants ; nombre global de maisons ; nombre de maisons par palier.
- **Décision retenue :** nombre entier de maisons pour chaque palier de population disponible dans le catalogue exploitable.
- **Justification :** cette granularité correspond directement au contrat `IslandInput.houses` et permet au moteur d'appliquer `residentsPerHouse` pour calculer les habitants.
- **Conséquences fonctionnelles :** l'interface présente une saisie numérique non négative par palier ; le nombre d'habitants n'est pas saisi manuellement.
- **Documents à mettre à jour :** cadrage de l'interface et spécification de l'écran.
- **Tests ou exemples de référence :** vérifier les valeurs par défaut à zéro, l'acceptation des entiers non négatifs et le rejet des valeurs fractionnaires ou négatives.
- **Date et validation :** 31 octobre 2026 — choix confirmé par le propriétaire du projet avec l'option A.

## 4. Fiche de décision

Pour toute décision importante, ajouter une fiche selon le modèle suivant :

### DEC-XXX — Titre

- **Question :**
- **Contexte :**
- **Options considérées :**
- **Décision retenue :** À arbitrer
- **Justification :**
- **Conséquences fonctionnelles :**
- **Documents à mettre à jour :**
- **Tests ou exemples de référence :**
- **Date et validation :**

Les options doivent présenter les conséquences concrètes sans imposer une préférence par défaut. Les décisions de droits ou de propriété intellectuelle ne doivent pas être déduites de décisions techniques.

## 5. Lien avec le contrat du moteur

Les décisions DEC-004 à DEC-012 sont directement liées à docs/20-technique/contrats/contrat-moteur-calcul.md et doivent être résolues avant de figer l'API publique du lot 1.

Les décisions DEC-001 à DEC-003 influencent le contrat des cas d'usage et la manière dont les besoins finaux sont fournis au moteur. DEC-013 et DEC-014 doivent être traitées avant de figer le lot 3 et le modèle de données correspondant. DEC-015 relève de la spécification multi-îles. DEC-016 relève du contrat de persistance.

## 6. Historique

| Date | Modification |
|---|---|
| 30 octobre 2026 | Création du registre initial à partir de la revue de complétude documentaire |
| 31 octobre 2026 | Validation de l'entrée par population et de la saisie des maisons par palier (DEC-001 et DEC-002) |

