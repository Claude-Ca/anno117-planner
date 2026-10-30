import { describe, expect, it } from "vitest";
import { loadGameData, type GameDataInput } from "./index";

function createInput(): GameDataInput {
  return {
    manifest: {
      id: "anno117-base",
      catalogVersion: "0.0.1-draft",
      schemaVersion: "1",
      gameVersion: "Anno 117: Pax Romana — version à relever",
      regions: ["latium", "albion"],
    },
    catalog: {
      sources: [{
        id: "test-observation",
        title: "Observation synthétique de test",
        url: "https://example.invalid/observation",
        accessedAt: "2026-10-30",
      }],
      goods: [
        { id: "test-input", name: "Intrant de test", sourceId: "test-observation" },
        { id: "test-output", name: "Produit de test", sourceId: "test-observation" },
      ],
      buildings: [{
        id: "test-building",
        name: "Bâtiment de test",
        recipeIds: ["test-recipe"],
        sourceId: "test-observation",
      }],
      recipes: [{
        id: "test-recipe",
        buildingId: "test-building",
        inputs: [{ good: "test-input", perMinute: 1 }],
        outputs: [{ good: "test-output", perMinute: 2 }],
        sourceId: "test-observation",
      }],
      tiers: [],
    },
  };
}

describe("loadGameData", () => {
  it("validates and exposes the bundled catalog and core view", () => {
    const result = loadGameData(createInput());

    expect(result.manifest.id).toBe("anno117-base");
    expect(result.coreCatalog.recipes[0]?.id).toBe("test-recipe");
  });

  it("rejects an unknown cross-catalog reference", () => {
    const input = createInput();
    input.catalog.recipes[0]!.outputs[0]!.good = "missing-good";

    expect(() => loadGameData(input)).toThrow(/Catalogue invalide/);
  });

  it("rejects duplicate regions in the manifest", () => {
    const input = createInput();
    input.manifest.regions = ["latium", "latium"];

    expect(() => loadGameData(input)).toThrow(/uniques/);
  });
});
