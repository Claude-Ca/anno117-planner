import { useMemo, useState, type FormEvent } from "react";
import { loadGameData } from "@anno117/data-engine";
import { simulateCatalogProduction, type ProductionSimulationResult } from "@anno117/product";
import type { PopulationTier, ModularGameCatalog } from "@anno117/game-data";
import type { DataRepository } from "@anno117/data-engine";
import manifest from "../../../../../packages/game-data/catalogs/manifest.json";
import resources from "../../../../../packages/game-data/catalogs/resources.json";
import buildings from "../../../../../packages/game-data/catalogs/buildings.json";
import production from "../../../../../packages/game-data/catalogs/production.json";
import population from "../../../../../packages/game-data/catalogs/population.json";
import regions from "../../../../../packages/game-data/catalogs/regions.json";
import islandAvailability from "../../../../../packages/game-data/catalogs/island-availability.json";
import evidence from "../../../../../packages/game-data/catalogs/evidence.json";
import { createPopulationIslandInput } from "./population-planning";
import { CatalogWorkbench } from "./CatalogWorkbench";

interface PopulationTierOption {
  id: string;
  name: string;
  residentsPerHouse: number;
}

interface CatalogLoadResult {
  repository: DataRepository | null;
  error: string | null;
}

const initialCatalog = {
  manifest,
  modules: { resources, buildings, production, population, regions, islandAvailability, evidence },
} as ModularGameCatalog;

