# Contrat fonctionnel du moteur de calcul — Anno 117 Planner

**Version :** 0.1  
**Date :** 30 octobre 2026  
**Statut :** proposition de travail — à valider par le propriétaire du projet  
**Périmètre :** lot 1, moteur métier indépendant de l'interface et du catalogue final

## 1. Objet

Ce document définit le contrat fonctionnel à stabiliser avant de considérer le lot 1 comme spécifié. Il distingue les exigences déjà présentes dans l'expression de besoin, les règles de conception proposées pour rendre le moteur testable et les décisions métier qui restent à arbitrer.

Aucune proposition de ce document ne devient une règle validée tant qu'elle n'a pas été approuvée explicitement.

## 2. Responsabilité et limites du moteur

Le moteur (packages/core) doit recevoir des données et paramètres explicites, valider les entrées relevant de son contrat, calculer les flux théoriques à partir des recettes fournies, propager les besoins amont selon les règles validées, calculer les capacités et le dimensionnement lorsque les données le permettent, et retourner des résultats déterministes avec des diagnostics explicites.

Il ne doit pas dépendre de React ou Electron, charger lui-même des données depuis Internet ou un fichier utilisateur, décider silencieusement qu'une donnée absente vaut zéro, masquer les incertitudes du catalogue ni simuler un mécanisme qui n'a pas été spécifié.

Les cas d'usage, la gestion des scénarios, la persistance et l'interface relèvent d'autres modules. Les stocks, bâtiments existants, transferts entre îles et contraintes géographiques ne sont pas présumés pris en charge par le contrat initial du lot 1 : leur périmètre doit être arbitré et relié aux lots concernés.

## 3. Vocabulaire

| Terme | Définition de travail |
|---|---|
| Bien | Ressource ou produit pouvant apparaître dans les entrées ou sorties d'une recette |
| Recette | Transformation décrivant des quantités d'entrée et de sortie sur un cycle |
| Bâtiment producteur | Entité à laquelle une recette est associée ; bâtiment et recette ne doivent pas être confondus |
| Cycle | Durée nécessaire à une exécution de recette selon les données fournies |
| Débit théorique | Quantité produite ou consommée par unité de temps, avant les contraintes non modélisées |
| Besoin final | Quantité ou débit demandé par l'objectif de planification |
| Besoin amont | Flux requis pour soutenir une production aval |
| Capacité | Débit théorique d'une installation selon sa recette et les paramètres applicables |
| Dimensionnement | Nombre d'installations nécessaire pour couvrir un besoin selon la règle d'arrondi retenue |
| Diagnostic | Information structurée signalant une entrée invalide, une donnée manquante, une limite du modèle ou un résultat incomplet |

Ces définitions restent provisoires lorsqu'elles impliquent un choix métier non encore validé.

## 4. Contrat d'entrée conceptuel

Le moteur reçoit des structures explicites, validées et indépendantes de l'interface. Le schéma TypeScript exact sera défini après arbitrage des règles ci-dessous.

Les données nécessaires au calcul d'une chaîne comprennent au minimum :
- un identifiant stable de bien ;
- une recette identifiée ;
- une durée de cycle exploitable ;
- les quantités d'entrée de la recette, éventuellement aucune ;
- les quantités de sortie, au moins une pour une recette de production ;
- l'association entre la recette et son producteur ;
- les unités et conventions de débit nécessaires à une comparaison correcte ;
- les paramètres de productivité, uniquement si leur formule et leur portée sont définies.

Le moteur doit distinguer une valeur égale à zéro, une valeur absente, une valeur inconnue ou non vérifiée et une valeur non applicable. Une valeur absente ou inconnue ne doit pas être convertie implicitement en zéro.

## 5. Flux, unités et précision

Le moteur a besoin d'une unité de temps commune pour comparer recettes et besoins. Le choix reste à arbitrer : minute, heure ou autre unité explicite.

Pour toute recette, le contrat devra préciser si les quantités d'entrée et de sortie représentent les quantités par cycle, comment la durée est interprétée, comment les conversions de débit sont réalisées, quelle précision est conservée pendant les calculs et à quel stade un arrondi est autorisé.

**Décisions requises :**
1. unité de temps interne ;
2. unité des taux de consommation ;
3. précision interne et représentation numérique ;
4. règle d'arrondi des résultats affichés ;
5. règle d'arrondi du nombre de bâtiments.

Tant que ces choix ne sont pas validés, aucun résultat chiffré d'exemple ne doit être traité comme référence normative.

## 6. Calcul de capacité et dimensionnement

Le besoin exprimé et la capacité calculée doivent être comparables dans une même unité et sur une même période. La capacité dépend au minimum des quantités de sortie et de la durée de cycle. Les effets de productivité ne peuvent être appliqués que si le facteur, sa portée, sa formule de cumul et ses bornes éventuelles sont définis.

L'expression de besoin indique que les installations étant indivisibles, un nombre fractionnaire de bâtiments doit être arrondi de manière à couvrir le besoin, sous réserve des règles métier restant à formaliser. Cette intention doit être transformée en règle et en tests précis.

