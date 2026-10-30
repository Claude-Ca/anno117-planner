# Revue de complétude documentaire — Anno 117 Planner

**Version :** 1.0  
**Date :** 29 octobre 2026  
**Branche examinée :** `feature/update-documents`  
**Nature :** revue documentaire, sans modification du code applicatif  
**Statut :** diagnostic initial — décisions fonctionnelles encore nécessaires

---

## 1. Objet et conclusion

Cette revue vérifie si la documentation permet à un développeur qui ne connaît pas l'historique du projet de reconstruire Anno 117 Planner depuis un dépôt vide, puis de vérifier que le résultat correspond au produit attendu.

**Conclusion : la documentation donne désormais un bon cadre de reconstruction technique et un périmètre général du produit, mais elle ne constitue pas encore une spécification fonctionnelle suffisante pour reconstruire fidèlement toutes les fonctionnalités sans arbitrages complémentaires.**

Le plan de développement décrit les lots, l'architecture cible et des critères de sortie. L'expression de besoin identifie les objectifs et les principales fonctions. Le périmètre du catalogue décrit les entités et les précautions de modélisation. En revanche, plusieurs règles de comportement restent formulées comme des intentions ou des points à arbitrer.

Il ne faut pas combler ces lacunes par des suppositions pendant le développement. Les décisions doivent être prises, documentées et transformées en critères d'acceptation avant le lot concerné.

Cette revue ne vaut ni validation finale du besoin par le propriétaire du projet, ni validation des données du jeu, ni avis juridique.

## 2. Documents examinés

| Document | Rôle | Appréciation |
|---|---|---|
| `expression_de_besoin.md` | Finalité, périmètre et exigences initiales | Base utile, mais plusieurs exigences restent générales ou ouvertes |
| `plan_de_developpement.md` | Architecture cible, lots, séquencement et reconstruction | Cadre de réalisation exploitable ; certains critères dépendent encore de décisions fonctionnelles |
| `catalog-scope.md` | Périmètre et règles de modélisation du catalogue | Bon cadrage des données ; comportement attendu du simulateur encore à préciser |
| `data-catalog-audit.md` | Inventaire et contrôles structurels | Document d'audit, pas une spécification fonctionnelle |
| `data-sources.md` | Sources et provenance | Registre initial ; versions, dates et traçabilité détaillée restent à compléter |
| `data-licensing.md` | Examen des droits et règles de réutilisation | Politique prudente ; décisions d'usage et de publication non finalisées |
| `anno117-planner-audit-catalogue.md` | Synthèse de l'audit du catalogue | Utile pour comprendre les constats et les limites de l'audit |
| `installation_environnement.md` | Préparation d'un poste Windows | Procédure détaillée, mais versions et commandes devront être confrontées au dépôt reconstruit |
| `guide_de_demarrage.md` | Workflow développeur | Contient encore des références à l'ancienne arborescence et à l'état historique du dépôt |

## 3. Éléments suffisamment définis

Les éléments suivants peuvent être considérés comme des orientations de référence, sous réserve de validation globale de l'expression de besoin.

### 3.1 Produit et périmètre

- Application de bureau Windows destinée à la planification de production d'Anno 117: Pax Romana.
- V1 limitée au jeu de base, aux régions Latium et Albion.
- DLC et région Worldmap exclus du catalogue V1.
- Calcul de production et de consommation quantifiables ; pas de simulation exhaustive de l'économie du jeu.
- Planification multi-îles incluse dans la V1, réalisée dans le lot 8.
- Interface française et anglaise, thèmes clair et sombre.
- Architecture extensible pour de futurs contenus, sans inclure ces contenus dans la V1.

### 3.2 Architecture et principes techniques

- TypeScript, React et Electron, avec Vite et pnpm workspaces.
- Séparation entre moteur métier, orchestration applicative, données du jeu et interface desktop.
- Moteur indépendant de React et Electron, déterministe et testable.
- Tests automatisés et contrôles de types.
- Inspection de l'état réel du dépôt avant réutilisation du code existant.
- Possibilité de reconstruire depuis un dépôt vide sans dépendre d'anciens commits ou de conversations.

### 3.3 Données et prudence de réutilisation

