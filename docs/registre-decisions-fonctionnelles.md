# Registre des décisions fonctionnelles — Anno 117 Planner

**Version :** 0.3  
**Date :** 30 octobre 2026  
**Statut :** registre évolutif — décisions validées et décisions encore à arbitrer

## 1. Objet et règles d'utilisation

Ce registre centralise les décisions fonctionnelles qui influencent plusieurs documents, contrats techniques ou lots de développement.

Statuts :
- **À arbitrer** : aucune décision validée ;
- **Proposition** : une option est suggérée pour discussion, sans valeur normative ;
- **Validée** : décision explicitement approuvée par le propriétaire du projet ;
- **Remplacée** : décision antérieure remplacée par une décision ultérieure.

Aucune proposition ou hypothèse ne doit être codée comme une règle validée. Lorsqu'une décision est prise, consigner sa date, sa justification, les documents impactés et les tests de référence à ajouter.

## 2. Décisions ouvertes

| ID | Sujet | Question à trancher | Dépendances | Statut |
|---|---|---|---|---|
| DEC-001 | Entrée de planification | La V1 démarre-t-elle à partir d'objectifs de population, de besoins en biens, ou des deux ? | Expression de besoin, cas d'usage, UI | À arbitrer |
| DEC-002 | Population | Comment saisir et agréger la population : nombre d'habitants, résidences ou résidences par niveau ? | Consommation, catalogue | À arbitrer |
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
| DEC-014 | Contraintes géographiques et disponibilité locale | Les ressources disponibles sur chaque île doivent conditionner la faisabilité des recettes ; la représentation des disponibilités, fertilités et autres contraintes reste à définir. | Catalogue, moteur, scénario multi-îles | **Partiellement validée — disponibilité locale à prendre en compte** |
| DEC-015 | Transferts entre îles | Une ressource absente localement peut-elle être importée depuis une autre île, et selon quelles limites/capacités ? | Lot 8, scénario | À arbitrer — la disponibilité locale est requise, les règles de transfert restent à définir |
| DEC-016 | Sauvegarde et export | Quels formats, quelles données et quelle stratégie de versionnement sont attendus ? | Lot 7 | À arbitrer |
| DEC-017 | Plateforme et distribution | Quelles versions de Windows et quel format de livraison sont ciblés ? | Desktop, livraison | À arbitrer |
| DEC-018 | Qualité | Quels contrôles et seuils sont requis pour déclarer la V1 livrable ? | CI, tests, livraison | À arbitrer |
| DEC-019 | Catalogue de référence | Quelle source est retenue par catégorie après comparaison, et quelles données sont acceptées pour intégration ? | Audit des données, droits | À arbitrer |
| DEC-020 | SCIDL | Que signifie SCIDL dans le contexte du projet et quel livrable est attendu ? | Documentation | À arbitrer |

## 3. Fiche de décision

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

## 4. Lien avec le contrat du moteur

Les décisions DEC-004 à DEC-012 sont directement liées à docs/contrat-moteur-calcul.md et doivent être résolues avant de figer l'API publique du lot 1.

Les décisions DEC-001 à DEC-003 influencent le contrat des cas d'usage et la manière dont les besoins finaux sont fournis au moteur. DEC-013 et DEC-014 doivent être traitées avant de figer le lot 3 et le modèle de données correspondant. DEC-015 relève de la spécification multi-îles. DEC-016 relève du contrat de persistance.

## 5. Historique

| Date | Modification |
|---|---|
| 30 octobre 2026 | Création du registre initial à partir de la revue de complétude documentaire |

