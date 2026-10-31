# Anno 117 Planner — Plan de développement par lots

**Version :** 1.5
**Date :** 31 octobre 2026
**Statut :** Référence de reconstruction et de réalisation — audit des données en cours
**Branche d’intégration :** `develop`
**Technologies cibles :** Electron, React, TypeScript, Vite, pnpm, Vitest

---

## 1. Objectif

Le développement d’Anno 117 Planner est organisé en étapes documentaires, lots techniques et lots fonctionnels indépendants. Chaque étape doit apporter un résultat cohérent, vérifiable et intégrable sans compromettre les fonctionnalités déjà validées.

**La documentation constitue la référence permettant de reconstruire l’application depuis un dépôt vide.** Aucun lot ne doit supposer qu’un module, un contrat, un écran, un jeu de données ou un test existe déjà. Avant chaque lot, l’état réel du dépôt doit être inspecté ; les éléments existants peuvent être réutilisés uniquement après vérification de leur conformité aux exigences décrites ici et dans les documents associés. En cas de reprise complète, les travaux antérieurs sont des éléments d’information, pas des prérequis.

Le projet vise à fournir un outil de planification de production pour Anno 117: Pax Romana, avec une architecture indépendante du moteur de calcul, un catalogue de données structuré et une application de bureau.

Le périmètre fonctionnel de référence est défini dans `docs/expression_de_besoin.md` et précisé par `docs/catalog-scope.md`. Le catalogue doit être documenté, audité et validé avant que son intégration complète soit engagée. Les documents de référence doivent permettre à une équipe de comprendre le produit attendu, ses règles métier, ses données, ses limites et les critères d'acceptation sans dépendre de l'historique des conversations ou de l'état actuel du code.

Le développement suit un cycle Git commun :

1. Vérifier l’état du dépôt et les modifications existantes.
2. Partir d’une branche de référence à jour.
3. Créer une branche dédiée à l’étape ou au lot.
4. Réaliser uniquement les modifications prévues.
5. Ajouter ou mettre à jour les tests et la documentation concernés.
6. Vérifier les critères de sortie.
7. Effectuer une revue des modifications et ouvrir une Pull Request vers la branche cible.
8. Vérifier la réussite de la CI obligatoire, puis fusionner la PR en Squash.
9. Vérifier l’état de la branche cible avant de commencer le travail suivant.

Les règles détaillées de branches, de versionnement, de tags et de commits sont définies dans le [Plan de gestion de configuration](plan-gestion-configuration.md).

Les lots doivent rester suffisamment limités pour permettre une revue et un diagnostic simples. Une étape documentaire ne doit pas introduire de modification fonctionnelle ou technique sans nécessité explicitement validée.

## 2. Principes de développement

### 2.1. Préserver le périmètre fonctionnel

L’expression de besoin existante reste la référence fonctionnelle.

Le périmètre V1 comprend :

- les régions jouables Latium et Albion ;
- la planification des productions et des consommations quantifiables ;
- la gestion de plusieurs îles ;
- une interface en français et en anglais ;
- les thèmes clair et sombre.

Le jeu complet, ses contenus téléchargeables et la région Worldmap ne sont pas inclus dans le catalogue de production V1. L’architecture pourra permettre des extensions ultérieures.

Toute évolution de périmètre doit être explicitement décidée et documentée.

### 2.2. Privilégier les évolutions incrémentales

Les modifications doivent être limitées aux fichiers et composants nécessaires. Une refonte générale n’est pas justifiée lorsqu’une correction ciblée suffit.

Les décisions techniques et fonctionnelles doivent être prises avant d'introduire une complexité qui ne répond pas à un besoin validé.

### 2.3. Séparer métier, données et interface

Le moteur de calcul doit rester indépendant d’Electron, de React et de toute technologie d’interface.

- `packages/core` : règles métier et calculs.
- `packages/product` : cas d’usage et orchestration.
- `packages/game-data` : catalogue et données du jeu.
- `apps/desktop` : application de bureau et interface utilisateur.

Les données ne doivent pas être confondues avec la logique de calcul. Les sources, hypothèses, unités et validations du catalogue doivent rester documentées.

### 2.4. Tester avant d’intégrer

Les tests existants doivent être conservés et enrichis. Aucun lot ne doit être déclaré validé si les vérifications prévues n’ont pas réellement été exécutées.

Les résultats doivent être documentés avec les commandes utilisées et les éventuelles limitations de l’environnement.