- Séparation des biens, bâtiments, recettes, besoins, résidences, populations et contraintes géographiques.
- Distinction entre bâtiments et recettes.
- Distinction entre données absentes, nulles, inconnues et non applicables.
- Pas d'assimilation automatique des services et merveilles à des biens consommables.
- Traçabilité des sources et versions.
- Validation technique distincte de l'examen des droits.
- Aucune donnée non validée ne doit être considérée comme autorisée à être redistribuée.

## 4. Lacunes fonctionnelles à lever

Les points ci-dessous sont des questions réelles de conception. Les options éventuelles ne sont pas des décisions prises : elles servent à rendre l'arbitrage concret.

### 4.1 Entrées et objectif d'un scénario

**État documentaire :** l'expression de besoin indique que l'utilisateur pourrait saisir des besoins en biens, un objectif de population ou les deux, sans arrêter le comportement V1.

À décider :
- Un scénario commence-t-il par des objectifs de population, par une liste de biens à produire, ou accepte-t-il les deux modes ?
- Comment l'utilisateur définit-il une population : nombre de résidences, nombre d'habitants, ou nombre de résidences par niveau ?
- Les besoins sont-ils sélectionnés individuellement par niveau de population ?
- Comment représenter les besoins optionnels, les besoins de progression et les besoins procurant des avantages ?
- Peut-on mélanger plusieurs régions dans un même scénario ?

**Livrable attendu :** spécification des entrées, de leurs validations et des règles d'agrégation.

### 4.2 Consommation des habitants

**État documentaire :** les besoins, les taux de consommation et la sélection des besoins sont identifiés, mais les conventions de calcul ne sont pas figées.

À décider :
- Unité de référence de la consommation et période de calcul.
- Signification exacte des taux du catalogue et éventuels facteurs de consommation.
- Règles d'arrondi et précision conservée pendant les calculs.
- Effet d'une population partiellement satisfaite.
- Traitement des besoins sans taux vérifié.
- Comportement lorsque l'utilisateur ne sélectionne aucun besoin d'une catégorie.

**Livrable attendu :** règles de calcul de consommation, unités, exemples chiffrés de référence et cas limites.

### 4.3 Production et dimensionnement

**État documentaire :** le calcul des bâtiments et la propagation des besoins sont prévus, mais les conventions de calcul restent incomplètes.

À décider :
- Unité de temps commune (par exemple minute ou heure) et normalisation des cycles.
- Sens précis des quantités d'entrée et de sortie d'une recette.
- Règle d'arrondi du nombre de bâtiments et précision des capacités.
- Gestion des recettes alternatives et de plusieurs producteurs pour un même bien.
- Choix entre plusieurs recettes possibles : choix manuel, règle automatique, ou les deux.
- Gestion des sous-produits et des recettes produisant plusieurs biens.
- Traitement des cycles, recettes invalides et chaînes sans producteur.
- Différence entre production théorique, production réalisable et production effectivement disponible.

**Livrable attendu :** spécification mathématique du moteur, exemples de calcul validés et résultats attendus pour les cas limites.

### 4.4 Productivité, main-d'œuvre et entretien

**État documentaire :** ces paramètres sont recensés, mais leur interaction n'est pas définie.

À décider :
- Quels modificateurs de productivité sont pris en charge en V1 ?
- Comment les bonus et malus se cumulent-ils ?
- Les modificateurs s'appliquent-ils à une recette, un bâtiment, une île ou au scénario ?
- La main-d'œuvre est-elle une contrainte bloquante ou une information de dimensionnement ?
- Les coûts d'entretien sont-ils intégrés au calcul des biens ou seulement affichés ?
- Les effets d'un manque de main-d'œuvre ou d'entretien sont-ils simulés ?

**Livrable attendu :** liste des facteurs pris en charge, formule de cumul, portée de chaque facteur et limites explicites.

### 4.5 Contraintes géographiques et disponibilité des ressources

**État documentaire :** fertilités, gisements, littoral, marais, rivière, montagne et emplacements sont identifiés. Leur prise en compte effective dans les calculs V1 reste à décider.

