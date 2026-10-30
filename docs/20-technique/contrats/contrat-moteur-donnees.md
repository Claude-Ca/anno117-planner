# Contrat du moteur de données

**Version :** 1.0  
**Statut :** proposition de travail — à valider  
**Composant cible :** `packages/data-engine`

## 1. Objet

Le moteur de données transforme plusieurs ensembles locaux, cohérents et versionnés en un référentiel unique, validé et consommable par le `core`. Il constitue la frontière entre le modèle de données du jeu et le modèle métier du calculateur.

## 2. Responsabilités

Le moteur doit :
- charger les catalogues locaux déclarés ;
- vérifier la version du schéma et du jeu ciblé ;
- valider chaque ensemble et ses références croisées ;
- agréger les ensembles sans perte ni mutation des données d'origine ;
- exposer une représentation stable au `core` ;
- produire des diagnostics localisables ;
- échouer explicitement en présence d'une erreur bloquante.

Il ne doit pas :
- interroger Internet ou une API externe ;
- importer automatiquement des données communautaires ;
- décider de la stratégie inter-îles ;
- effectuer les calculs de production ou d'optimisation ;
- transformer une valeur absente ou inconnue en zéro ;
- masquer les données non vérifiées.

## 3. Entrée conceptuelle

Le moteur reçoit un manifeste et des modules de catalogue. Chaque module représente un domaine fonctionnel indépendant.

Le manifeste identifie au minimum :
- l'identifiant et la version du catalogue ;
- la version du schéma ;
- le périmètre de jeu (jeu de base, régions couvertes) ;
- les modules constitutifs ;
- la version du jeu observée ou ciblée.

Les modules peuvent couvrir les ressources, bâtiments, recettes, population et besoins, régions, fertilités et gisements. Les références inter-modules utilisent des identifiants stables.

## 4. Sortie

Le moteur expose :
1. un référentiel agrégé complet pour les usages applicatifs ;
2. une vue adaptée au contrat du `core`, sans métadonnées éditoriales inutiles au calcul ;
3. des métadonnées de version et de couverture ;
4. des diagnostics de validation, ou une erreur bloquante si le référentiel ne peut pas être utilisé de façon sûre.

La sortie doit être déterministe pour une même version de catalogue.

## 5. Règles de validation

Les contrôles minimaux couvrent :
- unicité des identifiants dans leur domaine ;
- existence et cohérence des références croisées ;
- cohérence entre bâtiment et recettes associées ;
- validité des nombres et des unités ;
- distinction entre valeur nulle, absente, inconnue et non applicable ;
- statut de vérification et provenance interne des données ;
- absence de références orphelines après filtrage du périmètre V1.

Les contrôles bloquants empêchent l'exposition du catalogue au `core`. Les avertissements peuvent signaler une couverture incomplète sans invalider les éléments indépendants déjà exploitables, à condition que cette politique soit explicite.

## 6. Agrégation

L'agrégation assemble les modules à partir de leurs identifiants et ne doit pas :
- modifier les objets sources ;
- dupliquer une entité référencée ;
- fusionner des éléments sur la seule base de leur libellé ;
- résoudre silencieusement un conflit ;
- choisir arbitrairement entre deux valeurs contradictoires.

Tout conflit doit produire un diagnostic et nécessiter une correction du catalogue ou une décision documentée.

## 7. Interface avec le core

Le moteur de données est seul responsable de l'adaptation vers `Catalog` défini par `@anno117/core`. Le core reçoit des données déjà validées et ne dépend pas de `game-data`, de JSON ou de la structure des modules.

Le contrat exact sera aligné sur les capacités réellement prises en charge par le core. Les données de régions et de disponibilités locales ne seront exposées au calcul que lorsque le core aura un contrat correspondant ; elles ne doivent pas être perdues du référentiel agrégé.

## 8. Chargement local et cycle de vie

Le catalogue est embarqué dans le package applicatif. Le chargement initial est local, déterministe et sans accès réseau. Une instance de référentiel validé peut être réutilisée par les cas d'usage de l'application.

La stratégie de mise à jour du catalogue est liée à la livraison d'une version de l'application. Aucun mécanisme de mise à jour distante n'est prévu pour la V1.

## 9. Tests d'acceptation

- Un catalogue complet et cohérent est chargé.
- Un module manquant est signalé.
- Un identifiant dupliqué est rejeté.
- Une référence croisée inconnue est signalée.
- Une incohérence recette/bâtiment est rejetée.
- Une donnée non vérifiée n'est pas silencieusement considérée comme validée.
- Une valeur absente n'est pas convertie en zéro.
- L'agrégation est déterministe et ne mute pas les modules.
- La conversion vers le core respecte son contrat.
- Le chargement ne réalise aucun appel réseau.

## 10. État

Ce document fixe les responsabilités et invariants de conception. Les structures TypeScript précises et les critères bloquants seront implémentés et testés au fil de la branche. Toute divergence devra être répercutée dans ce contrat.
