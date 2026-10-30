# Contrat du moteur de données

**Version :** 1.2  
**Statut :** contrat de travail — intégration modulaire disponible, validation locale en cours  
**Composant :** `packages/data-engine`

## 1. Objet

Le moteur transforme les modules locaux de `@anno117/game-data` en un référentiel agrégé, validé et consommable par les couches applicatives et le `core`. Il constitue la frontière entre les données du jeu et le modèle métier du calculateur.

## 2. Responsabilités

Le moteur vérifie le manifeste, valide les identifiants et références, agrège les données sans mutation, expose les diagnostics et construit une projection vers `Catalog` du `core`.

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

Le résultat de `loadGameData(input)` est un `DataRepository` immuable qui expose :

- `manifest` : manifeste du catalogue ;
- `modules` : snapshot des modules agrégés ;
- `diagnostics` : diagnostics non bloquants éventuels ;
- `coreCatalog` : projection destinée au contrat de `@anno117/core`.

La projection ne contient que les bâtiments, recettes et paliers admissibles, ainsi que les flux qui référencent des ressources admissibles. Les bâtiments sans recette admissible sont écartés de la projection. Le modèle du `core` reste indépendant de la structure JSON et des modules.

La projection ne doit pas muter les données d'entrée. Elle est construite de manière déterministe. Les disponibilités régionales et insulaires restent conservées dans le référentiel ; elles ne sont pas encore consommées par le contrat actuel du `core`.

## 7. Consommation par la couche applicative

`packages/product` expose le cas d'usage :

```ts
simulateCatalogProduction({
  repository: dataRepository,
  island,
});
```

Le paramètre `repository` est un `DataRepository` obtenu par `loadGameData`. Le cas d'usage transmet uniquement `repository.coreCatalog` à `simulateProduction`, puis retourne le rapport de l'île. Il ne recharge pas le catalogue, ne contourne pas sa validation et ne duplique pas les règles de calcul du `core`.

La responsabilité de créer et conserver le référentiel appartient à la couche qui charge les données (actuellement le desktop). Plusieurs simulations peuvent réutiliser le même référentiel immuable.

Le desktop affiche actuellement le résumé du catalogue ; l'appel de `simulateCatalogProduction` depuis un flux de planification de l'IHM sera réalisé dans le lot consacré à l'interface.

## 8. Embarquement

Le package desktop importe les fichiers JSON locaux et fournit les modules à `loadGameData`. Le moteur ne réalise aucun accès filesystem ou réseau lui-même. La livraison d'une nouvelle version de l'application emporte la version correspondante du catalogue.

## 9. Tests

Le plan détaillé et la matrice de tests sont maintenus dans [Plan de tests du catalogue](../plan-tests-catalogue.md). Les fixtures automatisées sont synthétiques et ne valent pas données de jeu. La validation du packaging, du démarrage hors ligne et la campagne en jeu restent des contrôles distincts.

## 10. État de réalisation

Le modèle modulaire, les types de provenance, le validateur, la projection, les tests du moteur de données et l'import du catalogue dans le desktop sont présents sur la branche de fonctionnalité. Le cas d'usage applicatif consomme maintenant le `DataRepository` et délègue au moteur de calcul. Les nouveaux tests de raccordement doivent encore être exécutés localement. La campagne de vérification des données en jeu et l'utilisation du cas d'usage dans un écran de planification restent à réaliser.