### 2.5. Sécurité et propriété intellectuelle

Le code, les dépendances et les données externes doivent respecter les licences et conditions d’utilisation qui leur sont applicables.

La licence du code d’un outil communautaire ne constitue pas automatiquement une autorisation de redistribuer les données, images, icônes, noms ou valeurs provenant du jeu.

Aucune donnée ne doit être considérée comme approuvée pour redistribution tant que sa provenance, son périmètre et les conditions de réutilisation applicables n’ont pas été examinés.

### 2.6. Distinguer validation technique et validation des droits

Un catalogue techniquement cohérent n’est pas nécessairement autorisé à être redistribué.

Deux validations distinctes sont donc requises :

- **Validation technique :** structure, couverture, références, unités et cohérence des données.
- **Validation des droits :** provenance, licences, conditions de réutilisation, attributions et restrictions éventuelles.

La validation technique ne vaut pas validation juridique.

---

## 3. Vue d’ensemble des étapes et des lots

| Étape | Branche cible | Objectif |
|---|---|---|
| Étape préalable | `feature/update-documents` | Actualiser la documentation, formaliser l’audit et les règles de réutilisation |
| Lot 1 | `feature/core-stabilization-gpt` | Stabiliser le moteur et son API publique |
| Lot 2 | `feature/desktop-electron-gpt` | Créer le socle Electron + React + Vite |
| Lot 3 | `feature/product-use-cases-gpt` | Introduire les cas d’usage et relier le moteur |
| Lot 4 | `feature/game-data-catalog-gpt` | Structurer, valider et intégrer progressivement le catalogue approuvé |
| Lot 5 | `feature/planner-ui-gpt` | Réaliser la première interface de planification |
| Lot 6 | `feature/ui-foundations-gpt` | Ajouter l’internationalisation et les thèmes |
| Lot 7 | `feature/scenario-persistence-gpt` | Ajouter la sauvegarde et l’export des scénarios |
| Lot 8 | `feature/multi-island-planning-gpt` | Étendre la planification à plusieurs îles |

Les noms de branches sont des références proposées. Ils doivent rester cohérents avec les branches réellement présentes dans le dépôt.

L’étape préalable est documentaire. Elle ne remplace pas les lots fonctionnels et ne doit pas modifier le code applicatif.

---

## 4. Étape préalable — Documentation, audit et réutilisation des données

**Branche :** `feature/update-documents`

### 4.1. Objectif

Mettre à jour la documentation de référence avant de poursuivre l’intégration des données du jeu.

Cette étape doit fournir une vision explicite du périmètre du catalogue, de son état d’avancement, de ses sources et des questions de réutilisation restant à résoudre. Elle doit également rendre le projet compréhensible et reconstructible indépendamment de l'implémentation actuellement présente dans le dépôt.

### 4.2. Périmètre

Créer ou actualiser les documents suivants dans `docs/` :

- `catalog-scope.md` : périmètre fonctionnel du catalogue ;
- `data-catalog-audit.md` : inventaire, contrôles de cohérence, anomalies et couverture ;
- `data-sources.md` : registre des sources, provenance et versions des données ;
- `data-licensing.md` : principes de réutilisation, licences et décisions à finaliser ;
- `plan_de_developpement.md` : plan de développement actualisé ;
- `anno117-planner-audit-catalogue.md` : synthèse de cadrage de l'audit.

Conserver les documents historiques du projet dans `docs/` : expression de besoin, guide de démarrage et installation de l'environnement. Le plan de développement est réécrit et doit devenir le document opératoire permettant de reprendre le projet sans présumer de l'existence du code actuel.

La documentation doit notamment préciser :

- les données incluses et exclues de la V1 ;
- les régions et contenus couverts ;
- les catégories de biens, bâtiments, recettes et besoins ;
- les règles de classement des données ;
- les versions des sources examinées ;
- les références manquantes ou incohérentes ;
- les hypothèses de modélisation ;
- les questions de licences et de redistribution non résolues ;
- les conditions nécessaires pour autoriser l’intégration des données.

### 4.3. Hors périmètre

- Modification du moteur de calcul.
- Modification de l’interface.
- Modification des contrats TypeScript existants.
- Intégration de nouvelles données au catalogue applicatif.
- Import automatisé de nouvelles sources.
- Modification de la licence du projet.
- Décision juridique non étayée sur les droits de réutilisation.

### 4.4. État de réalisation de l'étape documentaire

