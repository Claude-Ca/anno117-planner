import { describe, expect, it } from "vitest";
import type { GameCatalog } from "./types";
import { toCoreCatalog } from "./to-core-catalog";

function createCatalog(): GameCatalog {
  return {
    sources: [
      {
        id: "test-source",
        title: "Fixture synthétique",
        url: "https://example.com/test",
        accessedAt: "2026-10-24",
      },
    ],
    goods: [
      { id: "test-ore", name: "Minerai de test", sourceId: "test-source" },
      { id: "test-metal", name: "Métal de test", sourceId: "test-source" },
    ],
    buildings: [
      {
        id: "test-smelter",
        name: "Fonderie de test",
        recipeIds: ["test-smelting"],
        sourceId: "test-source",
      },
    ],
    recipes: [
      {
        id: "test-smelting",
        buildingId: "test-smelter",
        inputs: [{ good: "test-ore", perMinute: 2 }],
        outputs: [{ good: "test-metal", perMinute: 1 }],
        sourceId: "test-source",
      },
    ],
    tiers: [
      {
        id: "test-tier",
        name: "Palier de test",
        residentsPerHouse: 10,
        consumptionPerResident: [
          { good: "test-metal", perMinute: 0.01 },
        ],
        sourceId: "test-source",
      },
    ],
  };
}

describe("toCoreCatalog", () => {
  it("convertit un catalogue valide vers le modèle core", () => {
    expect(toCoreCatalog(createCatalog())).toEqual({
      buildings: [
        {
          id: "test-smelter",
          output: { good: "test-metal", perMinute: 1 },
          inputs: [{ good: "test-ore", perMinute: 2 }],
        },
      ],
      tiers: [
        {
          id: "test-tier",
          residentsPerHouse: 10,
          consumptionPerResident: [
            { good: "test-metal", perMinute: 0.01 },
          ],
        },
      ],
    });
  });

  it("refuse une recette avec plusieurs sorties", () => {
    const catalog = createCatalog();
    catalog.goods.push({
      id: "test-byproduct",
      name: "Sous-produit de test",
      sourceId: "test-source",
    });
    catalog.recipes[0]!.outputs.push({
      good: "test-byproduct",
      perMinute: 0.5,
    });

    expect(() => toCoreCatalog(catalog)).toThrow(
      /exactement une sortie/,
    );
  });

  it("refuse un bâtiment associé à plusieurs recettes", () => {
    const catalog = createCatalog();
    catalog.recipes.push({
      id: "test-second-recipe",
      buildingId: "test-smelter",
      inputs: [],
      outputs: [{ good: "test-metal", perMinute: 1 }],
      sourceId: "test-source",
    });
    catalog.buildings[0]!.recipeIds.push("test-second-recipe");

    expect(() => toCoreCatalog(catalog)).toThrow(
      /exactement une recette/,
    );
  });

  it("refuse un bien produit par plusieurs bâtiments", () => {
    const catalog = createCatalog();

    catalog.buildings.push({
      id: "test-second-smelter",
      name: "Deuxième fonderie de test",
      recipeIds: ["test-second-smelting"],
      sourceId: "test-source",
    });

    catalog.recipes.push({
      id: "test-second-smelting",
      buildingId: "test-second-smelter",
      inputs: [],
      outputs: [{ good: "test-metal", perMinute: 2 }],
      sourceId: "test-source",
    });

    expect(() => toCoreCatalog(catalog)).toThrow(
      /produit par plusieurs bâtiments/,
    );
  });

  it("refuse un catalogue invalide avant conversion", () => {
    const catalog = createCatalog();
    catalog.recipes[0]!.inputs[0]!.good = "unknown-good";

    expect(() => toCoreCatalog(catalog)).toThrow(
      /Catalogue invalide/,
    );
  });
});