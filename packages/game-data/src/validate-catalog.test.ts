
import { describe, expect, it } from "vitest";
import type { GameCatalog } from "./types";
import { validateGameCatalog } from "./validate-catalog";

function createValidCatalog(): GameCatalog {
  return {
    sources: [
      {
        id: "test-source",
        title: "Fixture synthétique de test",
        url: "https://example.com/test-data",
        accessedAt: "2026-10-24",
      },
    ],
    goods: [
      {
        id: "test-wood",
        name: "Bien de test",
        sourceId: "test-source",
      },
      {
        id: "test-plank",
        name: "Produit de test",
        sourceId: "test-source",
      },
    ],
    buildings: [
      {
        id: "test-sawmill",
        name: "Bâtiment de test",
        recipeIds: ["test-recipe"],
        sourceId: "test-source",
      },
    ],
    recipes: [
      {
        id: "test-recipe",
        buildingId: "test-sawmill",
        inputs: [{ good: "test-wood", perMinute: 2 }],
        outputs: [{ good: "test-plank", perMinute: 1 }],
        sourceId: "test-source",
      },
    ],
    tiers: [
      {
        id: "test-tier",
        name: "Palier de test",
        residentsPerHouse: 10,
        consumptionPerResident: [
          { good: "test-plank", perMinute: 0.01 },
        ],
        sourceId: "test-source",
      },
    ],
  };
}

describe("validateGameCatalog", () => {
  it("accepte un catalogue valide", () => {
    expect(validateGameCatalog(createValidCatalog())).toEqual([]);
  });

  it("rejette les identifiants dupliqués", () => {
    const catalog = createValidCatalog();
    catalog.goods.push({
      id: "test-wood",
      name: "Doublon",
      sourceId: "test-source",
    });

    expect(validateGameCatalog(catalog)).toContainEqual({
      path: "goods[2].id",
      message: "Identifiant dupliqué : test-wood.",
    });
  });

  it("rejette une source inexistante", () => {
    const catalog = createValidCatalog();
    catalog.goods[0]!.sourceId = "unknown-source";

    expect(
      validateGameCatalog(catalog).some(
        (error) => error.path === "goods[0].sourceId",
      ),
    ).toBe(true);
  });

  it("rejette les références vers des biens inexistants", () => {
    const catalog = createValidCatalog();
    catalog.recipes[0]!.outputs[0]!.good = "unknown-good";

    expect(
      validateGameCatalog(catalog).some(
        (error) => error.path === "recipes[0].outputs[0].good",
      ),
    ).toBe(true);
  });

  it("rejette les débits invalides", () => {
    const catalog = createValidCatalog();
    catalog.recipes[0]!.inputs[0]!.perMinute = Number.NaN;

    expect(
      validateGameCatalog(catalog).some(
        (error) => error.path === "recipes[0].inputs[0].perMinute",
      ),
    ).toBe(true);
  });

  it("rejette une date impossible", () => {
    const catalog = createValidCatalog();
    catalog.sources[0]!.accessedAt = "2026-02-30";

    expect(
      validateGameCatalog(catalog).some(
        (error) => error.path === "sources[0].accessedAt",
      ),
    ).toBe(true);
  });

  it("rejette une recette dont le bâtiment n'existe pas", () => {
    const catalog = createValidCatalog();
    catalog.recipes[0]!.buildingId = "unknown-building";

    expect(
      validateGameCatalog(catalog).some(
        (error) => error.path === "recipes[0].buildingId",
      ),
    ).toBe(true);
  });

  it("rejette une population invalide", () => {
    const catalog = createValidCatalog();
    catalog.tiers[0]!.residentsPerHouse = 0;

    expect(
      validateGameCatalog(catalog).some(
        (error) => error.path === "tiers[0].residentsPerHouse",
      ),
    ).toBe(true);
  });
});
