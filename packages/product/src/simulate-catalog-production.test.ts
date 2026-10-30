import { describe, expect, it } from "vitest";
import type { IslandInput } from "@anno117/core";
import { loadGameData } from "@anno117/data-engine";
import type { ModularGameCatalog } from "@anno117/game-data";
import { simulateCatalogProduction } from "./simulate-catalog-production";

function createCatalog(): ModularGameCatalog {
  const modules = [
    "resources",
    "buildings",
    "production",
    "population",
    "regions",
    "islandAvailability",
    "evidence",
  ] as const;

  const evidence = [{
    id: "synthetic-observation",
    method: "observation" as const,
    observedAt: "2026-10-30",
    gameVersion: "synthetic-fixture",
    notes: "Donnée synthétique créée exclusivement pour les tests.",
  }];

  return {
    manifest: {
      id: "anno117-product-test",
      catalogVersion: "0.0.1-test",
      schemaVersion: "1",
      gameVersion: "synthetic-fixture",
      scope: { edition: "base-game", regions: ["latium"] },
      modules: [...modules],
    },
    modules: {
      resources: [
        {
          id: "wood",
          name: "Bois de test",
          category: "raw",
          status: "verified",
          evidenceIds: ["synthetic-observation"],
        },
        {
          id: "planks",
          name: "Planches de test",
          category: "intermediate",
          status: "verified",
          evidenceIds: ["synthetic-observation"],
        },
      ],
      buildings: [{
        id: "sawmill",
        name: "Scierie de test",
        regionId: "latium",
        recipeIds: ["planks-recipe"],
        status: "verified",
        evidenceIds: ["synthetic-observation"],
      }],
      production: [{
        id: "planks-recipe",
        name: "Production de planches de test",
        buildingId: "sawmill",
        inputs: [{ good: "wood", perMinute: 2 }],
        outputs: [{ good: "planks", perMinute: 1 }],
        status: "verified",
        evidenceIds: ["synthetic-observation"],
      }],
      population: [],
      regions: [{
        id: "latium",
        name: "Région de test",
        status: "verified",
        evidenceIds: ["synthetic-observation"],
      }],
      islandAvailability: [],
      evidence,
    },
  };
}

const island: IslandInput = {
  name: "Île de test",
  houses: {},
  built: { sawmill: 1 },
  recipeAssignments: { "planks-recipe": 1 },
};

describe("simulateCatalogProduction", () => {
  it("uses the validated modular repository through the product layer", () => {
    const repository = loadGameData(createCatalog());
    const result = simulateCatalogProduction({ repository, island });

    expect(result.islandName).toBe("Île de test");
    expect(result.recipes).toEqual([{
      recipeId: "planks-recipe",
      buildingId: "sawmill",
      assignedBuildings: 1,
      effectiveOutputs: [{ good: "planks", perMinute: 1 }],
      effectiveInputs: [{ good: "wood", perMinute: 2 }],
    }]);
  });

  it("propagates island validation errors from the core engine", () => {
    const repository = loadGameData(createCatalog());

    expect(() => simulateCatalogProduction({
      repository,
      island: { ...island, name: "" },
    })).toThrow();
  });
});
