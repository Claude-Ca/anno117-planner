import type { IslandInput } from "@anno117/core";
import type { DataRepository } from "@anno117/data-engine";
import {
  simulateProduction,
  type ProductionSimulationResult,
} from "./simulate-production";

/**
 * Runs the production use case against a repository created by
 * @anno117/data-engine. Data loading and validation remain outside the use
 * case so the desktop (or another adapter) can prepare the repository once
 * and reuse it for several calculations.
 */
export interface SimulateCatalogProductionInput {
  repository: DataRepository;
  island: IslandInput;
}

export function simulateCatalogProduction(
  input: SimulateCatalogProductionInput,
): ProductionSimulationResult {
  return simulateProduction({
    catalog: input.repository.coreCatalog,
    island: input.island,
  });
}
