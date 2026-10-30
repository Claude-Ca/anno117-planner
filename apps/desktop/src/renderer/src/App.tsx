import { useMemo } from "react";
import { loadGameData } from "@anno117/data-engine";
import manifest from "../../../../../packages/game-data/catalogs/manifest.json";
import resources from "../../../../../packages/game-data/catalogs/resources.json";
import buildings from "../../../../../packages/game-data/catalogs/buildings.json";
import production from "../../../../../packages/game-data/catalogs/production.json";
import population from "../../../../../packages/game-data/catalogs/population.json";
import regions from "../../../../../packages/game-data/catalogs/regions.json";
import islandAvailability from "../../../../../packages/game-data/catalogs/island-availability.json";
import evidence from "../../../../../packages/game-data/catalogs/evidence.json";
import type { ModularGameCatalog } from "@anno117/game-data";

export default function App() {
  const result = useMemo(() => {
    try {
      const catalog = {
        manifest,
        modules: {
          resources,
          buildings,
          production,
          population,
          regions,
          islandAvailability,
          evidence,
        },
      } as ModularGameCatalog;
      const repository = loadGameData(catalog);
      return { repository, error: null as string | null };
    } catch (error) {
      return {
        repository: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }, []);

  const repository = result.repository;
  const moduleCounts = repository
    ? [
        ["Ressources", repository.modules.resources.length],
        ["Bâtiments", repository.modules.buildings.length],
        ["Recettes", repository.modules.production.length],
        ["Niveaux de population", repository.modules.population.length],
        ["Régions", repository.modules.regions.length],
        ["Disponibilités insulaires", repository.modules.islandAvailability.length],
        ["Preuves", repository.modules.evidence.length],
      ]
    : [];

  return (
    <main className="app">
      <header className="app-header">
        <h1>Anno 117 Planner</h1>
        <p>Planificateur de production — Pax Romana</p>
      </header>

      <section className="welcome">
        <h2>État du catalogue de données</h2>
        {result.error ? (
          <>
            <p className="status status-error">Échec du chargement ou de la validation du catalogue.</p>
            <pre className="diagnostics">{result.error}</pre>
          </>
        ) : repository ? (
          <>
            <p className="status status-ok">Catalogue chargé et structure validée.</p>
            <dl className="summary">
              <div><dt>Catalogue</dt><dd>{repository.manifest.id}</dd></div>
              <div><dt>Version du catalogue</dt><dd>{repository.manifest.catalogVersion}</dd></div>
              <div><dt>Version du jeu</dt><dd>{repository.manifest.gameVersion}</dd></div>
              <div><dt>Régions couvertes</dt><dd>{repository.manifest.scope.regions.join(", ")}</dd></div>
              <div><dt>Éléments utilisables par le moteur</dt><dd>{repository.coreCatalog.buildings.length} bâtiments, {repository.coreCatalog.recipes.length} recettes, {repository.coreCatalog.tiers.length} niveaux</dd></div>
            </dl>
            <h3>Modules chargés</h3>
            <ul className="module-list">
              {moduleCounts.map(([label, count]) => (
                <li key={label}><span>{label}</span><strong>{count}</strong></li>
              ))}
            </ul>
            <p className="notice">
              Le chargement est local et hors ligne. Les données du jeu restent à constituer et à vérifier en campagne.
            </p>
          </>
        ) : null}
      </section>
    </main>
  );
}