La mise à jour documentaire initiale a été commitée sur `feature/update-documents` dans le commit `93cdb1d` (29 octobre 2026). Ce commit constitue un jalon historique ; il ne signifie ni que le catalogue est validé, ni que cette branche a été intégrée dans `develop`.

Les documents de référence du catalogue sont :

- `docs/catalog-scope.md` ;
- `docs/data-catalog-audit.md` ;
- `docs/data-sources.md` ;
- `docs/data-licensing.md`.

Le document complémentaire `docs/anno117-planner-audit-catalogue.md` synthétise le cadrage de l'audit. Le plan de développement est `docs/plan_de_developpement.md`. Les documents historiques conservés sont `docs/expression_de_besoin.md`, `docs/guide_de_demarrage.md` et `docs/installation_environnement.md`.

Les corrections documentaires ultérieures doivent être enregistrées dans de nouveaux commits. L'état réel de la branche et son intégration dans `develop` doivent être vérifiés dans GitHub ; ne pas déduire qu'une étape est intégrée du seul fait qu'elle est commitée ou poussée.

### 4.5. Critères de sortie

- Les quatre documents de référence du catalogue sont présents dans `docs/`.
- Le document de cadrage global de l'audit est présent.
- Le plan de développement est cohérent avec les autres documents et permet une reprise depuis un dépôt vide.
- Les documents historiques sont conservés et leurs objectifs restent compréhensibles.
- Les sources et versions examinées sont identifiables.
- Les anomalies connues et les limites de l'audit sont documentées.
- Les questions de réutilisation non résolues restent explicitement ouvertes.
- `git diff --check` ne signale pas de problème de mise en forme.
- Le diff confirme que seuls les changements documentaires prévus sont présents.
- Les modifications sont relues, commités et intégrées dans `develop` après validation.

### 4.6. Documents ajoutés après la première revue\n\nLa revue de complétude documentaire a identifié des décisions métier à prendre avant de figer les contrats techniques. Deux documents complémentaires sont maintenant présents sur cette branche :\n\n- `docs/contrat-moteur-calcul.md` décrit le contrat conceptuel du moteur, les responsabilités, les cas de référence et les sujets encore ouverts ;\n- `docs/registre-decisions-fonctionnelles.md` centralise les décisions à arbitrer et leurs dépendances.\n\nCes documents sont des bases de travail, pas des spécifications fonctionnelles approuvées. Le lot 1 ne doit pas être considéré comme complètement spécifié tant que les décisions nécessaires et les résultats attendus des cas de référence ne sont pas validés.\n\n### 4.7. Condition de passage aux travaux sur le catalogue

La fin de cette étape autorise la poursuite du travail d'audit et de préparation du catalogue. Elle ne vaut pas autorisation de redistribuer les données.

L'intégration d'un catalogue complet reste conditionnée à la validation de sa couverture, de sa cohérence et des conditions de réutilisation applicables.

---

## 4 bis. Reprise complète depuis la documentation

Cette procédure s'applique si le dépôt est vide, si l'implémentation actuelle est abandonnée ou si une nouvelle équipe doit reconstruire l'application sans s'appuyer sur les travaux antérieurs.

### 4 bis.1. Sources de vérité

Lire dans cet ordre :

1. `docs/expression_de_besoin.md` : objectifs, utilisateurs, fonctionnalités et limites du produit ;
2. `docs/catalog-scope.md` : périmètre des données, régions, catégories et exclusions ;
3. `docs/data-sources.md` : provenance, versions et statut des sources ;
4. `docs/data-catalog-audit.md` et `docs/anno117-planner-audit-catalogue.md` : constats, anomalies, limites et travaux d'audit ;
5. `docs/data-licensing.md` : conditions de réutilisation et décisions ouvertes ;
6. le présent plan : architecture cible, séquence des lots et critères de sortie ;
7. `docs/installation_environnement.md` et `docs/guide_de_demarrage.md` : environnement et procédures de travail, à actualiser si les outils ont évolué.

En cas de contradiction, ne pas choisir silencieusement une version. Consigner l'écart, déterminer quel document porte la décision concernée, puis mettre à jour les documents liés avant de coder.

### 4 bis.2. Ordre de reconstruction

Repartir d'un dépôt propre et reconstruire dans l'ordre des lots 1 à 8. Pour chaque lot, produire d'abord une conception suffisamment précise (responsabilités, contrats, flux, erreurs, critères d'acceptation), puis l'implémentation et les tests. Ne pas créer à l'avance des abstractions pour des besoins non spécifiés.

