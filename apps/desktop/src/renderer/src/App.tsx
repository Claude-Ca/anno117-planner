import { useEffect, useMemo, useState } from "react";
import { loadGameData } from "@anno117/data-engine";
import { simulateCatalogProduction, type ProductionSimulationResult } from "@anno117/product";
import type { PopulationTier, ModularGameCatalog, PopulationNeedCategory } from "@anno117/game-data";
import type { DataRepository } from "@anno117/data-engine";
import manifest from "../../../../../packages/game-data/catalogs/manifest.json";
import resources from "../../../../../packages/game-data/catalogs/resources.json";
import buildings from "../../../../../packages/game-data/catalogs/buildings.json";
import production from "../../../../../packages/game-data/catalogs/production.json";
import population from "../../../../../packages/game-data/catalogs/population.json";
import regions from "../../../../../packages/game-data/catalogs/regions.json";
import islandAvailability from "../../../../../packages/game-data/catalogs/island-availability.json";
import evidence from "../../../../../packages/game-data/catalogs/evidence.json";
import { calculateTheoreticalNeeds, createPopulationIslandInput, type PopulationTierInput } from "./population-planning";
import { CatalogWorkbench } from "./CatalogWorkbench";

interface PopulationTierOption extends PopulationTierInput {
  id: string;
  name: string;
  residentsPerHouse: number;
}
interface CatalogLoadResult { repository: DataRepository | null; error: string | null; }
type RegionId = "latium" | "albion";
interface IslandSession {
  name: string;
  houseCounts: Record<string, string>;
  selectedNeeds?: Record<string, string>;
}
interface PlannerSession { version: 1; activeRegion: RegionId; islands: Record<RegionId, IslandSession>; savedAt?: string; }
interface PlanningResult { simulation: ProductionSimulationResult | null; error: string | null; }
const SESSION_KEY = "anno117-planner.session.v1";
const DEFAULT_SESSION: PlannerSession = {
  version: 1, activeRegion: "latium",
  islands: {
    latium: { name: "Nouvelle île — Latium", houseCounts: {}, selectedNeeds: {} },
    albion: { name: "Nouvelle île — Albion", houseCounts: {}, selectedNeeds: {} },
  },
};
const initialCatalog = { manifest, modules: { resources, buildings, production, population, regions, islandAvailability, evidence } } as ModularGameCatalog;
const CATEGORY_LABELS: Record<PopulationNeedCategory, string> = {
  food: "Alimentation", "public-service": "Services publics", fashion: "Habillement", household: "Vie domestique",
};