À décider :
- L'utilisateur déclare-t-il les fertilités et gisements disponibles sur chaque île ?
- Comment sont représentées les quantités ou capacités limitées, si elles sont pertinentes ?
- Les contraintes de placement sont-elles de simples avertissements ou empêchent-elles l'affectation d'un bâtiment ?
- Le nombre d'emplacements disponibles est-il modélisé ?
- Comment signaler une recette techniquement connue mais impossible à utiliser sur une île donnée ?

**Livrable attendu :** modèle de disponibilité insulaire et matrice des contraintes simulées, signalées ou ignorées en V1.

### 4.6 Bâtiments existants, stocks et déficits

**État documentaire :** l'expression de besoin laisse ouverte la prise en compte des stocks et bâtiments existants. Le plan de développement évoque bâtiments théoriques, bâtiments existants et déficits sans définir complètement leur interaction.

À décider :
- L'utilisateur peut-il saisir les bâtiments déjà construits ?
- Les bâtiments existants sont-ils affectés à une île, une recette et des paramètres de productivité ?
- L'utilisateur peut-il saisir un stock initial de biens ?
- Les stocks sont-ils consommés avant de calculer les besoins de production ?
- Les résultats distinguent-ils déficit de consommation, déficit de capacité et besoin de construction ?
- Les capacités excédentaires sont-elles affichées ?

**Livrable attendu :** définition des entrées de stock et de bâtiments, ordre des calculs et nomenclature des résultats.

### 4.7 Planification multi-îles

**État documentaire :** la fonctionnalité appartient à la V1 et le lot 8 prévoit les îles, affectations, transferts, déficits locaux et globaux. Les règles opérationnelles ne sont pas encore définies.

À décider :
- Quelles informations caractérisent une île ?
- Une île possède-t-elle ses propres populations, stocks, bâtiments, fertilités et gisements ?
- Les transferts sont-ils instantanés et illimités dans le modèle V1, ou soumis à une capacité, une fréquence ou un coût ?
- Comment l'utilisateur déclare-t-il les routes et relations entre îles ?
- Les biens peuvent-ils transiter par une île intermédiaire ?
- Comment répartir automatiquement une production entre plusieurs îles, si cette automatisation est souhaitée ?
- Comment distinguer déficit local, déficit global, surplus local et surplus transférable ?

**Livrable attendu :** modèle de scénario multi-îles, règles de transfert et exemples de calcul avec résultats attendus.

### 4.8 Interface et parcours utilisateur

**État documentaire :** le type d'application, les langues, les thèmes et les grandes catégories d'information sont définis. Les écrans et parcours ne le sont pas.

À décider :
- Écran d'accueil et création d'un scénario.
- Parcours de saisie des populations et des besoins.
- Parcours de configuration des îles.
- Présentation des chaînes de production et navigation amont/aval.
- Vue synthétique des besoins, capacités, déficits et surplus.
- Affichage des erreurs, données inconnues et contraintes non satisfaites.
- Comportement en cas de scénario vide ou incomplet.
- Exigences minimales d'ergonomie et de résolution d'écran.

**Livrable attendu :** parcours utilisateur, inventaire des écrans et critères d'acceptation de chaque écran.

### 4.9 Persistance, export et cycle de vie des scénarios

**État documentaire :** le lot 7 prévoit sauvegarde, chargement, validation et export, mais pas les choix de format ni le périmètre exact.

À décider :
- Format de fichier et emplacement de sauvegarde.
- Enregistrement automatique ou manuel.
- Contenu d'un scénario : paramètres uniquement ou résultats également.
- Comportement lors d'une évolution du catalogue ou du format de scénario.
- Stratégie de migration et compatibilité ascendante.
- Formats d'export attendus et contenu exporté.
- Gestion des fichiers corrompus, inconnus ou issus d'une version plus récente.

**Livrable attendu :** schéma versionné de scénario, règles de compatibilité et spécification des exports.

### 4.10 Qualité, livraison et support

**État documentaire :** tests, contrôles de types et qualimétrie sont cités, mais les seuils et exigences de livraison ne sont pas définis.