- Lot 1 : moteur métier autonome et testé ;
- Lot 2 : application desktop Electron/React/Vite ;
- Lot 3 : cas d'usage et orchestration du moteur ;
- Lot 4 : modèle, audit final et intégration contrôlée du catalogue ;
- Lot 5 : interface de planification connectée aux cas d'usage ;
- Lot 6 : français/anglais et thèmes clair/sombre ;
- Lot 7 : persistance et export des scénarios ;
- Lot 8 : planification multi-îles.

Le lot 4 peut avancer en parallèle sur l'audit documentaire, mais aucune donnée non validée ne doit être présentée comme une donnée officielle ou intégrée par défaut. Des jeux de données synthétiques clairement identifiés peuvent être utilisés pour développer et tester les lots précédents.

### 4 bis.3. Règles de reconstruction

- Ne pas supposer l'existence d'un package, d'un script, d'un test ou d'un contrat.
- Vérifier les versions des outils et dépendances avant de figer les commandes d'installation.
- Créer les fichiers et packages minimaux nécessaires, puis vérifier le build, les tests et le typage à chaque étape.
- Maintenir une séparation nette entre données vérifiées, données synthétiques et données en cours d'audit.
- Documenter toute décision technique qui n'est pas déjà déterminée par les documents de référence.
- Ne pas reprendre automatiquement une architecture antérieure si elle contredit les exigences documentées.
- À chaque fin de lot, mettre à jour les instructions, les critères de sortie et les décisions qui ont évolué.

## 5. Détail des lots fonctionnels

### Lot 1 — Stabilisation du moteur métier

**Branche :** `feature/core-stabilization-gpt`

**Objectif :** spécifier, construire et stabiliser un moteur de calcul robuste, explicite et testable, indépendamment de l'état antérieur du dépôt.

#### Périmètre

- Définir les responsabilités, les concepts métier, les types et l'API publique du moteur à partir de l'expression de besoin et des règles documentées.
- Créer `packages/core` et ses exports publics si le package n'existe pas ; si des éléments existent, les auditer avant de les conserver.
- Définir les contrats des fonctions et types, sans dépendance à Electron, React ou aux fichiers de données concrets.
- Implémenter la validation des entrées : valeurs finies, taux, productivité, quantités et bâtiments existants.
- Définir les erreurs et comportements attendus pour les entrées invalides.
- Compléter les tests unitaires pour les cas limites et les erreurs.
- Vérifier la propagation des besoins, le calcul des bâtiments et les déficits.
- Vérifier le comportement relatif aux cycles de production.
- Clarifier la documentation du moteur et les commandes de test.

#### Hors périmètre

- Réécriture générale du moteur.
- Interface utilisateur.
- Catalogue exhaustif du jeu.
- Implémentation complète de plusieurs producteurs pour un même bien sans règles métier préalablement définies.
- Planification multi-îles.

#### Critères de sortie

- L’API publique est définie et utilisable.
- Les entrées invalides sont traitées explicitement.
- Les tests couvrent les comportements attendus et les principaux cas limites.
- Les règles métier existantes ne sont pas modifiées involontairement.
- Les tests et le contrôle TypeScript passent dans l’environnement de développement.
- La documentation décrit les limites qui restent ouvertes.

---

### Lot 2 — Socle de l’application Electron

**Branche :** `feature/desktop-electron-gpt`

**Objectif :** disposer d’une application de bureau minimale et fonctionnelle.

#### Périmètre

- Créer `apps/desktop`.
- Configurer Electron, React, TypeScript et Vite.
- Définir le processus principal Electron et le processus de rendu.
- Configurer un point d’entrée de développement utilisable depuis la racine du monorepo.
- Mettre en place une communication minimale et sécurisée entre le processus principal et le rendu, uniquement si nécessaire.
- Désactiver l’accès Node.js direct au rendu et privilégier `contextIsolation` et une API de préchargement limitée.
- Documenter les commandes de démarrage et de construction.

#### Hors périmètre

- Fonctionnalités métier complètes.
- Catalogue du jeu.
- Persistance des scénarios.
- Packaging et publication avancés.

#### Critères de sortie

- L’application démarre sous Windows.
- La fenêtre Electron affiche l’interface React.
- Le rechargement en développement fonctionne.
- La configuration de sécurité Electron est explicite.
- Les scripts du monorepo fonctionnent sans perturber `packages/core`.

---

### Lot 3 — Cas d’usage et intégration du moteur

