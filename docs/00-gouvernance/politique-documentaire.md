# Politique documentaire — Anno 117 Planner

**Version :** 1.0  
**Date :** 30 octobre 2026  
**Statut :** référence documentaire — validée pour application au dépôt

## 1. Objet

Cette politique définit l'organisation, les conventions de rédaction, les statuts et les critères de qualité de la documentation du projet. Elle s'applique aux documents conservés dans `docs/` et aux informations de présentation du README racine.

## 2. Architecture documentaire

| Répertoire | Domaine | Contenu |
|---|---|---|
| `00-gouvernance/` | Gouvernance | Politique documentaire, registre des décisions et revues transverses |
| `10-fonctionnel/` | Fonctionnel | Expression du besoin, spécifications, règles métier et critères d'acceptation |
| `20-technique/` | Technique | Architecture, conception, contrats, qualité, données, sources et contraintes |
| `30-plans/` | Plans | Plan de développement, roadmap, validation et livraison |
| `40-manuel/` | Manuel | Installation, démarrage, exploitation et guides pratiques |
| `90-archives/` | Archives | Documents obsolètes conservés pour leur valeur historique |

Chaque domaine possède un fichier `README.md` servant d'index. Les numéros assurent un ordre de lecture stable ; ils ne représentent ni une priorité ni un niveau d'autorité.

## 3. Conventions de nommage

- Utiliser des noms explicites en minuscules, sans accents, séparés par des tirets.
- Préférer un nom décrivant le sujet plutôt qu'un préfixe `SF_`, `PL_` ou `MA_` : le répertoire porte déjà l'information de classement.
- Réserver les identifiants stables (par exemple `DEC-xxx`, `CORE-xxx`, `SRC-xxx`) aux décisions, exigences, cas de test et sources référencés.
- Éviter de renommer un identifiant déjà référencé ; conserver sa traçabilité s'il devient obsolète.

## 4. Statuts documentaires

Pour les documents normatifs ou de référence, employer un statut explicite :

- **Brouillon** : contenu en cours de rédaction, non approuvé.
- **En revue** : contenu soumis à vérification ou arbitrage.
- **Validé** : contenu approuvé et applicable dans le périmètre indiqué.
- **À compléter** : document utilisable mais dont des sections ou décisions restent ouvertes.
- **Obsolète** : document remplacé ou qui ne doit plus servir de référence courante.

Un statut « validé » exige une approbation explicite du propriétaire du projet. Les statuts propres à un audit (par exemple « audit en cours ») peuvent être conservés lorsqu'ils décrivent mieux son avancement.

## 5. En-tête documentaire

Selon sa nature, un document indique les métadonnées utiles : titre, version ou date de mise à jour, statut, périmètre, responsable si pertinent, documents de référence et décisions applicables. Ne pas ajouter artificiellement des métadonnées sans valeur : un guide pratique peut rester léger, tandis qu'une spécification ou un contrat doit être précisément identifié.

## 6. Critères de qualité par domaine

### 6.1 Gouvernance
- Identifier les décisions et leur statut.
- Conserver date, justification, périmètre et documents impactés.
- Distinguer décision validée et proposition.
- Maintenir l'historique nécessaire à la compréhension des évolutions.

### 6.2 Fonctionnel
- Décrire le besoin et le comportement attendu sans imposer prématurément une solution technique.
- Employer un vocabulaire stable et défini.
- Distinguer exigences, règles métier, hypothèses et points à arbitrer.
- Préciser entrées, sorties, préconditions et cas limites lorsque nécessaire.
- Fournir des critères d'acceptation vérifiables.
- Ne jamais transformer une proposition en exigence validée sans décision explicite.

### 6.3 Technique
- Décrire responsabilités, interfaces, dépendances et contraintes.
- Préciser contrats d'entrée/sortie, validations, erreurs et déterminisme lorsqu'ils s'appliquent.
- Distinguer architecture cible et état réellement présent dans le dépôt.
- Documenter hypothèses, limites et décisions techniques.
- Relier les exigences pertinentes aux mécanismes de vérification.
- Assurer traçabilité, provenance et examen des droits de réutilisation des données.

### 6.4 Plans
- Définir périmètre et objectifs.
- Identifier lots, dépendances, livrables et critères de sortie.
- Distinguer prévisionnel et avancement constaté.
- Ne pas présenter comme réalisé un élément qui n'a pas été vérifié dans le dépôt.
- Réviser les plans lorsque décisions ou contraintes changent.

### 6.5 Manuel
- Préciser public et objectif.
- Indiquer prérequis et versions lorsqu'ils sont déterminants.
- Fournir étapes reproductibles et commandes exactes.
- Préciser résultat attendu et vérifications utiles.
- Signaler limites, variantes et erreurs fréquentes.
- Rester cohérent avec l'état réel du dépôt.

## 7. Règles transverses

- Tout document possède un objectif identifiable et un périmètre non ambigu.
- Termes et unités restent cohérents dans toute la documentation.
- Les liens internes sont relatifs et vérifiés après tout déplacement.
- Les documents normatifs distinguent règles validées, propositions et questions ouvertes.
- Une décision transverse est inscrite au registre de gouvernance puis répercutée dans les documents concernés.
- Les données manquantes ou incertaines ne sont jamais présentées comme confirmées.
- Les documents obsolètes ne sont pas supprimés automatiquement : leur archivage dépend de leur utilité historique et de l'absence de confusion.
- Les changements documentaires sont versionnés dans Git et cohérents avec le code et l'état réel du projet.

## 8. Revue documentaire

Avant de terminer une modification, vérifier :
1. le classement et la conformité du nom ;
2. l'objectif, le périmètre et le statut ;
3. la cohérence avec les décisions validées ;
4. les liens internes et références croisées ;
5. l'absence de contradiction entre documents ;
6. la distinction entre état constaté, cible, hypothèse et proposition.

Cette revue peut être réalisée dans une pull request ou lors d'une revue documentaire dédiée.

## 9. Évolution

Toute évolution de l'architecture documentaire ou de ces règles est apportée à ce document. Un changement de classement s'accompagne de la mise à jour des index et des liens concernés.
