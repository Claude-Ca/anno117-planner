
export type GoodId = string;
export type BuildingId = string;
export type RecipeId = string;
export type TierId = string;

/** Flux de marchandise en unités par minute, à 100 % de productivité. */
export interface Flow {
  good: GoodId;
  perMinute: number;
}

/** Bâtiment physique du catalogue. */
export interface ProductionBuilding {
  id: BuildingId;
}

/** Recette associée à un bâtiment, avec intrants et sorties multiples. */
export interface Recipe {
  id: RecipeId;
  buildingId: BuildingId;
  inputs: Flow[];
  outputs: Flow[];
}

/** Un palier de population et sa consommation par habitant. */
export interface PopulationTier {
  id: TierId;
  residentsPerHouse: number;
  consumptionPerResident: Flow[];
}

/** Catalogue exploitable par le moteur de calcul. */
export interface Catalog {
  buildings: ProductionBuilding[];
  recipes: Recipe[];
  tiers: PopulationTier[];
}

/**
 * Paramètres d'une île.
 * built représente le parc physique, indépendamment de son utilisation.
 */
export interface IslandInput {
  name: string;
  houses: Record<TierId, number>;
  built: Record<BuildingId, number>;
  /** Facteur de productivité par bâtiment ; 1 = 100 %. */
  productivity?: Record<BuildingId, number>;
  /** Nombre de bâtiments affectés manuellement à chaque recette. */
  recipeAssignments?: Record<RecipeId, number>;
}

/** Bilan d'une marchandise dans l'île. */
export interface GoodBalance {
  good: GoodId;
  demandPerMinute: number;
  allocatedProductionPerMinute: number;
  deficitPerMinute: number;
  surplusPerMinute: number;
  /** Vrai si une allocation non résolue empêche un bilan fiable. */
  unresolved: boolean;
}

/** Bilan d'une recette et de ses bâtiments affectés. */
export interface RecipeReport {
  recipeId: RecipeId;
  buildingId: BuildingId;
  assignedBuildings: number;
  effectiveOutputs: Flow[];
  effectiveInputs: Flow[];
}

/** Rapport de calcul d'une île. */
export interface IslandReport {
  totalPopulation: number;
  recipes: RecipeReport[];
  goods: GoodBalance[];
  unresolvedAllocations: string[];
}