**Branche :** `feature/product-use-cases-gpt`

**Objectif :** introduire une couche applicative qui orchestre les calculs métier.

#### Périmètre

- Créer `packages/product`.
- Définir un premier cas d’usage de simulation de production.
- Préparer les paramètres nécessaires à l’appel du moteur.
- Structurer les résultats : besoins, bâtiments théoriques, bâtiments existants et déficits.
- Utiliser des données de test simples et explicites.
- Ajouter des tests unitaires aux cas d’usage.
- Définir une frontière claire entre interface, orchestration et calcul métier.

#### Hors périmètre

- Interface complète.
- Catalogue exhaustif.
- Persistance.
- Gestion complète des scénarios multi-îles.

#### Critères de sortie

- Un cas d’usage peut être exécuté sans dépendance à Electron ou React.
- Les résultats du moteur sont correctement transformés en résultats applicatifs.
- Les tests valident l’orchestration et les erreurs attendues.
- Aucune logique de calcul métier n’est dupliquée dans `packages/product`.

---

### Lot 4 — Catalogue des données du jeu

**Branche :** `feature/game-data-catalog-gpt`

**Objectif :** séparer les données de production du code et préparer leur enrichissement progressif à partir de données auditées.

#### Périmètre

- Créer ou compléter `packages/game-data`.
- Définir les structures de données pour les biens, bâtiments, recettes, besoins et taux de production, conformément au modèle validé.
- Définir le périmètre exact des données V1.
- Exploiter les résultats de l’audit documentaire préalable.
- Vérifier la couverture du catalogue par rapport aux sources retenues.
- Identifier les données manquantes, les références conditionnelles et les éléments exclus.
- Définir les unités, les règles de conversion et les hypothèses de calcul.
- Introduire les données progressivement, après validation technique et examen des conditions de réutilisation.
- Ajouter des validations de cohérence des données.
- Définir comment les données sont chargées et transmises aux cas d’usage.
- Documenter les sources, les versions et les décisions d’intégration.

#### Hors périmètre

- Collecte exhaustive de toutes les données du jeu, y compris les DLC exclus de la V1.
- Import automatisé de données externes sans source et méthode validées.
- Logique de calcul directement intégrée au catalogue.
- Intégration de contenus dont le statut de réutilisation n’a pas été examiné.
- Extension non validée du périmètre fonctionnel.

#### Critères de sortie

- Le catalogue est indépendant du moteur.
- Les données sont structurées et validables.
- La couverture du périmètre V1 est mesurée et documentée.
- Les données de test ne sont pas confondues avec les données présentées comme vérifiées.
- Les références croisées sont cohérentes.
- Les sources et versions des données sont traçables.
- Les hypothèses et limites connues sont documentées.
- Les conditions de réutilisation des données intégrées ont été examinées pour l’usage prévu.
- Un cas d’usage peut utiliser le catalogue sans dépendre de l’interface.

Si des données restent non validées, leur statut doit être explicite. Le lot ne peut pas être déclaré complet sur la seule base de tests techniques réussis.

---

### Lot 5 — Première interface de planification

**Branche :** `feature/planner-ui-gpt`

**Objectif :** permettre une première utilisation réelle de l’application, de la saisie jusqu’aux résultats.

#### Périmètre

- Construire un écran de planification simple.
- Permettre la sélection des besoins et la saisie des paramètres nécessaires.
- Appeler les cas d’usage applicatifs.
- Afficher les besoins calculés, les bâtiments requis et les déficits.
- Présenter les erreurs de saisie et les erreurs métier de manière compréhensible.
- Ajouter des tests aux composants ou flux lorsque cela apporte une couverture utile.

#### Hors périmètre

- Interface graphique définitive.
- Toutes les fonctionnalités de confort.
- Planification multi-îles.
- Système complet de sauvegarde.

#### Critères de sortie

- Un scénario simple peut être préparé dans l’interface.
- Les résultats affichés correspondent aux résultats applicatifs.
- Les erreurs sont visibles et ne provoquent pas de plantage non maîtrisé.
- Le moteur reste indépendant de React.

---

### Lot 6 — Fondations de l’interface : langues et thèmes

**Branche :** `feature/ui-foundations-gpt`

**Objectif :** rendre l’interface cohérente et préparer son utilisation dans les langues prévues.

#### Périmètre

