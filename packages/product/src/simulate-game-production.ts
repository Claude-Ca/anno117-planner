
import type { IslandInput } from "@anno117/core";
import { toCoreCatalog } from "@anno117/game-data";
import type { GameCatalog } from "@anno117/game-data";
import {
  simulateProduction,
  type ProductionSimulationResult,
} from "./simulate-production";

export interface SimulateGameProductionInput {
  catalog: GameCatalog;
  island: IslandInput;
}

export function simulateGameProduction(
  input: SimulateGameProductionInput,
): ProductionSimulationResult {
  const catalog = toCoreCatalog(input.catalog);

  return simulateProduction({
    catalog,
    island: input.island,
  });
}