function loadRepository(): CatalogLoadResult {
  try {
    return { repository: loadGameData(initialCatalog), error: null };
  } catch (error) {
    return {
      repository: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function getPopulationTiers(repository: DataRepository): PopulationTierOption[] {
  const usableIds = new Set(repository.coreCatalog.tiers.map((tier) => tier.id));
  return repository.modules.population
    .filter((tier: PopulationTier) => usableIds.has(tier.id))
    .map((tier) => ({ id: tier.id, name: tier.name, residentsPerHouse: tier.residentsPerHouse }));
}

function formatFlow(value: number): string {
  return String(value);
}

export default function App() {
  const catalogResult = useMemo(loadRepository, []);
  const repository = catalogResult.repository;
  const populationTiers = useMemo(
    () => (repository ? getPopulationTiers(repository) : []),
    [repository],
  );
  const [islandName, setIslandName] = useState("Nouvelle île");
  const [houseCounts, setHouseCounts] = useState<Record<string, string>>({});
  const [simulation, setSimulation] = useState<ProductionSimulationResult | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSimulation(null);
    setSimulationError(null);
    if (!repository) {
      setSimulationError("Le catalogue n'est pas disponible.");
      return;
    }
    try {
      const island = createPopulationIslandInput(islandName, populationTiers, houseCounts);
      setSimulation(simulateCatalogProduction({ repository, island }));
    } catch (error) {
      setSimulationError(error instanceof Error ? error.message : String(error));
    }
  }

  const resourceNames = new Map(
    repository?.modules.resources.map((resource) => [resource.id, resource.name]) ?? [],
  );

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">PAX ROMANA · PLANIFICATEUR DE PRODUCTION</p>
          <h1>Anno 117 Planner</h1>
        </div>
        <span className={repository ? "catalog-status" : "catalog-status is-error"}>
          {repository ? "Catalogue chargé" : "Catalogue indisponible"}
        </span>
      </header>

      <div className="page-content">
        <section className="page-intro">
          <div>
            <p className="eyebrow">LOT 5 · PREMIER PARCOURS</p>
            <h2>Planifier une île</h2>
            <p>Définissez votre population pour estimer les besoins de consommation associés.</p>
          </div>
          {repository && (
            <div className="catalog-meta">
              <span>Catalogue {repository.manifest.catalogVersion}</span>
              <span>{repository.manifest.scope.regions.join(" · ")}</span>
            </div>
          )}
        </section>

        {catalogResult.error ? (
          <section className="panel feedback-panel is-error" role="alert">
            <h3>Impossible de charger le catalogue</h3>
            <pre className="diagnostics">{catalogResult.error}</pre>
          </section>
        ) : repository && populationTiers.length === 0 ? (
          <section className="panel empty-state">
            <div className="empty-icon" aria-hidden="true">∅</div>
            <div>
              <h3>Aucun palier de population disponible</h3>
              <p>
                Le catalogue ne contient actuellement aucun palier de population exploitable par le moteur.
                La saisie sera activée lorsque les niveaux et leurs besoins auront été intégrés et vérifiés.
              </p>
              <p className="subtle">
                Aucune donnée fictive n'est utilisée : les régions déclarées dans le manifeste ne constituent
                pas à elles seules des données de population validées.
              </p>
            </div>
          </section>
        ) : repository ? (
          <div className="planner-grid">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">01 · CONFIGURATION</p>
                  <h3>Population de l'île</h3>
                </div>
              </div>
              <form onSubmit={handleCalculate}>
                <label className="field-label" htmlFor="island-name">Nom de l'île</label>
                <input id="island-name" className="text-input" value={islandName}
                  onChange={(event) => setIslandName(event.target.value)} maxLength={80} required />
                <div className="section-heading">
                  <div>
                    <h4>Maisons par palier</h4>
                    <p>Indiquez le nombre de maisons pour chaque niveau disponible.</p>
                  </div>
                  <span className="unit-label">Maisons</span>
                </div>
                <div className="tier-list">
                  {populationTiers.map((tier) => (
                    <label className="tier-row" key={tier.id}>
                      <span className="tier-description">
                        <strong>{tier.name}</strong>
                        <small>{tier.residentsPerHouse} habitants par maison</small>
                      </span>
                      <input className="number-input" type="number" min="0" step="1" inputMode="numeric"
                        aria-label={`Nombre de maisons — ${tier.name}`} value={houseCounts[tier.id] ?? "0"}
                        onChange={(event) => setHouseCounts((current) => ({ ...current, [tier.id]: event.target.value }))} />
                    </label>
                  ))}
                </div>
                <button className="primary-button" type="submit">Calculer les besoins</button>
                {simulationError && <p className="feedback-error" role="alert">{simulationError}</p>}
              </form>
            </section>

            <section className="panel results-panel" aria-live="polite">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">02 · RÉSULTATS</p>
                  <h3>Besoins de consommation</h3>
                </div>
              </div>
              {!simulation ? (
                <div className="results-placeholder">
                  <p>Les résultats de votre île apparaîtront ici après le calcul.</p>
                </div>
              ) : (
                <>
                  <div className="population-total">
                    <span>Population totale calculée</span>
                    <strong>{simulation.totalPopulation.toLocaleString("fr-FR")}</strong>
                    <small>habitants</small>
                  </div>
                  {simulation.goods.length === 0 ? (
                    <p className="subtle">Aucun flux de consommation n'est défini pour les paliers sélectionnés.</p>
                  ) : (
                    <div className="table-wrap">
                      <table className="results-table">
                        <thead><tr><th>Bien</th><th>Besoin par minute</th></tr></thead>
                        <tbody>
                          {simulation.goods.map((balance) => (
                            <tr key={balance.good}>
                              <td>{resourceNames.get(balance.good) ?? balance.good}</td>
                              <td className="numeric">{formatFlow(balance.demandPerMinute)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {simulation.unresolvedAllocations.length > 0 && (
                    <div className="diagnostic-list">
                      <h4>Diagnostics du moteur</h4>
                      <ul>{simulation.unresolvedAllocations.map((message) => <li key={message}>{message}</li>)}</ul>
                    </div>
                  )}
                  <p className="subtle result-note">
                    Les valeurs affichées sont les besoins calculés à partir des flux du catalogue.
                    Les affectations de production, les stocks et le dimensionnement des bâtiments ne sont
                    pas encore pris en compte dans ce parcours.
                  </p>
                </>
              )}
            </section>
          </div>
        ) : null}

        <CatalogWorkbench initialCatalog={initialCatalog} />
      </div>
    </main>
  );
}
