# Plan de tests — catalogue et moteur de données

## Objectif

Valider la structure des modules, leurs références croisées, l'agrégation, la projection conservatrice vers le moteur métier et le chargement hors ligne dans le desktop. La validation technique ne remplace pas la campagne d'observation en jeu.

## Niveaux de test

| Niveau | Périmètre | Contrôle |
|---|---|---|
| T1 | Validation unitaire | Schéma, identifiants, statuts, preuves et références |
| T2 | Intégration des modules | Agrégation, snapshot immuable et diagnostic d'erreur |
| T3 | Contrat du moteur | Projection des seules données vérifiées et appel du calcul métier |
| T4 | Desktop | Build, démarrage de l'application compilée, chargement hors ligne |
| T5 | Validation en jeu | Comparaison des données observées avec le jeu de référence |

## Tests automatisés présents

Les tests des packages `game-data`, `data-engine`, `core` et `product` sont exécutés par Vitest via le script de workspace. Les jeux de données de test sont synthétiques et ne doivent pas être interprétés comme des données validées d'Anno 117.

La couverture unitaire porte notamment sur les identifiants dupliqués, les références inconnues, les preuves manquantes, les dates impossibles, l'exclusion des données non vérifiées et l'intégration avec le cœur de calcul.

## Matrice de validation

| ID | Vérification | Type | État |
|---|---|---|---|
| CAT-001 | Manifeste et modules requis | Unitaire | Test automatisé |
| CAT-002 | Identifiants dupliqués | Unitaire | Test automatisé |
| CAT-003 | Référence de ressource inconnue | Unitaire | Test automatisé |
| CAT-004 | Preuve requise pour une donnée observée/vérifiée | Unitaire | Test automatisé |
| CAT-005 | Élément `to-observe` sans preuve accepté | Unitaire | Test automatisé |
| CAT-006 | Preuve dérivée sans fondement refusée | Unitaire | Test automatisé |
| CAT-007 | Date impossible refusée | Unitaire | Test automatisé |
| ENG-001 | Agrégation des modules | Intégration | Test automatisé |
| ENG-002 | Données non vérifiées exclues de la projection | Intégration | Test automatisé |
| ENG-003 | Catalogue projeté consommable par le cœur | Intégration | Test automatisé |
| DESK-001 | Imports JSON locaux embarqués dans le build | Build | Réussi localement le 30/10/2026 |
| DESK-002 | Démarrage du desktop compilé et affichage de l'interface | Manuel | Réussi localement le 30/10/2026 |
| DESK-002b | Redémarrage du desktop sans connexion réseau | Manuel | À vérifier |
| DESK-003 | Erreur de validation affichée dans l'interface | Manuel | À vérifier |
| GAME-001 | Valeurs comparées au jeu de référence | Manuel | En attente de campagne |

## Résultats de validation locale — 30/10/2026

Exécution réalisée par le développeur sur la branche `feature/data-catalog-engine`, avec pnpm 12.15.0 et Vitest 5.0.5.

| Commande | Résultat constaté |
|---|---|
| `pnpm install --frozen-lockfile` | Réussi ; lockfile accepté sans régénération |
| `pnpm test` | Réussi ; 52 tests passés sur 4 packages |
| `pnpm typecheck` | Réussi ; 5 projets contrôlés, aucune erreur TypeScript |
| `pnpm --filter @anno117/desktop build` | Réussi ; main, preload et renderer compilés |
| `pnpm --filter @anno117/desktop exec electron .` | Réussi ; fenêtre Electron et interface visibles |

Détail des 52 tests : `core` 20, `game-data` 22, `data-engine` 5 et `product` 5.

Le démarrage de la version compilée est confirmé. Le test de redémarrage sans réseau, la vérification de l'affichage d'une erreur de validation et la campagne de comparaison en jeu restent à réaliser. Aucun résultat n'est attribué à ces contrôles en attente.

## Procédure locale

À la racine du dépôt, sur la branche `feature/data-catalog-engine` :

```powershell
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
git diff --check
pnpm --filter @anno117/desktop build
pnpm --filter @anno117/desktop exec electron .
```

La commande de lancement post-build doit être exécutée après la réussite du build. Vérifier visuellement que l'interface affiche « Catalogue chargé et structure validée », les comptes de modules et zéro élément utilisable par le moteur tant que les données n'ont pas été vérifiées.

Pour vérifier le fonctionnement hors ligne, démarrer la version compilée sans connexion réseau et confirmer que le résumé du catalogue apparaît. Le catalogue est empaqueté dans les ressources JavaScript produites par Vite ; il ne doit pas dépendre d'un chemin absolu du poste de développement.

## Critères d'acceptation technique

- Les tests automatisés et le contrôle TypeScript terminent sans erreur.
- Le build Electron Vite se termine sans erreur.
- La version compilée démarre sans serveur Vite.
- L'interface signale un chargement réussi du catalogue local.
- Une erreur structurelle empêche la projection et est rendue visible.
- Aucun élément non vérifié n'est envoyé au cœur de calcul.

Les résultats ci-dessus correspondent aux commandes effectivement exécutées et rapportées le 30/10/2026. Les contrôles explicitement indiqués « À vérifier » ou « En attente de campagne » ne sont pas considérés comme réussis.