function readSession(): PlannerSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const value: unknown = JSON.parse(raw);
      if (value && typeof value === "object" && "version" in value && value.version === 1 && "islands" in value) {
        const saved = value as PlannerSession;
        if (saved.islands?.latium && saved.islands?.albion) {
          return {
            ...saved, activeRegion: saved.activeRegion === "albion" ? "albion" : "latium",
            islands: {
              latium: { ...saved.islands.latium, selectedNeeds: saved.islands.latium.selectedNeeds ?? {} },
              albion: { ...saved.islands.albion, selectedNeeds: saved.islands.albion.selectedNeeds ?? {} },
            },
          };
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
    .map((tier) => ({
      id: tier.id, name: tier.name, residentsPerHouse: tier.residentsPerHouse,
      needs: tier.needs ?? [],
    }));
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
  const activeRegion = session.activeRegion;
  const island = session.islands[activeRegion];
  const selectedNeeds = island.selectedNeeds ?? {};
  const resourceNames = useMemo(() => new Map(repository?.modules.resources.map((resource) => [resource.id, resource.name]) ?? []), [repository]);
  const buildingNames = useMemo(() => new Map(repository?.modules.buildings.map((building) => [building.id, building.name]) ?? []), [repository]);

  useEffect(() => {
    try {
      const next = { ...session, savedAt: new Date().toISOString() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSavedAt(next.savedAt);
    } catch { setSaveMessage("Sauvegarde automatique indisponible. Exportez la session en JSON."); }
  }, [session]);

  function updateIsland(update: Partial<IslandSession>) {
    setSession((current) => ({
      ...current,
      islands: { ...current.islands, [activeRegion]: { ...current.islands[activeRegion], ...update } },
    }));
  }
  function updateSelectedNeed(groupId: string, needId: string) {
    updateIsland({ selectedNeeds: { ...selectedNeeds, [groupId]: needId } });
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

  const planning = useMemo<PlanningResult>(() => {
    if (!repository) return { simulation: null, error: "Le catalogue n'est pas disponible." };
    try {
      const input = createPopulationIslandInput(island.name, populationTiers, island.houseCounts, selectedNeeds);
      return { simulation: simulateCatalogProduction({ repository, island: input }), error: null };
    } catch (error) {
      return { simulation: null, error: error instanceof Error ? error.message : String(error) };
    }
  }, [repository, populationTiers, island]);
  const simulation = planning.simulation;
  const theoreticalNeeds = useMemo(
    () => calculateTheoreticalNeeds(populationTiers, island.houseCounts, selectedNeeds),
    [populationTiers, island.houseCounts, selectedNeeds],
  );
  const selectedBuildingIds = [...new Set(populationTiers.flatMap((tier) =>
    (tier.needs ?? []).filter((need) => selectedNeeds[tier.id + ":" + (need.choiceGroupId ?? need.id)] === need.id)
      .flatMap((need) => need.buildingIds ?? []),
  ))];

  return <main className="app">
    <header className="app-header">
      <div><p className="eyebrow">PAX ROMANA · PLANIFICATEUR DE PRODUCTION</p><h1>Anno 117 Planner</h1></div>
      <span className={repository ? "catalog-status" : "catalog-status is-error"}>{repository ? "Catalogue chargé" : "Catalogue indisponible"}</span>
    </header>
    <div className="page-content">
      <section className="page-intro">
        <div><p className="eyebrow">PLANIFICATION DE POPULATION</p><h2>Planifier vos îles</h2><p>Les besoins et les quantités théoriques sont recalculés à chaque modification de la population.</p></div>
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
        <h3>Aucun palier de population disponible</h3><p>Le catalogue ne contient actuellement aucun palier de population exploitable par le moteur.</p>
      </div></section>
      : repository ? <div className="planner-grid">
        <section className="panel">
          <div className="panel-heading"><div><p className="eyebrow">01 · CONFIGURATION</p><h3>Population — {activeRegion === "latium" ? "Latium" : "Albion"}</h3></div></div>
          <label className="field-label" htmlFor="island-name">Nom de l'île</label>
          <input id="island-name" className="text-input" value={island.name} onChange={(event) => updateIsland({ name: event.target.value })} maxLength={80} required />
          <div className="section-heading"><div><h4>Maisons par type d'habitant</h4><p>Les résultats se mettent à jour automatiquement.</p></div><span className="unit-label">Maisons</span></div>
          <div className="tier-list">{populationTiers.map((tier) => <label className="tier-row" key={tier.id}>
            <span className="tier-description"><strong>{tier.name}</strong><small>{tier.residentsPerHouse} habitants par maison</small></span>
            <input className="number-input" type="number" min="0" step="1" inputMode="numeric" aria-label={"Nombre de maisons — " + tier.name}
              value={island.houseCounts[tier.id] ?? "0"} onChange={(event) => updateIsland({ houseCounts: { ...island.houseCounts, [tier.id]: event.target.value } })} />
          </label>)}</div>
          {planning.error && <p className="feedback-error" role="alert">{planning.error}</p>}

          <div className="section-heading needs-section-heading"><div><h4>Besoins à satisfaire</h4><p>Choisissez une ressource ou un service par groupe de besoin.</p></div></div>
          {theoreticalNeeds.filter((row) => row.houses > 0).length === 0
            ? <p className="subtle">Saisissez au moins une maison pour afficher les besoins disponibles.</p>
            : <div className="need-groups">{theoreticalNeeds.filter((row) => row.houses > 0).map((row) => {
              const tier = populationTiers.find((item) => item.id === row.tierId)!;
              const groupKey = row.tierId + ":" + row.groupId;
              const availableOptions = row.options.filter((option) => option.unlockAtHouses === undefined || row.houses >= option.unlockAtHouses);
              return <fieldset className="need-group" key={groupKey}>
                <legend>{tier.name} · {CATEGORY_LABELS[row.category]}</legend>
                {availableOptions.length === 0 ? <small className="need-hint">Aucune option débloquée pour ce nombre de maisons.</small>
                  : availableOptions.map((option) => <label className="need-option" key={option.id}>
                    <input type="radio" name={groupKey} checked={selectedNeeds[groupKey] === option.id}
                      onChange={() => updateSelectedNeed(groupKey, option.id)} />
                    <span><strong>{resourceNames.get(option.goodId) ?? option.goodId}</strong>
                      <small>{option.buildingIds?.map((id) => buildingNames.get(id) ?? id).join(" → ") ?? "Chaîne de fourniture à préciser"}</small></span>
                  </label>)}
              </fieldset>;
            })}</div>}
        </section>

        <section className="panel results-panel" aria-live="polite">
          <div className="panel-heading"><div><p className="eyebrow">02 · RÉSULTATS EN DIRECT</p><h3>Ressources nécessaires</h3></div></div>
          {!simulation ? <div className="results-placeholder"><p>Les résultats apparaîtront dès que la saisie sera valide.</p></div> : <>
            <div className="population-total"><span>Population totale calculée</span><strong>{simulation.totalPopulation.toLocaleString("fr-FR")}</strong><small>habitants</small></div>
            <div className="table-wrap"><table className="results-table">
              <thead><tr><th>Ressource / service</th><th>Quantité nécessaire</th></tr></thead>
              <tbody>{theoreticalNeeds.filter((row) => row.houses > 0 && row.selectedNeedId).map((row) => {
                const selected = row.options.find((option) => option.id === row.selectedNeedId)!;
                return <tr key={row.tierId + row.groupId}>
                  <td>{resourceNames.get(selected.goodId) ?? selected.goodId}</td>
                  <td className="numeric">{row.requiredPerMinute === null ? "À quantifier" : row.requiredPerMinute.toLocaleString("fr-FR", { maximumFractionDigits: 3 }) + " / min"}</td>
                </tr>;
              })}</tbody>
            </table></div>
            {theoreticalNeeds.every((row) => row.houses === 0 || !row.selectedNeedId) && <p className="subtle">Sélectionnez les biens et services que vous souhaitez fournir à vos habitants.</p>}
            {simulation.goods.length > 0 && <div className="table-wrap measured-flow-table"><h4>Demande calculée à partir des taux renseignés</h4><table className="results-table">
              <thead><tr><th>Ressource</th><th>Débit demandé</th></tr></thead>
              <tbody>{simulation.goods.map((balance) => <tr key={balance.good}><td>{resourceNames.get(balance.good) ?? balance.good}</td><td className="numeric">{balance.demandPerMinute.toLocaleString("fr-FR", { maximumFractionDigits: 3 })} / min</td></tr>)}</tbody>
            </table></div>}
            {selectedBuildingIds.length > 0 && <div className="recommended-buildings"><h4>Bâtiments associés</h4><ul>{selectedBuildingIds.map((id) => <li key={id}>{buildingNames.get(id) ?? id}</li>)}</ul></div>}
            <p className="subtle result-note">Les relations besoin/ressource sont encore au statut candidat. Les quantités restent « à quantifier » tant que les taux de consommation par maison n'ont pas été relevés et validés en jeu. Les rendements de production seront intégrés dans une étape distincte.</p>
          </>}
        </section>
      </div> : null}
      <CatalogWorkbench initialCatalog={initialCatalog} />
    </div>
  </main>;
}
