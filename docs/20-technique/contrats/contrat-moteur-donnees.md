# Contrat du moteur de données

**Version :** 1.1  
**Statut :** contrat de travail — implémentation initiale en cours  
**Composant :** `packages/data-engine`

## 1. Objet

Le moteur transforme les modules locaux de `@anno117/game-data` en un référentiel agrégé, validé et consommable par le `core`. Il constitue la frontière entre les données du jeu et le modèle métier du calculateur.

## 2. Responsabilités

Le moteur doit charger les modules embarqués fournis par l'application, vérifier leur manifeste, valider les identifiants et références, agréger les données sans mutation, exposer les diagnostics et construire une projection vers `Catalog` du `core`.

Il ne doit pas interroger Internet, importer des catalogues communautaires, effectuer les calculs de production, décider de la stratégie inter-îles, remplacer une donnée inconnue par zéro ou exposer des données non vérifiées au calcul.

## 3. Modèle d'entrée

Le catalogue est composé d'un manifeste et des modules fonctionnels suivants :

| Module | Contenu |
|---|---|
| `resources` | Biens et ressources |
| `buildings` | Bâtiments et région d'appartenance |
| `production` | Recettes, intrants et sorties |
| `population` | Paliers et consommations |
| `regions` | Régions couvertes |
| `islandAvailability` | Fertilités, gisements et ressources propres à une île |
| `evidence` | Observations et expérimentations internes |

Le manifeste identifie le catalogue, sa version, la version de schéma, la version du jeu et le périmètre de régions. Les références entre modules reposent sur des identifiants stables.

## 4. Provenance et statut

Chaque entité de catalogue possède un statut : `to-observe`, `observed`, `verified`, `derived`, `disputed` ou `excluded`. Elle référence une ou plusieurs preuves internes.

Une preuve conserve sa méthode (`observation`, `experiment`, `derived`), sa date, la version du jeu et des notes. Une preuve dérivée référence ses preuves d'origine. Les sources externes d'étude ne sont pas des preuves de validation et ne sont pas intégrées au catalogue embarqué.

Seules les entités au statut `verified` ou `derived`, avec références cohérentes, sont candidates à la projection vers le `core`. Les statuts de travail et contestés restent visibles dans le référentiel agrégé mais sont exclus des calculs.

## 5. Validation et diagnostics

Les diagnostics comportent une sévérité, un code, un chemin et un message. Les erreurs bloquantes empêchent le chargement. La validation couvre au minimum :
- structure du manifeste et présence des modules ;
- unicité des identifiants ;
- références vers ressources, bâtiments, recettes, régions et preuves ;
- cohérence bâtiment/recette ;
- valeurs numériques et débits strictement positifs ;
- statut et provenance des entités ;
- dépendances des données dérivées.

Une couverture incomplète n'est pas automatiquement une erreur : le catalogue V1 peut être progressif. En revanche, aucune référence incohérente ne doit être masquée.

## 6. Agrégation et projection

Le référentiel agrégé conserve les modules et métadonnées. La projection vers le `core` ne contient que les bâtiments, recettes, biens référencés et paliers admissibles. Le modèle du `core` reste indépendant de la structure JSON et des modules.

La projection ne doit pas muter les données d'entrée. Elle doit être déterministe. Les disponibilités régionales et insulaires restent conservées dans le référentiel ; elles ne sont pas encore consommées par le contrat actuel du `core`.

## 7. Embarquement

Le package desktop importe les fichiers JSON locaux et fournit les modules à `loadGameData`. Le moteur ne réalise aucun accès filesystem ou réseau lui-même. La livraison d'une nouvelle version de l'application emporte la version correspondante du catalogue.

## 8. Tests

Le plan détaillé et la matrice de tests sont maintenus dans [Plan de tests du catalogue](../plan-tests-catalogue.md). Les fixtures automatisées sont synthétiques et ne valent pas données de jeu. La validation du packaging et la campagne en jeu restent des étapes distinctes.

## 9. État de réalisation

Le modèle modulaire, les types de provenance, le validateur initial, la projection et les tests unitaires de base sont présents sur la branche de feature. Le chargement des fichiers JSON dans l'application desktop, le raccordement du `core` et la campagne de vérification restent à réaliser. Les commandes et résultats de tests ne sont considérés comme validés qu'après exécution dans l'environnement du dépôt.
