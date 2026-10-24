import { computeIsland } from "@anno117/core";
import type {
  BuildingReport,
  Catalog,
  IslandInput,
} from "@anno117/core";

export interface SimulateProductionInput {
  catalog: Catalog;
  island: IslandInput;
}

export interface ProductionSimulationResult {
  islandName: string;
  totalPopulation: number;
  buildings: BuildingReport[];
}

export function simulateProduction(
  input: SimulateProductionInput,
): ProductionSimulationResult {
  const report = computeIsland(input.catalog, input.island);

  return {
    islandName: input.island.name,
    totalPopulation: report.totalPopulation,
    buildings: report.buildings,
  };
}