# Anno 117 Planner — Plan de développement par lots

**Version :** 1.1
**Date :** 29 octobre 2026
**Statut :** Plan actualisé — réalisation progressive
**Branche d’intégration :** `develop`
**Technologies cibles :** Electron, React, TypeScript, Vite, pnpm, Vitest

---

## 1. Objectif

Le développement d’Anno 117 Planner est organisé en étapes documentaires, lots techniques et lots fonctionnels indépendants. Chaque étape doit apporter un résultat cohérent, vérifiable et intégrable sans compromettre les fonctionnalités déjà validées.

Le projet vise à fournir un outil de planification de production pour Anno 117: Pax Romana, avec une architecture indépendante du moteur de calcul, un catalogue de données structuré et une application de bureau.

Le périmètre fonctionnel de référence est défini dans l’expression de besoin. Le catalogue doit être documenté, audité et validé avant que son intégration complète soit engagée.

Le développement suit un cycle Git commun :

1. Vérifier l’état du dépôt et les modifications existantes.
2. Partir d’une branche de référence à jour.
3. Créer une branche dédiée à l’étape ou au lot.
4. Réaliser uniquement les modifications prévues.
5. Ajouter ou mettre à jour les tests et la documentation concernés.
6. Vérifier les critères de sortie.
7. Effectuer une revue des modifications.
8. Intégrer les changements dans `develop` après validation.
9. Vérifier l’état de `develop` avant de commencer le travail suivant.

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

Cette étape doit fournir une vision explicite du périmètre du catalogue, de son état d’avancement, de ses sources et des questions de réutilisation restant à résoudre.

### 4.2. Périmètre

Créer ou actualiser les documents suivants dans `docs/` :

- `catalog-scope.md` : périmètre fonctionnel du catalogue ;
- `data-catalog-audit.md` : inventaire, contrôles de cohérence, anomalies et couverture ;
- `data-sources.md` : registre des sources, provenance et versions des données ;
- `data-licensing.md` : principes de réutilisation, licences et décisions à finaliser ;
- `plan_de_developpement.md` : plan de développement actualisé.

Conserver les documents historiques du projet et vérifier leur emplacement après le renommage du répertoire `documents/` en `docs/`.

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

### 4.4. Critères de sortie

- Les quatre documents de référence du catalogue sont présents dans `docs/`.
- Le plan de développement est actualisé et cohérent avec les autres documents.
- Les documents historiques ont été conservés.
- Les sources et versions examinées sont identifiables.
- Les anomalies connues et les limites de l’audit sont documentées.
- Les questions de réutilisation non résolues restent explicitement ouvertes.
- `git diff --check` ne signale pas de problème de mise en forme.
- Les modifications ont été relues.
- Le diff confirme que seuls les changements documentaires prévus sont présents.
- Les changements sont commités et intégrés dans `develop` après validation.

### 4.5. Condition de passage aux travaux sur le catalogue

La fin de cette étape autorise la poursuite du travail d’audit et de préparation du catalogue. Elle ne vaut pas autorisation de redistribuer les données.

L’intégration d’un catalogue complet reste conditionnée à la validation de sa couverture, de sa cohérence et des conditions de réutilisation applicables.

---

## 5. Détail des lots fonctionnels

### Lot 1 — Stabilisation du moteur métier

**Branche :** `feature/core-stabilization-gpt`

**Objectif :** rendre le moteur de calcul plus robuste, explicite et testable avant de construire l’application autour de lui.

#### Périmètre

- Définir les exports publics de `packages/core/src/index.ts`.
- Examiner les contrats des fonctions et types existants.
- Ajouter la validation des entrées : valeurs finies, taux, productivité, quantités et bâtiments existants.
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

### 6.1. Préparation

Avant de créer une branche :

- Vérifier que le répertoire de travail est propre ou identifier précisément les modifications en cours.
- Vérifier la branche courante.
- Vérifier l’état de `develop` et récupérer ses dernières modifications.
- Identifier les commits locaux qui doivent être conservés.
- Vérifier que les modifications non commités ne seront ni écrasées ni perdues.

Aucune modification non commitée ne doit être écrasée ou perdue.

### 6.2. Création de la branche

Créer une branche dédiée à partir de `develop` à jour, avec le nom défini pour l’étape ou le lot.

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

### 6.5. Merge vers `develop`

Le merge est autorisé lorsque :

- les critères de sortie de l’étape sont satisfaits ;
- les contrôles concernés ont été exécutés ;
- les changements ont été relus ;
- aucune régression connue ne subsiste ;
- la documentation est à jour ;
- le diff correspond au périmètre prévu.

Le mode de merge — merge commit ou squash — doit suivre la convention retenue pour le dépôt.

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

## 10. Première action à réaliser

La première action est de terminer l’étape documentaire sur `feature/update-documents`.

Les quatre documents suivants sont désormais présents dans `docs/` :

- `catalog-scope.md`
- `data-catalog-audit.md`
- `data-sources.md`
- `data-licensing.md`

Le présent plan doit être enregistré dans `docs/plan_de_developpement.md`.

Avant de créer le commit :

1. Vérifier les modifications de renommage du répertoire historique `documents/` vers `docs/`.
2. Vérifier que les quatre documents historiques ont été conservés.
3. Vérifier que les cinq documents de référence attendus sont présents.
4. Exécuter `git diff --check`.
5. Examiner `git status --short` et le diff complet.
6. Confirmer qu’aucun fichier de code ni aucune donnée du catalogue n’a été modifié.
7. Commiter les modifications documentaires.
8. Faire relire les changements avant leur intégration dans `develop`.

Une fois cette étape intégrée, reprendre le séquencement prévu par le plan en vérifiant l’état réel de `feature/production-calculator-gpt` et de `develop`.

Le travail déjà présent doit être conservé et son rattachement clarifié avant toute opération de branchement.

Le premier lot fonctionnel reste le lot 1, consacré à la stabilisation du moteur métier et de son API publique. La création ou l’évolution de l’application Electron suivra selon le séquencement défini.

L’intégration complète du catalogue demeure soumise aux validations prévues au lot 4.