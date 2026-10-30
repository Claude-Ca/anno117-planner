import type { Catalog } from "@anno117/core";
import {
  validateModularCatalog,
  type CatalogDiagnostic,
  type CatalogModules,
  type ModularGameCatalog,
  type CoreCatalogProjection,
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
 * access occurs here: the desktop bundle imports the JSON modules and passes
 * them to this function.
 */
export function loadGameData(input: ModularGameCatalog): DataRepository {
  const snapshot = JSON.parse(JSON.stringify(input)) as ModularGameCatalog;\n  const diagnostics = validateModularCatalog(snapshot);
  const blocking = diagnostics.filter((d) => d.severity === "error");
  if (blocking.length) {
    throw new Error(blocking.map((d) => `[${d.code}] ${d.path}: ${d.message}`).join("\n"));
  }

  const coreCatalog = toCoreProjection(snapshot.modules);
  return Object.freeze({
    manifest: deepFreeze(input.manifest),
    modules: deepFreeze(input.modules),
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
    x.inputs.every((f) => resources.has(f.good)) &&
    x.outputs.every((f) => resources.has(f.good)),
  );
  const recipeIds = new Set(recipes.map((x) => x.id));
  const tiers = modules.population.filter((x) =>
    usable(x.status) && x.consumptionPerResident.every((f) => resources.has(f.good)),
  );

  return {
    buildings: buildings
      .filter((building) => recipes.some((recipe) => recipe.buildingId === building.id))
      .map(({ id }) => ({ id })),
    recipes: recipes.map(({ id, buildingId, inputs, outputs }) => ({
      id, buildingId, inputs: inputs.map((x) => ({ ...x })), outputs: outputs.map((x) => ({ ...x })),
    })),
    tiers: tiers.map(({ id, residentsPerHouse, consumptionPerResident }) => ({
      id, residentsPerHouse,
      consumptionPerResident: consumptionPerResident.map((x) => ({ ...x })),
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

export type { CatalogDiagnostic, ModularGameCatalog, CoreCatalogProjection };