- Mettre en place l’internationalisation français/anglais.
- Centraliser les libellés et messages.
- Ajouter les thèmes clair et sombre.
- Définir les règles de persistance des préférences uniquement si nécessaire.
- Vérifier la lisibilité des résultats, messages d’erreur et formulaires dans les deux thèmes.

#### Critères de sortie

- Les libellés de l’interface sont traduisibles sans modifier la logique métier.
- Le changement de langue fonctionne.
- Les thèmes clair et sombre sont cohérents.
- Aucun texte fonctionnel important n’est laissé involontairement dans une seule langue.

---

### Lot 7 — Sauvegarde et export des scénarios

**Branche :** `feature/scenario-persistence-gpt`

**Objectif :** permettre à l’utilisateur de conserver et de réutiliser son travail.

#### Périmètre

- Définir le format de scénario.
- Enregistrer et recharger un scénario.
- Valider les données chargées.
- Gérer les erreurs de lecture et d’écriture.
- Définir une stratégie de versionnement du format si nécessaire.
- Étudier l’export des résultats dans un format adapté au besoin.

#### Critères de sortie

- Un scénario sauvegardé peut être rechargé sans perte des paramètres pris en charge.
- Les fichiers invalides sont rejetés avec un message explicite.
- Le format est documenté.
- Les tests couvrent les opérations principales et les erreurs.

---

### Lot 8 — Planification multi-îles

**Branche :** `feature/multi-island-planning-gpt`

**Objectif :** étendre la planification en tenant compte des ressources et productions réparties entre plusieurs îles.

#### Périmètre

- Formaliser le modèle d’une île et d’un scénario multi-îles.
- Définir l’affectation des bâtiments et des productions aux îles.
- Définir les règles de disponibilité et de transfert des biens.
- Distinguer les déficits locaux des déficits globaux.
- Étendre les cas d’usage et l’interface en conséquence.
- Ajouter des tests sur les flux inter-îles et les cas limites.

#### Critères de sortie

- Les règles de répartition et de transfert sont documentées.
- Les calculs distinguent correctement besoins locaux et besoins globaux.
- Les tests démontrent que les transferts ne créent pas artificiellement de ressources.
- Les scénarios mono-île existants restent valides.

Ce lot nécessite une conception fonctionnelle spécifique avant le développement. Il ne doit pas être anticipé par une complexification prématurée du moteur.

---

## 6. Processus Git standard pour chaque étape et chaque lot

Les conventions normatives de GitFlow simplifié, de nommage des branches, des commits, de versionnement et de release sont définies dans le [Plan de gestion de configuration](plan-gestion-configuration.md). Le présent chapitre décrit leur application dans le déroulement des lots.

### 6.1. Préparation

Avant de créer une branche :

- Vérifier que le répertoire de travail est propre ou identifier précisément les modifications en cours.
- Vérifier la branche courante.
- Vérifier l’état de `develop` et récupérer ses dernières modifications.
- Identifier les commits locaux qui doivent être conservés.
- Vérifier que les modifications non commités ne seront ni écrasées ni perdues.

Aucune modification non commitée ne doit être écrasée ou perdue.

### 6.2. Création de la branche

Créer une branche `feature/*` dédiée à partir de `develop` à jour. Les branches `fix/*` constituent l'exception : elles sont créées à partir de `main` et suivent le processus de correction et de merge-back décrit dans le [Plan de gestion de configuration](plan-gestion-configuration.md).

Exemple :

```bash
git status
git switch develop
git pull --ff-only
git switch -c feature/core-stabilization-gpt
```

Ces commandes supposent que le travail en cours est sauvegardé et que le dépôt distant utilise `origin`.

Si la branche existe déjà, vérifier son état avant toute opération. Ne pas recréer une branche existante ni supprimer du travail local pour appliquer mécaniquement cet exemple.

### 6.3. Développement et commits

- Limiter les modifications au périmètre de l’étape.
- Faire des commits cohérents et compréhensibles.
- Éviter les modifications de formatage massives non nécessaires.
- Ajouter les tests en même temps que les évolutions fonctionnelles.
- Mettre à jour la documentation concernée.
- Ne pas modifier une règle métier ambiguë sans décision explicite.
- Ne pas introduire de changement de code pendant une étape strictement documentaire.

### 6.4. Validation avant merge

Exécuter les contrôles pertinents pour l’étape ou le lot :

- tests unitaires ;
- contrôle TypeScript ;
- lint ;
- formatage ;
- construction de l’application si elle existe et si le lot la concerne ;
- `git diff --check` ;
- revue du diff et des fichiers concernés.