À décider :
- Versions Windows supportées.
- Format d'installation et stratégie de mise à jour.
- Signature de l'application, si nécessaire.
- Politique de logs et diagnostic.
- Gestion des erreurs non récupérables.
- Stratégie de tests unitaires, intégration et validation manuelle.
- Seuils de couverture ou indicateurs de qualité réellement utiles.
- Politique de versionnement de l'application et du catalogue.

**Livrable attendu :** exigences non fonctionnelles et critères de livraison V1.

## 5. Lacunes documentaires et incohérences à corriger

| Priorité | Constat | Action documentaire |
|---|---|---|
| Haute | `guide_de_demarrage.md` décrit encore `documents/`, alors que le dossier de référence est désormais `docs/` | Mettre à jour l'arborescence et les liens |
| Haute | Le guide mentionne `packages/ui`, tandis que l'architecture de référence cite `packages/product` et `packages/game-data` | Décrire l'architecture cible et signaler les modules optionnels ou non encore créés |
| Haute | Le guide décrit des commandes de démarrage et de build comme si le desktop était toujours présent | Distinguer les commandes applicables uniquement après réalisation du lot 2 |
| Haute | Les lots 1 et 3 évoquent bâtiments existants et déficits sans contrat fonctionnel complet | Définir ces concepts avant de figer les API |
| Haute | Le lot 8 nécessite une conception dédiée, mais aucun document de spécification multi-îles n'existe | Créer une spécification avant le développement du lot 8 |
| Moyenne | Les écrans, parcours et règles de présentation ne sont pas spécifiés | Produire des parcours et critères d'acceptation avant le lot 5 |
| Moyenne | Les exigences de persistance et d'export restent ouvertes | Spécifier le format avant le lot 7 |
| Moyenne | Les exigences de qualité et de distribution sont incomplètes | Ajouter les exigences non fonctionnelles avant la livraison V1 |
| Moyenne | Les sources et versions du catalogue ne sont pas toutes identifiées précisément | Compléter les registres de provenance et les empreintes des fichiers examinés |
| Moyenne | Les documents d'installation reposent sur des versions datées et des commandes qui peuvent évoluer | Vérifier les versions et commandes au moment de la reconstruction |

## 6. Ordre recommandé de spécification

Pour éviter de rédiger une spécification monolithique avant toute validation, compléter les exigences au rythme des lots, avec une baseline minimale commune.

1. **Avant le lot 1 — Contrat du moteur :** unités, flux, consommation, propagation, recettes multiples, productivité, arrondis, erreurs et cas de référence.
2. **Avant le lot 2 — Contrat desktop :** structure de l'application, sécurité Electron, démarrage, packaging cible et limites de communication entre processus.
3. **Avant le lot 3 — Contrat des cas d'usage :** entrées, sorties, orchestration, bâtiments existants, stocks et déficits effectivement pris en charge.
4. **Avant le lot 4 — Contrat des données :** schéma du catalogue, provenance, couverture, statut de validation et conditions de réutilisation.
5. **Avant le lot 5 — Spécification UI :** parcours, écrans, états, erreurs et critères d'acceptation.
6. **Avant le lot 6 — Règles transverses UI :** langues, traductions, thèmes et préférences.
7. **Avant le lot 7 — Contrat de persistance :** format, versionnement, migration et export.
8. **Avant le lot 8 — Spécification multi-îles :** îles, stocks, affectations, transferts, contraintes et équilibrage.

Les dépendances entre lots doivent être respectées : une interface ne doit pas figer un comportement métier encore indécis, et un format de sauvegarde ne doit pas figer prématurément un modèle de scénario incomplet.

## 7. Règles de décision et de traçabilité

Pour chaque question fonctionnelle :

1. Décrire le problème et son impact utilisateur.
2. Présenter les options réalistes sans en sélectionner une par défaut.
3. Consigner la décision du propriétaire du projet.
4. Mettre à jour l'expression de besoin ou créer une spécification dédiée.
5. Définir au moins un exemple nominal et les cas limites utiles.
6. Définir des critères d'acceptation vérifiables.
7. Répercuter la décision dans le plan de développement et les contrats techniques concernés.

Une décision non prise doit rester marquée **À arbitrer**. Une hypothèse temporaire doit être marquée **Hypothèse**, avec son impact et la condition de sa validation.

## 8. Critères pour considérer la documentation reconstructible

