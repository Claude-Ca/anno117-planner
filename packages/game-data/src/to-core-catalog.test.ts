
import { describe, expect, it } from "vitest";
import type { GameCatalog } from "./types";
import { toCoreCatalog } from "./to-core-catalog";
import { validateGameCatalog } from "./validate-catalog";

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
      { id: "test-byproduct", name: "Sous-produit de test", sourceId: "test-source" },
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

  it("refuse une recette non référencée par son bâtiment", () => {
    const catalog = createCatalog();

    catalog.buildings[0]!.recipeIds = [];

    const errors = validateGameCatalog(catalog);

    expect(errors).toContainEqual({
      path: "recipes[0].buildingId",
      message:
        'La recette "test-smelting" n\'est pas référencée par le bâtiment "test-smelter".',
    });
  });

  it("convertit un catalogue valide vers le modèle core", () => {
    expect(toCoreCatalog(createCatalog())).toEqual({
      buildings: [{ id: "test-smelter" }],
      recipes: [
        {
          id: "test-smelting",
          buildingId: "test-smelter",
          inputs: [{ good: "test-ore", perMinute: 2 }],
          outputs: [{ good: "test-metal", perMinute: 1 }],
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

  it("accepte une recette avec plusieurs sorties", () => {
    const catalog = createCatalog();
    catalog.recipes[0]!.outputs.push({
      good: "test-byproduct",
      perMinute: 0.5,
    });

    expect(toCoreCatalog(catalog).recipes[0]!.outputs).toEqual([
      { good: "test-metal", perMinute: 1 },
      { good: "test-byproduct", perMinute: 0.5 },
    ]);
  });

  it("accepte plusieurs recettes pour un même bâtiment", () => {
    const catalog = createCatalog();

    catalog.buildings[0]!.recipeIds.push("test-second-recipe");
    catalog.recipes.push({
      id: "test-second-recipe",
      buildingId: "test-smelter",
      inputs: [],
      outputs: [{ good: "test-byproduct", perMinute: 1 }],
      sourceId: "test-source",
    });

    expect(toCoreCatalog(catalog).recipes).toHaveLength(2);
    expect(
      toCoreCatalog(catalog).recipes.map((recipe) => recipe.buildingId),
    ).toEqual(["test-smelter", "test-smelter"]);
  });

  it("accepte plusieurs bâtiments produisant le même bien", () => {
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

    expect(
      toCoreCatalog(catalog).recipes.filter((recipe) =>
        recipe.outputs.some((output) => output.good === "test-metal"),
      ),
    ).toHaveLength(2);
  });

  it("refuse une recette sans bâtiment associé", () => {
    const catalog = createCatalog();
    catalog.buildings[0]!.recipeIds = [];
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
      outputs: [{ good: "test-byproduct", perMinute: 1 }],
      sourceId: "test-source",
    });

    expect(() => toCoreCatalog(catalog)).toThrow(/Catalogue invalide/);
  });

  it("refuse une association incohérente entre recette et bâtiment", () => {
    const catalog = createCatalog();

    catalog.buildings.push({
      id: "test-other-smelter",
      name: "Autre fonderie de test",
      recipeIds: ["test-smelting"],
      sourceId: "test-source",
    });

    catalog.recipes[0]!.buildingId = "test-other-smelter";

    expect(() => toCoreCatalog(catalog)).toThrow(
      /référencée par plusieurs bâtiments/,
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
