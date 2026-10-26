
import { describe, expect, it } from "vitest";
import type { Catalog, IslandInput } from "@anno117/core";
import { simulateProduction } from "./simulate-production";

const catalog: Catalog = {
  buildings: [{ id: "bakery" }],
  recipes: [
    {
      id: "baking",
      buildingId: "bakery",
      inputs: [],
      outputs: [{ good: "bread", perMinute: 2 }],
    },
  ],
  tiers: [
    {
      id: "citizens",
      residentsPerHouse: 2,
      consumptionPerResident: [{ good: "bread", perMinute: 0.5 }],
    },
  ],
};

const island: IslandInput = {
  name: "Test Island",
  houses: { citizens: 2 },
  built: { bakery: 1 },
  recipeAssignments: { baking: 1 },
};

describe("simulateProduction", () => {
  it("returns the island name, population and production report", () => {
    const result = simulateProduction({ catalog, island });

    expect(result.islandName).toBe("Test Island");
    expect(result.totalPopulation).toBe(4);
    expect(result.recipes).toEqual([
      {
        recipeId: "baking",
        buildingId: "bakery",
        assignedBuildings: 1,
        effectiveOutputs: [{ good: "bread", perMinute: 2 }],
        effectiveInputs: [],
      },
    ]);
    expect(result.goods).toEqual([
      {
        good: "bread",
        demandPerMinute: 2,
        allocatedProductionPerMinute: 2,
        deficitPerMinute: 0,
        surplusPerMinute: 0,
        unresolved: false,
      },
    ]);
    expect(result.unresolvedAllocations).toEqual([]);
  });

  it("propagates validation errors from the core engine", () => {
    const invalidIsland: IslandInput = {
      ...island,
      name: "",
    };

    expect(() =>
      simulateProduction({ catalog, island: invalidIsland }),
    ).toThrow();
  });
});
