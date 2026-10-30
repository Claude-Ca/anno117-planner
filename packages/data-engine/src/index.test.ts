import { describe, expect, it } from "vitest";
import { loadGameData } from "./index";
import { computeIsland } from "@anno117/core";
import type { ModularGameCatalog } from "@anno117/game-data";

function fixture(): ModularGameCatalog {
  const modules = ["resources", "buildings", "production", "population", "regions", "islandAvailability", "evidence"] as const;
  const evidence = [{ id: "obs-1", method: "observation" as const, observedAt: "2026-10-30", gameVersion: "test", notes: "Observation synthétique." }];
  return {
    manifest: {
      id: "anno117-test", catalogVersion: "0.0.1", schemaVersion: "1",
      gameVersion: "test", scope: { edition: "base-game", regions: ["latium"] },
      modules: [...modules],
    },
    modules: {
      resources: [
        { id: "wood", name: "Bois", category: "raw", status: "verified", evidenceIds: ["obs-1"] },
        { id: "planks", name: "Planches", category: "intermediate", status: "verified", evidenceIds: ["obs-1"] },
      ],
      buildings: [{ id: "sawmill", name: "Scierie", regionId: "latium", recipeIds: ["planks-recipe"], status: "verified", evidenceIds: ["obs-1"] }],
      production: [{ id: "planks-recipe", name: "Production de planches", buildingId: "sawmill", inputs: [{ good: "wood", perMinute: 2 }], outputs: [{ good: "planks", perMinute: 1 }], status: "verified", evidenceIds: ["obs-1"] }],
      population: [],
      regions: [{ id: "latium", name: "Latium", status: "verified", evidenceIds: ["obs-1"] }],
      islandAvailability: [],
      evidence,
    },
  };
}

describe("loadGameData", () => {
  it("aggregates modular data and creates a core-compatible projection", () => {
    const result = loadGameData(fixture());
    expect(result.coreCatalog.recipes).toEqual([{
      id: "planks-recipe", buildingId: "sawmill",
      inputs: [{ good: "wood", perMinute: 2 }],
      outputs: [{ good: "planks", perMinute: 1 }],
    }]);
  });

  it("rejects unknown cross-module references", () => {
    const input = fixture();
    input.modules.production[0]!.inputs[0]!.good = "missing";
    expect(() => loadGameData(input)).toThrow(/RESOURCE_UNKNOWN/);
  });

  it("does not expose unverified records to the core", () => {
    const input = fixture();
    input.modules.production[0]!.status = "observed";
    expect(loadGameData(input).coreCatalog.recipes).toEqual([]);
  });

  it("provides a projection directly consumable by the core", () => {
    const result = loadGameData(fixture());
    const report = computeIsland(result.coreCatalog, {
      name: "Test island", houses: {}, built: { sawmill: 1 },
      recipeAssignments: { "planks-recipe": 1 },
    });
    expect(report.recipes[0]?.recipeId).toBe("planks-recipe");
  });

  it("returns immutable snapshots", () => {
    const result = loadGameData(fixture());
    expect(Object.isFrozen(result.modules.resources)).toBe(true);
    expect(Object.isFrozen(result.coreCatalog.recipes[0]!.inputs)).toBe(true);
  });
});
