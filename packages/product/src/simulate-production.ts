
import { computeIsland } from "@anno117/core";
import type {
  Catalog,
  IslandInput,
  IslandReport,
} from "@anno117/core";

export interface SimulateProductionInput {
  catalog: Catalog;
  island: IslandInput;
}

export interface ProductionSimulationResult extends IslandReport {
  islandName: string;
}

export function simulateProduction(
  input: SimulateProductionInput,
): ProductionSimulationResult {
  const report = computeIsland(input.catalog, input.island);

  return {
    islandName: input.island.name,
    ...report,
  };
}
