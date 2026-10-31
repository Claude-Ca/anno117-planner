export { validateModularCatalog } from "./catalog-validation";
export type {
  Building, CatalogDiagnostic, CatalogEntity, CatalogManifest, CatalogModules,
  CoreCatalogProjection, EvidenceMethod, EvidenceRecord, IslandAvailability,
  ModularGameCatalog, PopulationNeed, PopulationNeedCategory, PopulationTier, ProductionRecipe, Region, Resource,
  VerificationStatus,
} from "./catalog-types";

// Legacy flat-catalog exports remain temporarily available to avoid breaking
// existing consumers while the modular catalog becomes the canonical model.
export { validateGameCatalog } from "./validate-catalog";
export type { CatalogValidationError } from "./validate-catalog";
export { toCoreCatalog } from "./to-core-catalog";
export type { DataSource, GameBuilding, GameCatalog, GamePopulationTier, Good, Recipe } from "./types";
