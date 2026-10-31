import type { Flow } from "@anno117/core";

export type VerificationStatus =
  | "candidate"
  | "to-observe"
  | "observed"
  | "verified"
  | "derived"
  | "disputed"
  | "excluded";

export type EvidenceMethod = "observation" | "experiment" | "derived";

export interface EvidenceRecord {
  id: string;
  method: EvidenceMethod;
  observedAt: string;
  gameVersion: string;
  notes: string;
  /** Required for derived evidence; references other evidence records. */
  basedOn?: string[];
}

export interface CatalogEntity {
  id: string;
  name: string;
  status: VerificationStatus;
  evidenceIds: string[];
}

export interface Resource extends CatalogEntity {
  category: "raw" | "intermediate" | "final" | "service";
}

export interface Region extends CatalogEntity {}

export interface Building extends CatalogEntity {
  regionId: string;
  recipeIds: string[];
}

export interface ProductionRecipe extends CatalogEntity {
  buildingId: string;
  inputs: Flow[];
  outputs: Flow[];
}

export type PopulationNeedCategory = "food" | "public-service" | "fashion" | "household";

export interface PopulationNeed {
  id: string;
  category: PopulationNeedCategory;
  /** Resource or service required to fulfil this need. */
  goodId: string;
  /** Consumption rate per residence, when measured. */
  consumptionPerHousePerMinute?: number;
  /** Effects applied while the need is fulfilled. */
  effects?: {
    population?: number;
    income?: number;
  };
  /** Optional multiplicative modifier to the need's base consumption rate. */
  consumptionModifier?: number;
}

export interface PopulationTier extends CatalogEntity {
  /** Base residents per house, before fulfilled-need effects. */
  residentsPerHouse: number;
  /** Legacy core-compatible rate, expressed per resident. */
  consumptionPerResident: Flow[];
  /** Needs and their residence-level effects. Empty/omitted means not yet observed. */
  needs?: PopulationNeed[];
}

export interface IslandAvailability extends CatalogEntity {
  regionId: string;
  kind: "fertility" | "deposit" | "natural-resource";
  resourceId: string;
}

export interface CatalogModules {
  resources: Resource[];
  buildings: Building[];
  production: ProductionRecipe[];
  population: PopulationTier[];
  regions: Region[];
  islandAvailability: IslandAvailability[];
  evidence: EvidenceRecord[];
}

export interface CatalogManifest {
  id: string;
  catalogVersion: string;
  schemaVersion: string;
  gameVersion: string;
  scope: {
    edition: "base-game";
    regions: string[];
  };
  modules: readonly (keyof CatalogModules)[];
}

export interface ModularGameCatalog {
  manifest: CatalogManifest;
  modules: CatalogModules;
}

export interface CatalogDiagnostic {
  severity: "error" | "warning";
  code: string;
  path: string;
  message: string;
}

export interface CoreCatalogProjection {
  buildings: Array<{ id: string }>;
  recipes: Array<{
    id: string;
    buildingId: string;
    inputs: Flow[];
    outputs: Flow[];
  }>;
  tiers: Array<{
    id: string;
    residentsPerHouse: number;
    consumptionPerResident: Flow[];
  }>;
}
