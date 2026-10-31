import { useEffect, useMemo, useState, type FormEvent } from "react";
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

interface PopulationTierOption { id: string; name: string; residentsPerHouse: number; }
interface CatalogLoadResult { repository: DataRepository | null; error: string | null; }
type RegionId = "latium" | "albion";
interface IslandSession { name: string; houseCounts: Record<string, string>; }
interface PlannerSession { version: 1; activeRegion: RegionId; islands: Record<RegionId, IslandSession>; savedAt?: string; }
const SESSION_KEY = "anno117-planner.session.v1";
const DEFAULT_SESSION: PlannerSession = {
  version: 1, activeRegion: "latium",
  islands: {
    latium: { name: "Nouvelle île — Latium", houseCounts: {} },
    albion: { name: "Nouvelle île — Albion", houseCounts: {} },
  },
};
const initialCatalog = { manifest, modules: { resources, buildings, production, population, regions, islandAvailability, evidence } } as ModularGameCatalog;

function readSession(): PlannerSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const value: unknown = JSON.parse(raw);
      if (value && typeof value === "object" && "version" in value && value.version === 1 && "islands" in value) {
        const saved = value as PlannerSession;
        if (saved.islands?.latium && saved.islands?.albion) {
          return { ...saved, activeRegion: saved.activeRegion === "albion" ? "albion" : "latium" };
        }
      }
    }
  } catch { /* Start clean if local session data is invalid. */ }
  return structuredClone(DEFAULT_SESSION);
}
function loadRepository(): CatalogLoadResult {
  try { return { repository: loadGameData(initialCatalog), error: null }; }
  catch (error) { return { repository: null, error: error instanceof Error ? error.message : String(error) }; }
}
function getPopulationTiers(repository: DataRepository): PopulationTierOption[] {
  const ids = new Set(repository.coreCatalog.tiers.map((tier) => tier.id));
  return repository.modules.population.filter((tier: PopulationTier) => ids.has(tier.id))
    .map((tier) => ({ id: tier.id, name: tier.name, residentsPerHouse: tier.residentsPerHouse }));
}
export default function App() {
  const catalogResult = useMemo(loadRepository, []);
  const repository = catalogResult.repository;
  const populationTiers = useMemo(() => repository ? getPopulationTiers(repository) : [], [repository]);
  const [session, setSession] = useState<PlannerSession>(() => readSession());
  const [savedAt, setSavedAt] = useState<string | null>(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null")?.savedAt ?? null; } catch { return null; }
  });
  const [saveMessage, setSaveMessage] = useState("Sauvegarde automatique activée.");
  const [simulations, setSimulations] = useState<Partial<Record<RegionId, ProductionSimulationResult>>>({});
  const [errors, setErrors] = useState<Partial<Record<RegionId, string>>>({});
  const activeRegion = session.activeRegion;
  const island = session.islands[activeRegion];
  const resourceNames = new Map(repository?.modules.resources.map((resource) => [resource.id, resource.name]) ?? []);

  useEffect(() => {
    try {
      const next = { ...session, savedAt: new Date().toISOString() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSavedAt(next.savedAt);
    } catch { setSaveMessage("Sauvegarde automatique indisponible. Exportez la session en JSON."); }
  }, [session]);

  function updateIsland(update: Partial<IslandSession>) {
    setSession((current) => ({ ...current, islands: { ...current.islands, [activeRegion]: { ...current.islands[activeRegion], ...update } } }));
  }
  function saveSession() {
    try {
      const next = { ...session, savedAt: new Date().toISOString() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSavedAt(next.savedAt);
      setSaveMessage("Session sauvegardée sur cet ordinateur.");
    } catch { setSaveMessage("Impossible d'enregistrer la session localement."); }
  }
  function restoreSession() {
    setSession(readSession());
    setSimulations({});
    setErrors({});
    setSaveMessage("Dernière session locale restaurée.");
  }
  function exportSession() {
    const blob = new Blob([JSON.stringify({ ...session, savedAt: new Date().toISOString() }, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "anno117-session.json"; anchor.click();
    URL.revokeObjectURL(url);
    setSaveMessage("Export JSON de la session lancé.");
  }
  function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors((current) => ({ ...current, [activeRegion]: undefined }));
    setSimulations((current) => ({ ...current, [activeRegion]: undefined }));
    if (!repository) { setErrors((current) => ({ ...current, [activeRegion]: "Le catalogue n'est pas disponible." })); return; }
    try {
      const input = createPopulationIslandInput(island.name, populationTiers, island.houseCounts);
      setSimulations((current) => ({ ...current, [activeRegion]: simulateCatalogProduction({ repository, island: input }) }));
    } catch (error) {
      setErrors((current) => ({ ...current, [activeRegion]: error instanceof Error ? error.message : String(error) }));
    }
  }
  const simulation = simulations[activeRegion];

  return <main className="app">
    <header className="app-header">
      <div><p className="eyebrow">PAX ROMANA · PLANIFICATEUR DE PRODUCTION</p><h1>Anno 117 Planner</h1></div>
      <span className={repository ? "catalog-status" : "catalog-status is-error"}>{repository ? "Catalogue chargé" : "Catalogue indisponible"}</span>
    </header>
    <div className="page-content">
      <section className="page-intro">
        <div><p className="eyebrow">LOT 6 · SESSION ET RÉGIONS</p><h2>Planifier vos îles</h2><p>Chaque onglet conserve son nom, sa population et ses résultats indépendamment.</p></div>
        {repository && <div className="catalog-meta"><span>Catalogue {repository.manifest.catalogVersion}</span><span>{repository.manifest.scope.regions.join(" · ")}</span></div>}
      </section>

      <section className="panel session-toolbar" aria-label="Sauvegarde de session">
        <div className="session-info"><strong>Session de travail</strong><small>{savedAt ? "Dernière sauvegarde : " + new Date(savedAt).toLocaleString("fr-FR") : "Aucune sauvegarde précédente détectée"}</small></div>
        <div className="session-actions">
          <button className="secondary-button" type="button" onClick={saveSession}>Sauvegarder</button>
          <button className="secondary-button" type="button" onClick={restoreSession}>Restaurer</button>
          <button className="secondary-button" type="button" onClick={exportSession}>Exporter JSON</button>
        </div>
        <p className="save-message" role="status">{saveMessage}</p>
      </section>

      <nav className="region-tabs" role="tablist" aria-label="Région de l'île">
        {(["latium", "albion"] as const).map((regionId) => <button key={regionId} type="button" role="tab"
          aria-selected={activeRegion === regionId} className={activeRegion === regionId ? "region-tab is-active" : "region-tab"}
          onClick={() => setSession((current) => ({ ...current, activeRegion: regionId }))}>
          {regionId === "latium" ? "Latium" : "Albion"}
          <small>{Object.values(session.islands[regionId].houseCounts).filter((count) => Number(count) > 0).length} paliers renseignés</small>
        </button>)}
      </nav>

      {catalogResult.error ? <section className="panel feedback-panel is-error" role="alert"><h3>Impossible de charger le catalogue</h3><pre className="diagnostics">{catalogResult.error}</pre></section>
      : repository && populationTiers.length === 0 ? <section className="panel empty-state"><div className="empty-icon" aria-hidden="true">∅</div><div>
        <h3>Aucun palier de population disponible</h3><p>Le catalogue ne contient actuellement aucun palier de population exploitable par le moteur. La saisie sera activée lorsque les niveaux et leurs besoins auront été intégrés.</p>
        <p className="subtle">Les onglets Latium et Albion sont déjà distincts ; la ventilation des paliers par région sera finalisée lorsque le catalogue portera cette information.</p>
      </div></section>
      : repository ? <div className="planner-grid">
        <section className="panel">
          <div className="panel-heading"><div><p className="eyebrow">01 · CONFIGURATION</p><h3>Population — {activeRegion === "latium" ? "Latium" : "Albion"}</h3></div></div>
          <form onSubmit={handleCalculate}>
            <label className="field-label" htmlFor="island-name">Nom de l'île</label>
            <input id="island-name" className="text-input" value={island.name} onChange={(event) => updateIsland({ name: event.target.value })} maxLength={80} required />
            <div className="section-heading"><div><h4>Maisons par palier</h4><p>Indiquez le nombre de maisons pour chaque niveau disponible.</p></div><span className="unit-label">Maisons</span></div>
            <div className="tier-list">{populationTiers.map((tier) => <label className="tier-row" key={tier.id}>
              <span className="tier-description"><strong>{tier.name}</strong><small>{tier.residentsPerHouse} habitants par maison</small></span>
              <input className="number-input" type="number" min="0" step="1" inputMode="numeric" aria-label={"Nombre de maisons — " + tier.name}
                value={island.houseCounts[tier.id] ?? "0"} onChange={(event) => updateIsland({ houseCounts: { ...island.houseCounts, [tier.id]: event.target.value } })} />
            </label>)}</div>
            <button className="primary-button" type="submit">Calculer les besoins</button>
            {errors[activeRegion] && <p className="feedback-error" role="alert">{errors[activeRegion]}</p>}
          </form>
        </section>
        <section className="panel results-panel" aria-live="polite">
          <div className="panel-heading"><div><p className="eyebrow">02 · RÉSULTATS</p><h3>Besoins de consommation</h3></div></div>
          {!simulation ? <div className="results-placeholder"><p>Les résultats de cette île apparaîtront ici après le calcul.</p></div> : <>
            <div className="population-total"><span>Population totale calculée</span><strong>{simulation.totalPopulation.toLocaleString("fr-FR")}</strong><small>habitants</small></div>
            {simulation.goods.length === 0 ? <p className="subtle">Aucun flux de consommation n'est défini pour les paliers sélectionnés.</p> : <div className="table-wrap"><table className="results-table">
              <thead><tr><th>Bien</th><th>Besoin par minute</th></tr></thead><tbody>{simulation.goods.map((balance) => <tr key={balance.good}><td>{resourceNames.get(balance.good) ?? balance.good}</td><td className="numeric">{String(balance.demandPerMinute)}</td></tr>)}</tbody>
            </table></div>}
            {simulation.unresolvedAllocations.length > 0 && <div className="diagnostic-list"><h4>Diagnostics du moteur</h4><ul>{simulation.unresolvedAllocations.map((message) => <li key={message}>{message}</li>)}</ul></div>}
            <p className="subtle result-note">Les résultats sont calculés à partir des flux du catalogue. Les stocks et le dimensionnement des bâtiments ne sont pas encore pris en compte.</p>
          </>}
        </section>
      </div> : null}
      <CatalogWorkbench initialCatalog={initialCatalog} />
    </div>
  </main>;
}
