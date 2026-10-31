import type {
  CatalogDiagnostic,
  CatalogManifest,
  ModularGameCatalog,
  VerificationStatus,
} from "./catalog-types";

const STATUSES: readonly VerificationStatus[] = [
  "candidate", "to-observe", "observed", "verified", "derived", "disputed", "excluded",
];
const MODULE_NAMES = [
  "resources", "buildings", "production", "population", "regions",
  "islandAvailability", "evidence",
] as const;

export function validateModularCatalog(catalog: ModularGameCatalog): CatalogDiagnostic[] {
  const diagnostics: CatalogDiagnostic[] = [];
  const add = (code: string, path: string, message: string) =>
    diagnostics.push({ severity: "error" as const, code, path, message });

  if (!catalog || typeof catalog !== "object") {
    add("CATALOG_INVALID", "catalog", "Le catalogue doit être un objet.");
    return diagnostics;
  }
  const { manifest, modules } = catalog;
  validateManifest(manifest, add);
  if (!modules || typeof modules !== "object") {
    add("MODULES_INVALID", "modules", "Les modules du catalogue sont obligatoires.");
    return diagnostics;
  }
  for (const name of MODULE_NAMES) {
    if (!Array.isArray(modules[name])) add("MODULE_MISSING", `modules.${name}`, "Le module doit être un tableau.");
  }
  if (diagnostics.length) return diagnostics;

  const ids = new Map<string, Set<string>>();
  for (const name of MODULE_NAMES) {
    const rows = modules[name] as Array<{ id: string }>;
    const seen = new Set<string>();
    rows.forEach((row, index) => {
      const path = `modules.${name}[${index}]`;
      if (!row || typeof row.id !== "string" || !row.id.trim()) add("ID_REQUIRED", `${path}.id`, "Identifiant obligatoire.");
      else if (seen.has(row.id)) add("ID_DUPLICATE", `${path}.id`, `Identifiant dupliqué : ${row.id}.`);
      if (row && typeof row.id === "string") seen.add(row.id);
    });
    ids.set(name, seen);
  }

  const evidenceIds = ids.get("evidence")!;
  const checkEvidence = (evidence: string[], path: string) => {
    if (!Array.isArray(evidence) || evidence.length === 0) {
      add("EVIDENCE_REQUIRED", path, "Au moins une référence de preuve interne est obligatoire.");
      return;
    }
    evidence.forEach((id, i) => {
      if (!evidenceIds.has(id)) add("EVIDENCE_UNKNOWN", `${path}[${i}]`, `Preuve inconnue : ${id}.`);
    });
  };

  modules.evidence.forEach((e, i) => {
    const p = `modules.evidence[${i}]`;
    if (!e.gameVersion?.trim() || !e.notes?.trim()) add("EVIDENCE_INCOMPLETE", p, "Version du jeu et notes obligatoires.");
    const date = /^\d{4}-\d{2}-\d{2}$/.test(e.observedAt ?? "")
      ? new Date(`${e.observedAt}T00:00:00.000Z`)
      : null;
    if (!date || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== e.observedAt) {
      add("DATE_INVALID", `${p}.observedAt`, "Date attendue au format YYYY-MM-DD et réellement valide.");
    }
    if (e.method === "derived" && (!e.basedOn?.length || e.basedOn.some((id) => !evidenceIds.has(id)))) {
      add("DERIVATION_UNGROUNDED", `${p}.basedOn`, "Une donnée dérivée doit référencer des preuves existantes.");
    }
    if (e.method !== "derived" && e.basedOn?.length) {
      add("DERIVATION_UNEXPECTED", `${p}.basedOn`, "Seules les preuves dérivées déclarent basedOn.");
    }
  });

  const entities = [
    ...modules.resources.map((x, i) => ({ x, p: `modules.resources[${i}]` })),
    ...modules.buildings.map((x, i) => ({ x, p: `modules.buildings[${i}]` })),
    ...modules.production.map((x, i) => ({ x, p: `modules.production[${i}]` })),
    ...modules.population.map((x, i) => ({ x, p: `modules.population[${i}]` })),
    ...modules.regions.map((x, i) => ({ x, p: `modules.regions[${i}]` })),
    ...modules.islandAvailability.map((x, i) => ({ x, p: `modules.islandAvailability[${i}]` })),
  ];
  entities.forEach(({ x, p }) => {
    if (!x || typeof x.name !== "string" || !x.name.trim()) add("NAME_REQUIRED", `${p}.name`, "Libellé obligatoire.");
    if (!STATUSES.includes(x.status)) add("STATUS_INVALID", `${p}.status`, "Statut de vérification inconnu.");
    if (x.status !== "candidate" && x.status !== "to-observe" && x.status !== "excluded") checkEvidence(x.evidenceIds, `${p}.evidenceIds`);
  });

  const resourceIds = ids.get("resources")!;
  const buildingIds = ids.get("buildings")!;
  const recipeIds = ids.get("production")!;
  const regionIds = ids.get("regions")!;
  manifest.scope.regions.forEach((regionId, index) => {
    if (!regionIds.has(regionId)) add("MANIFEST_REGION_UNKNOWN", `manifest.scope.regions[${index}]`, `Région non définie dans le module regions : ${regionId}.`);
  });

  const checkFlows = (flows: Array<{ good: string; perMinute: number }>, path: string) => {
    if (!Array.isArray(flows)) { add("FLOWS_INVALID", path, "Le flux doit être un tableau."); return; }
    const seen = new Set<string>();
    flows.forEach((flow, i) => {
      const p = `${path}[${i}]`;
      if (!resourceIds.has(flow.good)) add("RESOURCE_UNKNOWN", `${p}.good`, `Ressource inconnue : ${flow.good}.`);
      if (!Number.isFinite(flow.perMinute) || flow.perMinute <= 0) add("RATE_INVALID", `${p}.perMinute`, "Le débit doit être fini et strictement positif.");
      if (seen.has(flow.good)) add("FLOW_DUPLICATE", `${p}.good`, "Ressource répétée dans le même flux.");
      seen.add(flow.good);
    });
  };

  modules.buildings.forEach((b, i) => {
    const p = `modules.buildings[${i}]`;
    if (!regionIds.has(b.regionId)) add("REGION_UNKNOWN", `${p}.regionId`, `Région inconnue : ${b.regionId}.`);
    b.recipeIds.forEach((id, j) => {
      if (!recipeIds.has(id)) add("RECIPE_UNKNOWN", `${p}.recipeIds[${j}]`, `Recette inconnue : ${id}.`);
    });
  });
  modules.production.forEach((r, i) => {
    const p = `modules.production[${i}]`;
    if (!buildingIds.has(r.buildingId)) add("BUILDING_UNKNOWN", `${p}.buildingId`, `Bâtiment inconnu : ${r.buildingId}.`);
    if (!r.inputs.length && !r.outputs.length) add("RECIPE_EMPTY", p, "Une recette doit avoir une entrée ou une sortie.");
    checkFlows(r.inputs, `${p}.inputs`);
    checkFlows(r.outputs, `${p}.outputs`);
    const building = modules.buildings.find((b) => b.id === r.buildingId);
    if (building && !building.recipeIds.includes(r.id)) add("BUILDING_RECIPE_MISMATCH", `${p}.buildingId`, "Le bâtiment ne référence pas cette recette.");
  });
  modules.population.forEach((t, i) => {
    const p = `modules.population[${i}]`;
    if (!Number.isFinite(t.residentsPerHouse) || t.residentsPerHouse <= 0) add("POPULATION_INVALID", `${p}.residentsPerHouse`, "Nombre de résidents invalide.");
    checkFlows(t.consumptionPerResident, `${p}.consumptionPerResident`);
    const seenNeeds = new Set<string>();
    (t.needs ?? []).forEach((need, j) => {
      const np = `${p}.needs[${j}]`;
      if (!need.id?.trim()) add("NEED_ID_REQUIRED", `${np}.id`, "Identifiant de besoin obligatoire.");
      if (seenNeeds.has(need.id)) add("NEED_DUPLICATE", `${np}.id`, `Besoin dupliqué : ${need.id}.`);
      seenNeeds.add(need.id);
      if (!["food", "public-service", "fashion", "household"].includes(need.category)) {
        add("NEED_CATEGORY_INVALID", `${np}.category`, "Catégorie de besoin inconnue.");
      }
      if (!resourceIds.has(need.goodId)) {
        add("RESOURCE_UNKNOWN", `${np}.goodId`, `Ressource inconnue : ${need.goodId}.`);
      }
      if (need.consumptionPerHousePerMinute !== undefined &&
          (!Number.isFinite(need.consumptionPerHousePerMinute) || need.consumptionPerHousePerMinute <= 0)) {
        add("NEED_RATE_INVALID", `${np}.consumptionPerHousePerMinute`, "Le taux par résidence doit être fini et strictement positif.");
      }
      if (need.consumptionModifier !== undefined &&
          (!Number.isFinite(need.consumptionModifier) || need.consumptionModifier <= 0)) {
        add("NEED_MODIFIER_INVALID", `${np}.consumptionModifier`, "Le modificateur de consommation doit être fini et strictement positif.");
      }
      for (const effect of ["population", "income"] as const) {
        const value = need.effects?.[effect];
        if (value !== undefined && !Number.isFinite(value)) {
          add("NEED_EFFECT_INVALID", `${np}.effects.${effect}`, "L'effet doit être un nombre fini.");
        }
      }
    });
  });
  modules.islandAvailability.forEach((a, i) => {
    const p = `modules.islandAvailability[${i}]`;
    if (!regionIds.has(a.regionId)) add("REGION_UNKNOWN", `${p}.regionId`, `Région inconnue : ${a.regionId}.`);
    if (!resourceIds.has(a.resourceId)) add("RESOURCE_UNKNOWN", `${p}.resourceId`, `Ressource inconnue : ${a.resourceId}.`);
  });

  return diagnostics;
}

function validateManifest(
  manifest: CatalogManifest,
  add: (code: string, path: string, message: string) => void,
): void {
  for (const key of ["id", "catalogVersion", "schemaVersion", "gameVersion"] as const) {
    if (!manifest?.[key]?.trim()) add("MANIFEST_REQUIRED", `manifest.${key}`, "Champ obligatoire.");
  }
  if (manifest?.scope?.edition !== "base-game") add("SCOPE_UNSUPPORTED", "manifest.scope.edition", "Seul le jeu de base est couvert en V1.");
  if (!manifest?.scope?.regions?.length) add("REGIONS_REQUIRED", "manifest.scope.regions", "Au moins une région doit être déclarée.");
  if (manifest?.scope?.regions && new Set(manifest.scope.regions).size !== manifest.scope.regions.length) {
    add("REGIONS_DUPLICATE", "manifest.scope.regions", "Les régions doivent être uniques.");
  }
  if (!Array.isArray(manifest?.modules) || manifest.modules.length !== MODULE_NAMES.length ||
      MODULE_NAMES.some((name) => !manifest.modules.includes(name))) {
    add("MANIFEST_MODULES_INVALID", "manifest.modules", "Le manifeste doit déclarer chaque module exactement une fois.");
  }
}
