import { useEffect, useMemo, useState } from "react";
import type {
  CatalogEntity,
  ModularGameCatalog,
  VerificationStatus,
} from "@anno117/game-data";

type EditableModule = "resources" | "buildings" | "production" | "population" | "regions" | "islandAvailability";

const STATUS_OPTIONS: Array<{ value: VerificationStatus; label: string }> = [
  { value: "candidate", label: "Candidate" },
  { value: "to-observe", label: "À vérifier en jeu" },
  { value: "verified", label: "Vérifiée en jeu" },
];

const MODULE_LABELS: Array<{ key: EditableModule; label: string }> = [
  { key: "resources", label: "Marchandises" },
  { key: "buildings", label: "Bâtiments" },
  { key: "production", label: "Recettes" },
  { key: "population", label: "Paliers de population" },
  { key: "regions", label: "Régions" },
  { key: "islandAvailability", label: "Disponibilités des îles" },
];

const STORAGE_KEY = "anno117-planner.personal-catalog.v1";

interface CatalogWorkbenchProps {
  initialCatalog: ModularGameCatalog;
}

function loadSavedCatalog(fallback: ModularGameCatalog): ModularGameCatalog {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;
    const parsed: unknown = JSON.parse(saved);
    if (
      parsed &&
      typeof parsed === "object" &&
      "manifest" in parsed &&
      "modules" in parsed
    ) {
      return parsed as ModularGameCatalog;
    }
  } catch {
    // A corrupt or unavailable local draft must never prevent the base catalog loading.
  }
  return fallback;
}

export function CatalogWorkbench({ initialCatalog }: CatalogWorkbenchProps) {
  const [catalog, setCatalog] = useState(() => loadSavedCatalog(initialCatalog));
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    } catch {
      setSaveMessage("Sauvegarde locale indisponible. Exportez le fichier JSON.");
    }
  }, [catalog]);

  const totalEntries = useMemo(
    () => MODULE_LABELS.reduce((total, module) => total + catalog.modules[module.key].length, 0),
    [catalog],
  );

  const statusCounts = useMemo(() => {
    const entities = MODULE_LABELS.flatMap(({ key }) => catalog.modules[key] as CatalogEntity[]);
    return {
      candidate: entities.filter((entry) => entry.status === "candidate").length,
      toObserve: entities.filter((entry) => entry.status === "to-observe").length,
      verified: entities.filter((entry) => entry.status === "verified" || entry.status === "derived").length,
    };
  }, [catalog]);

  function updateStatus(moduleKey: EditableModule, entityId: string, status: VerificationStatus) {
    setCatalog((current) => {
      const next = structuredClone(current);
      const entities = next.modules[moduleKey] as CatalogEntity[];
      const entity = entities.find((item) => item.id === entityId);
      if (entity) entity.status = status;
      return next;
    });
    setSaveMessage("Modifications enregistrées dans le catalogue personnel.");
  }

  function exportCatalog() {
    const content = JSON.stringify(catalog, null, 2);
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "anno117-catalogue-personnel.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setSaveMessage("Export du catalogue personnel lancé.");
  }

  function resetCatalog() {
    if (!window.confirm("Recharger le catalogue de référence et perdre les modifications personnelles locales ?")) return;
    setCatalog(structuredClone(initialCatalog));
    setSaveMessage("Catalogue personnel réinitialisé depuis le catalogue moteur.");
  }

  return (
    <section className="panel catalog-workbench">
      <div className="panel-heading workbench-heading">
        <div>
          <p className="eyebrow">03 · RÉFÉRENTIEL DE TRAVAIL</p>
          <h3>Catalogue personnel</h3>
          <p className="workbench-description">
            Consultez les éléments recensés, leur provenance et leur état de validation. Les données candidates ne sont pas utilisées par le moteur.
          </p>
        </div>
        <div className="workbench-actions">
          <button className="secondary-button" type="button" onClick={resetCatalog}>Réinitialiser</button>
          <button className="primary-button export-button" type="button" onClick={exportCatalog}>Enregistrer / Exporter JSON</button>
        </div>
      </div>

      <div className="workbench-summary">
        <strong>{totalEntries}</strong> entrées suivies
        <span>{statusCounts.candidate} candidates · {statusCounts.toObserve} à observer · {statusCounts.verified} vérifiées / dérivées</span>
      </div>

      {MODULE_LABELS.map(({ key, label }) => {
        const entries = catalog.modules[key] as CatalogEntity[];
        if (entries.length === 0) return null;
        return (
          <div className="catalog-section" key={key}>
            <div className="catalog-section-heading">
              <h4>{label}</h4>
              <span>{entries.length}</span>
            </div>
            <div className="catalog-entries">
              {entries.map((entry) => (
                <div className="catalog-entry" key={entry.id}>
                  <span className="catalog-entry-name">
                    <strong>{entry.name}</strong>
                    <small>{entry.id}</small>
                    {entry.description && <small>{entry.description}</small>}
                    {entry.sourceRefs?.length ? <small>Sources documentaires : {entry.sourceRefs.join(", ")}</small> : null}
                  </span>
                  <select
                    className="status-select"
                    aria-label={`État de validation — ${entry.name}`}
                    value={STATUS_OPTIONS.some((option) => option.value === entry.status) ? entry.status : "to-observe"}
                    onChange={(event) => updateStatus(key, entry.id, event.target.value as VerificationStatus)}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <p className="workbench-note">
        Les références SRC-* renvoient au registre documentaire du projet. Elles indiquent la provenance d'une information, pas une preuve d'observation en jeu.
        Seuls les éléments validés selon les règles du catalogue peuvent alimenter le moteur de calcul.
      </p>
      <p className="save-message" role="status">{saveMessage || "Sauvegarde locale automatique active."}</p>
    </section>
  );
}