**Décisions requises :**
- traitement de plusieurs sorties par recette ;
- traitement de plusieurs recettes capables de produire le même bien ;
- choix manuel ou automatique des recettes ;
- stratégie de répartition du besoin entre plusieurs producteurs ;
- comportement lorsqu'aucune recette n'est disponible ;
- traitement des producteurs dont les données ne sont pas vérifiées.

## 7. Propagation des besoins amont

Le moteur doit pouvoir décomposer les besoins finaux en besoins intermédiaires en remontant les recettes du catalogue. La stratégie de sélection des recettes et de répartition des quantités entre producteurs doit être décidée avant de figer l'API publique.

Le contrat doit traiter explicitement les biens sans recette productrice connue, les recettes à entrées multiples, les recettes à sorties multiples, les producteurs multiples d'un même bien, les cycles dans le graphe de production, les recettes invalides ou incomplètes et les besoins qui ne peuvent être entièrement couverts.

Le moteur ne doit pas choisir arbitrairement un producteur ou ignorer un intrant. Les diagnostics doivent rendre visible toute limite ou tout résultat incomplet.

## 8. Productivité, main-d'œuvre et entretien

La prise en charge des modificateurs de productivité doit être limitée aux facteurs explicitement définis et testés. Avant intégration, chaque facteur doit avoir une source ou règle de référence, une formule, une portée (recette, bâtiment, île ou scénario), une règle de cumul, des limites éventuelles et un cas de test.

La main-d'œuvre et l'entretien apparaissent dans le catalogue envisagé, mais leur rôle exact dans le moteur doit être arbitré. Ils ne doivent pas être interprétés comme contraintes bloquantes, coûts ou simples indicateurs sans décision explicite.

## 9. Contrat de sortie conceptuel

Le résultat doit permettre de distinguer, selon les fonctionnalités effectivement prises en charge, les besoins demandés, les capacités théoriques calculées, le nombre de bâtiments calculé, les flux amont requis, les besoins non couverts, les données manquantes ou non vérifiées, et les erreurs d'entrée ou limites du modèle.

Le format exact, les statuts d'erreur et la distinction entre erreur bloquante et avertissement restent à définir. Une erreur ne doit pas être dissimulée sous la forme d'un résultat numérique plausible.

## 10. Déterminisme et erreurs

À entrées, données et paramètres identiques, le moteur doit retourner le même résultat, conformément à l'expression de besoin.

La validation devra couvrir les identifiants absents ou dupliqués, les quantités négatives ou non finies, les durées de cycle nulles, négatives ou non finies, les références inconnues, les recettes sans sortie exploitable, les cycles, l'absence de recette productrice, les données non vérifiées et les dépassements numériques.

La politique exacte de traitement — rejet de la requête, résultat partiel avec diagnostics, ou combinaison selon le cas — reste à arbitrer.

## 11. Matrice des cas de référence à construire

Les cas suivants doivent disposer d'entrées explicites et de résultats attendus validés avant que le lot 1 soit déclaré complet.

| ID | Cas | Résultat à vérifier |
|---|---|---|
| CORE-001 | Une recette simple, une sortie | Débit calculé à partir du cycle |
| CORE-002 | Une recette avec plusieurs intrants | Besoin amont pour chaque intrant |
| CORE-003 | Une recette avec plusieurs sorties | Règle de traitement des coproduits |
| CORE-004 | Deux recettes produisent le même bien | Stratégie de sélection ou répartition |
| CORE-005 | Une chaîne de plusieurs étapes | Propagation complète du besoin |
| CORE-006 | Besoin supérieur à une capacité entière | Dimensionnement selon l'arrondi validé |
| CORE-007 | Productivité modifiée | Application de la formule validée |
| CORE-008 | Bien sans producteur connu | Diagnostic et résultat attendu |
| CORE-009 | Cycle dans le graphe | Détection et traitement |
| CORE-010 | Donnée absente ou non vérifiée | Pas de conversion silencieuse en zéro |
| CORE-011 | Entrée numérique invalide | Erreur structurée attendue |
| CORE-012 | Besoin non entièrement couvert | Distinction demande, capacité et déficit |

Les résultats chiffrés seront ajoutés lorsque les unités, conventions de flux et règles métier correspondantes auront été arbitrées.

## 12. Critères de sortie du lot 1

Le lot 1 ne sera considéré comme spécifié puis validé que lorsque les contrats d'entrée et de sortie sont documentés, les unités et conventions de flux validées, la règle de dimensionnement explicite, les producteurs multiples et recettes à sorties multiples traités selon des règles validées, les paramètres de productivité documentés, les erreurs et résultats incomplets définis, les cas de référence assortis de résultats attendus et les tests automatisés exécutés avec leurs résultats consignés.

## 13. Décisions ouvertes

Les décisions à arbitrer sont centralisées dans docs/registre-decisions-fonctionnelles.md. Toute modification de ce contrat devra référencer la décision qui la justifie.

## 14. Documents associés

- docs/expression_de_besoin.md
- docs/plan_de_developpement.md
- docs/catalog-scope.md
- docs/registre-decisions-fonctionnelles.md
