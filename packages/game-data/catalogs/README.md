# Catalogues embarqués

Les fichiers JSON de ce répertoire sont les données versionnées livrées avec l'application. Le manifeste déclare les modules et le périmètre couvert.

| Fichier | Domaine |
|---|---|
| `manifest.json` | Version, schéma, édition et régions |
| `resources.json` | Biens et ressources |
| `buildings.json` | Bâtiments |
| `production.json` | Recettes, intrants et sorties |
| `population.json` | Paliers et besoins |
| `regions.json` | Régions |
| `island-availability.json` | Fertilités, gisements et ressources propres à chaque île |
| `evidence.json` | Observations et expérimentations internes |

Chaque fichier de domaine contient un tableau d'entités correspondant au module TypeScript. Les identifiants sont stables et les relations entre fichiers utilisent ces identifiants.

Les régions Latium et Albion sont initialisées au statut `to-observe` : elles expriment le périmètre de travail, pas une validation de leurs caractéristiques. Les autres modules sont volontairement vides.

Les statuts `to-observe` et `excluded` peuvent ne pas avoir de preuve. Les statuts `observed`, `verified`, `derived` et `disputed` doivent référencer des preuves internes. Seuls les éléments `verified` et `derived` peuvent alimenter la projection destinée au `core`, sous réserve de références cohérentes.

Les sources secondaires déjà étudiées restent des pistes de vérification dans la documentation. Elles ne sont ni copiées dans les fichiers JSON ni utilisées comme preuve interne.