Les commandes exactes doivent être celles réellement configurées dans le dépôt. Un contrôle non exécuté doit être indiqué comme tel, jamais présenté comme réussi.

Pour une étape documentaire, la validation porte notamment sur la cohérence des documents, les liens internes, les chemins, les références aux fichiers et l’absence de modifications hors périmètre.

### 6.5. Pull Request et merge vers `develop`

L'intégration dans `develop` s'effectue exclusivement par Pull Request. La CI obligatoire doit être verte, la branche source à jour avec sa cible et les conversations de revue résolues. La fusion se fait en Squash.

Le merge est autorisé lorsque :

- les critères de sortie de l’étape sont satisfaits ;
- les contrôles concernés ont été exécutés ;
- les changements ont été relus ;
- aucune régression connue ne subsiste ;
- la documentation est à jour ;
- le diff correspond au périmètre prévu.

Le mode de fusion doit respecter le Ruleset du dépôt : Squash uniquement pour `main` et `develop`.

### 6.6. Après le merge

- Vérifier que `develop` contient les changements attendus.
- Exécuter les contrôles d’intégration disponibles.
- Supprimer la branche de fonctionnalité après confirmation du merge, si la politique du dépôt le prévoit.
- Créer la branche suivante depuis `develop` à jour.

---

## 7. Gestion des dépendances entre lots

Les lots suivent l’ordre défini dans ce document, sauf décision explicite.

Si une dépendance technique ou fonctionnelle impose une modification du plan :

1. Identifier le blocage.
2. Déterminer le lot auquel appartient réellement la modification.
3. Éviter d’introduire une fonctionnalité complète dans la branche d’un autre lot.
4. Si un prérequis manque, l’intégrer dans un lot dédié ou mettre à jour le plan.
5. Documenter la décision et son impact sur les branches.

Un lot peut nécessiter plusieurs petits commits, mais il ne doit pas devenir un regroupement de sujets sans lien.

Les données de test utilisées dans les lots 1 et 3 ne doivent pas être présentées comme un catalogue vérifié du jeu.

Le lot 4 dépend des résultats de l’audit documentaire et de l’examen des conditions de réutilisation. Les données qui n’ont pas passé ces validations doivent rester identifiées comme non validées ou être exclues du périmètre intégré.

---

## 8. Documentation et traçabilité

Chaque étape doit mettre à jour la documentation affectée par ses changements.

Les documents de référence comprennent notamment :

- `docs/expression_de_besoin.md` : référence fonctionnelle ;
- `docs/plan_de_developpement.md` : séquencement des lots ;
- `docs/catalog-scope.md` : périmètre du catalogue ;
- `docs/data-catalog-audit.md` : inventaire, couverture et contrôles ;
- `docs/data-sources.md` : sources et provenance ;
- `docs/data-licensing.md` : licences et conditions de réutilisation ;
- le README et la documentation de développement ;
- les documents d’architecture et de décisions techniques, à compléter au fil du projet.

Les décisions structurantes — règles de calcul, modèle de données, sécurité Electron, persistance, périmètre du catalogue et conditions de réutilisation — doivent être documentées lorsqu’elles sont prises.

Les résultats d’audit doivent être reproductibles autant que possible. Les versions des sources, les commandes utilisées, les résultats observés et les limites connues doivent être consignés.

Une source citée dans la documentation n’est pas automatiquement une source approuvée pour redistribution.

---

## 9. Règle de clôture d’une étape ou d’un lot

Une étape ou un lot est considéré comme terminé uniquement lorsque :

1. Son périmètre est respecté.
2. Ses critères de sortie sont satisfaits.
3. Les tests et contrôles prévus ont été exécutés.
4. La documentation nécessaire est à jour.
5. Les modifications ont été revues.
6. Le merge vers `develop` est terminé, lorsque le processus de merge s’applique.
7. `develop` est dans un état vérifié.

Pour les lots qui introduisent des données, il faut également distinguer explicitement la validation technique de la validation des conditions de réutilisation.

**Le merge ne remplace pas la validation.** Il constitue l’intégration d’une étape ou d’un lot qui a déjà satisfait ses critères de sortie.

La clôture de l’étape documentaire ne constitue pas une validation juridique globale du catalogue et ne dispense pas des contrôles prévus au lot 4.

---

## 10. État du projet et prochaine action

### 10.1. Jalons documentaires