La documentation fonctionnelle sera considérée comme suffisante pour reconstruire la V1 lorsque :

- [ ] chaque fonctionnalité V1 possède une description du comportement attendu ;
- [ ] les entrées, sorties, unités et règles de calcul sont définies ;
- [ ] les règles d'arrondi, de validation et de gestion des erreurs sont documentées ;
- [ ] les cas nominaux et cas limites disposent d'exemples avec résultats attendus ;
- [ ] les parcours utilisateur et états des écrans sont décrits ;
- [ ] le modèle de scénario et ses règles de persistance sont définis ;
- [ ] les règles multi-îles et transferts sont spécifiées ;
- [ ] les exigences non fonctionnelles et de livraison sont définies ;
- [ ] les données du catalogue disposent d'un statut de validation et d'une provenance traçable ;
- [ ] les décisions ouvertes sont identifiées et ne sont pas masquées dans le code ;
- [ ] un développeur externe au projet peut réaliser les lots sans devoir interpréter les intentions ou rechercher l'historique des conversations.

## 9. Prochaine étape proposée

Ne pas commencer par détailler toutes les fonctionnalités de l'interface. La priorité est de rendre le lot 1 entièrement spécifiable : c'est le socle de calcul sur lequel les cas d'usage, l'interface et la planification multi-îles s'appuieront.

La première séance d'arbitrage devra donc figer les unités de calcul, les flux de production, les règles de consommation et le traitement des recettes multiples. Les décisions concernant les stocks, bâtiments existants et contraintes géographiques pourront être finalisées avant le lot 3 ou le lot 4 selon leur dépendance réelle.

**Statut de la revue :** les lacunes sont identifiées ; les décisions fonctionnelles restent à prendre. Aucune règle métier n'a été inventée ou validée par cette revue.

## 10. Documents associés

- `docs/expression_de_besoin.md` — besoin produit initial.
- `docs/plan_de_developpement.md` — architecture cible et lots.
- `docs/catalog-scope.md` — périmètre et principes de modélisation des données.
- `docs/data-catalog-audit.md` — résultats de l'audit structurel.
- `docs/data-sources.md` — sources et provenance.
- `docs/data-licensing.md` — droits et conditions de réutilisation.


---

## Addendum — travaux documentaires du 30 octobre 2026

À la suite de la validation du propriétaire du projet, les quatre premiers axes de travail ont été engagés sur cette branche, sans modification du code applicatif.

### Livrables ajoutés ou actualisés

- `docs/contrat-moteur-calcul.md` : contrat conceptuel du moteur, responsabilités, données attendues, flux, capacité, propagation, erreurs et matrice de cas de référence.
- `docs/registre-decisions-fonctionnelles.md` : registre initial des décisions ouvertes DEC-001 à DEC-020, avec dépendances et statut.
- `docs/guide_de_demarrage.md` : correction de la structure documentaire (`docs/`) et alignement sur l'architecture cible (`packages/product`, `packages/game-data`) ; commandes desktop explicitement conditionnées à la présence du lot 2.
- `docs/plan_de_developpement.md` : références vers le contrat du moteur et le registre des décisions, avec rappel de leur statut non approuvé.

### État après ces travaux

Les bases documentaires des quatre axes sont en place, mais cela ne signifie pas que le lot 1 est prêt à être implémenté sans arbitrage. Les unités, la précision, les arrondis, la gestion des recettes multiples, les coproduits, les modificateurs de productivité et la politique de résultats partiels restent à décider.

La matrice de cas CORE-001 à CORE-012 décrit les familles de tests à préparer. Les résultats chiffrés de référence seront ajoutés après validation des conventions correspondantes ; aucun chiffre n'a été inventé pour masquer les décisions ouvertes.

### Limites de vérification

Les modifications ont été commitées sur `feature/update-documents` via GitHub. Aucune commande locale `pnpm test`, `pnpm -r typecheck` ou `git diff --check` n'a été exécutée dans l'environnement local du propriétaire pendant cette opération. Le propriétaire devra récupérer les derniers commits et vérifier le diff ainsi que les contrôles applicables.

Le point 5 — préparation des lots suivants — reste volontairement en attente d'une décision commune.
