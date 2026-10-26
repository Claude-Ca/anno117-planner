
import { describe, expect, it } from "vitest";
import type { IslandInput } from "@anno117/core";
import type { GameCatalog } from "@anno117/game-data";
import { simulateGameProduction } from "./simulate-game-production";

const catalog: GameCatalog = {
  sources: [
    {
      id: "test-source",
      title: "Source de test synthétique",
      url: "https://example.com/test-data",
      accessedAt: "2026-10-24",
    },
  ],
  goods: [
    {
      id: "bread",
      name: "Pain",
      sourceId: "test-source",
    },
  ],
  recipes: [
    {
      id: "bakery-recipe",
      buildingId: "bakery",
      inputs: [],
      outputs: [{ good: "bread", perMinute: 2 }],
      sourceId: "test-source",
    },
  ],
  buildings: [
    {
      id: "bakery",
      name: "Boulangerie",
      recipeIds: ["bakery-recipe"],
      sourceId: "test-source",
    },
  ],
  tiers: [
    {
      id: "citizens",
      name: "Citoyens",
      residentsPerHouse: 2,
      consumptionPerResident: [
        { good: "bread", perMinute: 0.5 },
      ],
      sourceId: "test-source",
    },
  ],
};

const island: IslandInput = {
  name: "Test Island",
  houses: { citizens: 2 },
  built: { bakery: 0 },
};

describe("simulateGameProduction", () => {
  it("converts the game catalog and simulates production", () => {
    const result = simulateGameProduction({ catalog, island });

    expect(result.islandName).toBe("Test Island");
    expect(result.totalPopulation).toBe(4);
    expect(result.recipes).toEqual([
  {
    recipeId: "bakery-recipe",
    buildingId: "bakery",
    assignedBuildings: 0,
    effectiveOutputs: [{ good: "bread", perMinute: 0 }],
    effectiveInputs: [],
  },
]);

expect(result.goods).toEqual([
  {
    good: "bread",
    demandPerMinute: 2,
    allocatedProductionPerMinute: 0,
    deficitPerMinute: 2,
    surplusPerMinute: 0,
    unresolved: false,
  },
]);

expect(result.unresolvedAllocations).toEqual([]);
  });

  it("rejects an invalid game catalog", () => {
    const invalidCatalog: GameCatalog = {
      ...catalog,
      buildings: [],
    };

    expect(() =>
      simulateGameProduction({
        catalog: invalidCatalog,
        island,
      }),
    ).toThrow(/Catalogue invalide/);
  });

  it("propagates island validation errors", () => {
    const invalidIsland: IslandInput = {
      ...island,
      name: "",
    };

    expect(() =>
      simulateGameProduction({
        catalog,
        island: invalidIsland,
      }),
    ).toThrow();
  });
});
