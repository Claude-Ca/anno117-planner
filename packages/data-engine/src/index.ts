import type { Catalog } from "@anno117/core";
import {
  validateModularCatalog,
  type CatalogDiagnostic,
  type CatalogModules,
  type ModularGameCatalog,
} from "@anno117/game-data";

export interface DataRepository {
  readonly manifest: ModularGameCatalog["manifest"];
  readonly modules: CatalogModules;
  readonly diagnostics: readonly CatalogDiagnostic[];
  /** Projection containing verified and derived records only. */
  readonly coreCatalog: Catalog;
}

const usable = (status: string) => status === "verified" || status === "derived";

/**
 * Aggregates bundled modules, validates their references and creates a
 * conservative projection for the calculation core. No filesystem or network
 * access occurs here: the desktop bundle imports its local JSON modules and
 * passes the parsed modules to this function.
 */
export function loadGameData(input: ModularGameCatalog): DataRepository {
  // Work on an isolated JSON snapshot so freezing the repository never freezes
  // or otherwise changes the caller's input object.
  const snapshot = JSON.parse(JSON.stringify(input)) as ModularGameCatalog;
  const diagnostics = validateModularCatalog(snapshot);
  const blocking = diagnostics.filter((d) => d.severity === "error");
  if (blocking.length) {
    throw new Error(blocking.map((d) => `[${d.code}] ${d.path}: ${d.message}`).join("\n"));
  }

  const coreCatalog = toCoreProjection(snapshot.modules);
  return Object.freeze({
    manifest: deepFreeze(snapshot.manifest),
    modules: deepFreeze(snapshot.modules),
    diagnostics: Object.freeze([...diagnostics]),
    coreCatalog: deepFreeze(coreCatalog),
  });
}

function toCoreProjection(modules: CatalogModules): Catalog {
  const resources = new Set(modules.resources.filter((x) => usable(x.status)).map((x) => x.id));
  const buildings = modules.buildings.filter((x) => usable(x.status));
  const buildingIds = new Set(buildings.map((x) => x.id));
  const recipes = modules.production.filter((x) =>
    usable(x.status) &&
    buildingIds.has(x.buildingId) &&
    x.inputs.every((flow) => resources.has(flow.good)) &&
    x.outputs.every((flow) => resources.has(flow.good)),
  );
  const tiers = modules.population.filter((x) =>
    usable(x.status) && x.consumptionPerResident.every((flow) => resources.has(flow.good)),
  );

  return {
    buildings: buildings
      .filter((building) => recipes.some((recipe) => recipe.buildingId === building.id))
      .map(({ id }) => ({ id })),
    recipes: recipes.map(({ id, buildingId, inputs, outputs }) => ({
      id,
      buildingId,
      inputs: inputs.map((flow) => ({ ...flow })),
      outputs: outputs.map((flow) => ({ ...flow })),
    })),
    tiers: tiers.map(({ id, residentsPerHouse, consumptionPerResident }) => ({
      id,
      residentsPerHouse,
      consumptionPerResident: consumptionPerResident.map((flow) => ({ ...flow })),
    })),
  };
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
  }
  return value;
}

export type { CatalogDiagnostic, DataRepository, ModularGameCatalog };