La première version de la mise à jour documentaire a été commitée sur `feature/update-documents` dans le commit `93cdb1d` le 29 octobre 2026. Ce commit constitue un jalon historique, pas une validation du catalogue ni une preuve d'intégration dans `develop`.

Les corrections de cohérence et de reconstructibilité sont suivies dans des commits ultérieurs sur la même branche. L'état de GitHub doit être consulté pour identifier le dernier commit réellement présent.

### 10.2. Documents de référence

Le dossier `docs/` contient les documents nécessaires pour comprendre et reconstruire le projet :

- `expression_de_besoin.md` : besoin produit et fonctionnalités attendues ;
- `plan_de_developpement.md` : architecture cible, séquence de reconstruction et critères de sortie ;
- `catalog-scope.md` : périmètre des données V1 ;
- `data-catalog-audit.md` : inventaire, contrôles, anomalies et couverture ;
- `data-sources.md` : sources, versions et provenance ;
- `data-licensing.md` : conditions de réutilisation et décisions ouvertes ;
- `anno117-planner-audit-catalogue.md` : synthèse et axes de travail de l'audit ;
- `installation_environnement.md` et `guide_de_demarrage.md` : procédures de préparation et de travail, à vérifier et actualiser au besoin.

### 10.3. État Git vérifié et prochaine action — 31 octobre 2026

L'état du dépôt a été contrôlé sur GitHub le 31 octobre 2026 :

- le lot 1 (stabilisation du moteur) est intégré dans `develop` via la PR #2 ;
- le lot 2 (socle Electron) est intégré via la PR #3 ;
- le lot 3 (cas d'usage produit) est intégré via la PR #5 ;
- le premier socle du lot 4 (catalogue de données) est intégré via la PR #6 ;
- l'évolution du moteur de calcul relative au graphe de production est intégrée via la PR #7 ;
- l'étape documentaire initiale est intégrée via la PR #8 ;
- le raccordement du référentiel modulaire `DataRepository` à la couche `product` est intégré via la PR #9 (squash merge).

La PR #9 a été validée localement avec 54 tests réussis, le typecheck des cinq projets et le build Electron. Le workflow GitHub Actions « Tests, typecheck and build » a également réussi.

Au dernier contrôle, `develop` pointe sur le commit `2b1438952ca00a2efbd3b32a0cf3f0bc003cd198`. `main` pointe encore sur le commit initial `7450549f5e84f6df4cf8fac88bf98f7198c5c691` ; aucune release stable ni aucun tag Git n'ont été publiés. Le lot 4 reste ouvert pour la constitution et la validation des données réelles du jeu. Le lot 5 n'est pas encore commencé.

La branche `feature/configuration-rules`, créée depuis `develop`, porte le plan de gestion de configuration, le Ruleset importable, ainsi que l'extension du workflow CI à `main` et `develop`. La PR #10 est ouverte vers `develop`. Sa CI a réussi sur le commit `9afc4b01370d52d503db4ee3a745eb71c43c0dce`. Le propriétaire du dépôt a confirmé l'import et l'activation du Ruleset le 31 octobre 2026 ; l'effectivité du blocage de fusion doit encore être vérifiée sur les branches protégées.

La politique de versionnement retient `0.1.0` comme version de développement courante. La première release stable visée est `1.0.0), éventuellement précédée de candidates `1.0.0-rc.N). Le tag stable `v1.0.0) sera créé uniquement après réussite du build, des tests, de l'installation et de la validation fonctionnelle sur le commit exact de `main).

### Prochaine action

Finaliser et intégrer le [Plan de gestion de configuration](plan-gestion-configuration.md), puis vérifier que le Ruleset importé bloque effectivement les fusions non conformes vers `develop) et `main). La procédure de release et de pose du tag stable est désormais explicitée ; aucune release n'est engagée à ce stade.

Une fois ce socle de gestion de configuration validé et intégré, le lot 5 (première interface de planification) pourra être préparé conformément à ses critères. Les ajustements graphiques et ergonomiques de l'IHM seront traités dans un cycle distinct.

### 10.4. Règle de continuité

Le présent plan doit rester utilisable sans accès aux conversations précédentes. Toute décision qui modifie le périmètre, l'architecture, les règles métier, les sources ou les critères d'acceptation doit être consignée dans le document de référence approprié, puis répercutée dans les documents dépendants.

En cas de reprise complète, ignorer les hypothèses implicites liées aux anciennes branches, commits, packages ou fonctionnalités. Repartir des exigences documentées, vérifier l'état réel du dépôt et suivre les lots dans l'ordre défini.
