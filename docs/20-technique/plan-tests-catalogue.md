# Plan de tests — catalogue et moteur de données

## Objectif

Valider la structure des modules, leurs références croisées, l'agrégation, la projection conservatrice vers le moteur métier, l'orchestration applicative et le chargement hors ligne dans le desktop. La validation technique ne remplace pas la campagne d'observation en jeu.

## Niveaux de test

| Niveau | Périmètre | Contrôle |
|---|---|---|
| T1 | Validation unitaire | Schéma, identifiants, statuts, preuves et références |
| T2 | Intégration des modules | Agrégation, snapshot immuable et diagnostic d'erreur |
| T3 | Contrat du moteur et couche produit | Projection des seules données vérifiées, appel du calcul métier et propagation des erreurs |
| T4 | Desktop | Build, démarrage de l'application compilée, chargement hors ligne |
| T5 | Validation en jeu | Comparaison des données observées avec le jeu de référence |

## Tests automatisés présents

Les tests des packages `game-data`, `data-engine`, `core` et `product` sont exécutés par Vitest via le script de workspace. Les jeux de données de test sont synthétiques et ne doivent pas être interprétés comme des données validées d'Anno 117.

La couverture comprend notamment les identifiants dupliqués, les références inconnues, les preuves manquantes, les dates impossibles, l'exclusion des données non vérifiées, la projection vers le cœur de calcul et la consommation du référentiel par la couche produit.

## Matrice de validation

| ID | Vérification | Type | État |
|---|---|---|---|
| CAT-001 | Manifeste et modules requis | Unitaire | Test automatisé existant |
| CAT-002 | Identifiants dupliqués | Unitaire | Test automatisé existant |
| CAT-003 | Référence de ressource inconnue | Unitaire | Test automatisé existant |
| CAT-004 | Preuve requise pour une donnée observée/vérifiée | Unitaire | Test automatisé existant |
| CAT-005 | Élément `to-observe` sans preuve accepté | Unitaire | Test automatisé existant |
| CAT-006 | Preuve dérivée sans fondement refusée | Unitaire | Test automatisé existant |
| CAT-007 | Date impossible refusée | Unitaire | Test automatisé existant |
| ENG-001 | Agrégation des modules | Intégration | Test automatisé existant |
| ENG-002 | Données non vérifiées exclues de la projection | Intégration | Test automatisé existant |
| ENG-003 | Catalogue projeté consommable par le cœur | Intégration | Test automatisé existant |
| PROD-001 | Cas d'usage produit alimenté par un `DataRepository` | Intégration | Ajouté — exécution locale requise |
| PROD-002 | Propagation des erreurs de validation de l'île | Intégration | Ajouté — exécution locale requise |
| DESK-001 | Imports JSON locaux embarqués dans le build | Build | Réussi localement le 30/10/2026 |
| DESK-002 | Démarrage du desktop compilé et affichage de l'interface | Manuel | Réussi localement le 30/10/2026 |
| DESK-002b | Redémarrage du desktop sans connexion réseau | Manuel | Réussi selon confirmation du développeur le 30/10/2026 |
| DESK-003 | Erreur de validation affichée dans l'interface | Manuel | À vérifier |
| GAME-001 | Valeurs comparées au jeu de référence | Manuel | En attente de campagne |

## Résultats de validation locale — 30/10/2026

Exécution réalisée par le développeur sur la branche `feature/data-catalog-engine`, avec pnpm 12.15.0 et Vitest 5.0.5.

| Commande | Résultat constaté |
|---|---|
| `pnpm install --frozen-lockfile` | Réussi ; lockfile accepté sans régénération |
| `pnpm test` | Réussi ; 52 tests passés sur 4 packages, avant l'ajout des deux tests PROD |
| `pnpm typecheck` | Réussi ; 5 projets contrôlés, avant le raccordement du type `DataRepository` |
| `pnpm --filter @anno117/desktop build` | Réussi ; main, preload et renderer compilés |
| `pnpm --filter @anno117/desktop exec electron .` | Réussi ; fenêtre Electron et interface visibles |
| Relancement de l'application réseau coupé | Réussi selon confirmation du développeur |

Les deux nouveaux tests PROD et le contrôle TypeScript après export public de `DataRepository` restent à exécuter. Le prochain passage complet de validation doit donc reprendre l'installation gelée, les tests, le typecheck, le build et le démarrage.

## Procédure locale

À la racine du dépôt, sur la branche `feature/data-catalog-engine` :

```powershell
git pull --ff-only origin feature/data-catalog-engine
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
git diff --check
pnpm --filter @anno117/desktop build
pnpm --filter @anno117/desktop exec electron .
```

Le lancement post-build doit être exécuté après la réussite du build. Le démarrage hors ligne est déjà confirmé pour le desktop avant ce dernier raccordement de la couche produit ; il pourra être recontrôlé après le build final.

## Critères d'acceptation technique

- Les tests automatisés et le contrôle TypeScript terminent sans erreur.
- Le build Electron Vite se termine sans erreur.
- La version compilée démarre sans serveur Vite.
- L'interface signale un chargement réussi du catalogue local.
- Une erreur structurelle empêche la projection et est rendue visible.
- Aucun élément non vérifié n'est envoyé au cœur de calcul.
- Le cas d'usage applicatif consomme le référentiel modulaire sans dupliquer le calcul.

Les résultats indiqués comme ajoutés ou à vérifier ne sont pas considérés comme réussis avant leur exécution effective.
