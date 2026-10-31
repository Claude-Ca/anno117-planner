import type { Flow, PopulationNeed } from "@anno117/core";

export interface DataSource {
  id: string;
  title: string;
  url: string;
  accessedAt: string;
}

export interface Good {
  id: string;
  name: string;
  sourceId: string;
}

export interface Recipe {
  id: string;
  buildingId: string;
  inputs: Flow[];
  outputs: Flow[];
  sourceId: string;
}

export interface GameBuilding {
  id: string;
  name: string;
  recipeIds: string[];
  sourceId: string;
}

export interface GamePopulationTier {
  id: string;
  name: string;
  residentsPerHouse: number;
  consumptionPerResident: Flow[];
  /** Residence-level needs forwarded to the core calculation model. */
  needs?: PopulationNeed[];
  sourceId: string;
}

export interface GameCatalog {
  sources: DataSource[];
  goods: Good[];
  buildings: GameBuilding[];
  recipes: Recipe[];
  tiers: GamePopulationTier[];
}
