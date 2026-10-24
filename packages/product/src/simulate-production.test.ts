import { describe, expect, it } from "vitest";
import type { Catalog, IslandInput } from "@anno117/core";
import { simulateProduction } from "./simulate-production";

const catalog: Catalog = {
  buildings: [
    {
      id: "bakery",
      output: { good: "bread", perMinute: 2 },
      inputs: [],
    },
  ],
  tiers: [
    {
      id: "citizens",
      residentsPerHouse: 2,
      consumptionPerResident: [
        { good: "bread", perMinute: 0.5 },
      ],
    },
  ],
};

const island: IslandInput = {
  name: "Test Island",
  houses: { citizens: 2 },
  built: { bakery: 0 },
};

describe("simulateProduction", () => {
  it("returns the island name, population and production report", () => {
    const result = simulateProduction({ catalog, island });

    expect(result.islandName).toBe("Test Island");
    expect(result.totalPopulation).toBe(4);
    expect(result.buildings).toEqual([
      {
        buildingId: "bakery",
        good: "bread",
        demandPerMinute: 2,
        required: 1,
        built: 0,
        delta: 1,
      },
    ]);
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