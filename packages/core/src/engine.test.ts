
import { describe, expect, it } from "vitest";
import { computeIsland } from "./engine";
import type { Catalog, IslandInput } from "./types";

// Données fictives : champ → moulin → boulangerie.
const catalog: Catalog = {
  buildings: [
    { id: "farm" },
    { id: "mill" },
    { id: "bakery" },
  ],
  recipes: [
    {
      id: "farm-grain",
      buildingId: "farm",
      inputs: [],
      outputs: [{ good: "grain", perMinute: 1 }],
    },
    {
      id: "mill-flour",
      buildingId: "mill",
      inputs: [{ good: "grain", perMinute: 4 }],
      outputs: [{ good: "flour", perMinute: 2 }],
    },
    {
      id: "bakery-bread",
      buildingId: "bakery",
      inputs: [{ good: "flour", perMinute: 2 }],
      outputs: [{ good: "bread", perMinute: 4 }],
    },
  ],
  tiers: [
    {
      id: "t1",
      residentsPerHouse: 10,
      consumptionPerResident: [{ good: "bread", perMinute: 0.1 }],
    },
  ],
};

const island: IslandInput = {
  name: "Test",
  houses: { t1: 20 },
  built: { farm: 20, mill: 5, bakery: 5 },
  recipeAssignments: {
    "farm-grain": 20,
    "mill-flour": 5,
    "bakery-bread": 5,
  },
};

const findRecipe = (
  report: ReturnType<typeof computeIsland>,
  id: string,
) => report.recipes.find((recipe) => recipe.recipeId === id)!;

const findGood = (
  report: ReturnType<typeof computeIsland>,
  id: string,
) => report.goods.find((good) => good.good === id)!;

describe("computeIsland", () => {
  it("rejette un nom d’île vide ou composé d’espaces", () => {
    for (const name of ["", "   "]) {
      expect(() => computeIsland(catalog, { ...island, name }))
        .toThrow("island.name doit être une chaîne non vide");
    }
  });

  it("calcule la population et les flux des recettes affectées", () => {
    const report = computeIsland(catalog, island);

    expect(report.totalPopulation).toBe(200);
    expect(findRecipe(report, "farm-grain").effectiveOutputs[0]!.perMinute)
      .toBeCloseTo(20);
    expect(findRecipe(report, "mill-flour").effectiveOutputs[0]!.perMinute)
      .toBeCloseTo(10);
    expect(findRecipe(report, "bakery-bread").effectiveOutputs[0]!.perMinute)
      .toBeCloseTo(20);
  });

  it("calcule les bilans des marchandises de la chaîne", () => {
    const report = computeIsland(catalog, island);

    expect(findGood(report, "bread").demandPerMinute).toBeCloseTo(20);
    expect(findGood(report, "bread").allocatedProductionPerMinute).toBeCloseTo(20);
    expect(findGood(report, "bread").deficitPerMinute).toBeCloseTo(0);

    expect(findGood(report, "flour").demandPerMinute).toBeCloseTo(10);
    expect(findGood(report, "flour").allocatedProductionPerMinute).toBeCloseTo(10);

    expect(findGood(report, "grain").demandPerMinute).toBeCloseTo(20);
    expect(findGood(report, "grain").allocatedProductionPerMinute).toBeCloseTo(20);
  });

  it("applique le facteur de productivité aux flux des recettes", () => {
    const report = computeIsland(catalog, {
      ...island,
      productivity: { farm: 2 },
    });

    expect(findRecipe(report, "farm-grain").effectiveOutputs[0]!.perMinute)
      .toBeCloseTo(40);
  });

  it("rejette une productivité nulle, négative ou non finie", () => {
    for (const factor of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() =>
        computeIsland(catalog, {
          ...island,
          productivity: { bakery: factor },
        }),
      ).toThrow();
    }
  });

  it("rejette les nombres de maisons négatifs ou fractionnaires", () => {
    expect(() =>
      computeIsland(catalog, { ...island, houses: { t1: -1 } }),
    ).toThrow();

    expect(() =>
      computeIsland(catalog, { ...island, houses: { t1: 1.5 } }),
    ).toThrow();
  });

  it("rejette les quantités construites négatives ou fractionnaires", () => {
    expect(() =>
      computeIsland(catalog, { ...island, built: { bakery: -1 } }),
    ).toThrow();

    expect(() =>
      computeIsland(catalog, { ...island, built: { bakery: 1.5 } }),
    ).toThrow();
  });

  it("rejette les identifiants inconnus dans les paramètres", () => {
    expect(() =>
      computeIsland(catalog, { ...island, houses: { unknown: 1 } }),
    ).toThrow(/Palier de population inconnu/);

    expect(() =>
      computeIsland(catalog, { ...island, built: { unknown: 1 } }),
    ).toThrow(/Bâtiment construit inconnu/);

    expect(() =>
      computeIsland(catalog, {
        ...island,
        productivity: { unknown: 1 },
      }),
    ).toThrow(/Bâtiment de productivité inconnu/);

    expect(() =>
      computeIsland(catalog, {
        ...island,
        recipeAssignments: { unknown: 1 },
      }),
    ).toThrow(/Recette affectée inconnue/);
  });

  it("rejette une cadence de sortie nulle ou non finie", () => {
    for (const perMinute of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      const invalidCatalog: Catalog = {
        ...catalog,
        recipes: catalog.recipes.map((recipe) =>
          recipe.id === "bakery-bread"
            ? {
                ...recipe,
                outputs: [{ good: "bread", perMinute }],
              }
            : recipe,
        ),
      };

      expect(() => computeIsland(invalidCatalog, island)).toThrow();
    }
  });

  it("rejette les identifiants dupliqués dans le catalogue", () => {
    expect(() =>
      computeIsland(
        {
          ...catalog,
          buildings: [...catalog.buildings, catalog.buildings[0]!],
        },
        island,
      ),
    ).toThrow(/Identifiant de bâtiment dupliqué/);

    expect(() =>
      computeIsland(
        {
          ...catalog,
          recipes: [...catalog.recipes, catalog.recipes[0]!],
        },
        island,
      ),
    ).toThrow(/Identifiant de recette dupliqué/);

    expect(() =>
      computeIsland(
        {
          ...catalog,
          tiers: [...catalog.tiers, catalog.tiers[0]!],
        },
        island,
      ),
    ).toThrow(/Identifiant de palier dupliqué/);
  });

  it("rejette une affectation supérieure au nombre de bâtiments construits", () => {
    expect(() =>
      computeIsland(catalog, {
        ...island,
        built: { farm: 2, mill: 5, bakery: 5 },
      }),
    ).toThrow(/Affectations invalides/);
  });

  it("signale les cycles de production sans inventer de résultat fiable", () => {
    const cyclicCatalog: Catalog = {
      buildings: [{ id: "a" }, { id: "b" }],
      recipes: [
        {
          id: "recipe-a",
          buildingId: "a",
          inputs: [{ good: "b", perMinute: 1 }],
          outputs: [{ good: "a", perMinute: 1 }],
        },
        {
          id: "recipe-b",
          buildingId: "b",
          inputs: [{ good: "a", perMinute: 1 }],
          outputs: [{ good: "b", perMinute: 1 }],
        },
      ],
      tiers: [],
    };

    const report = computeIsland(cyclicCatalog, {
      name: "Test",
      houses: {},
      built: { a: 1, b: 1 },
      recipeAssignments: { "recipe-a": 1, "recipe-b": 1 },
    });

    expect(report.unresolvedAllocations.some((message) =>
      message.includes("Cycle de production"),
    )).toBe(true);
  });

it("ignore les cycles de recettes non affectées à l'île", () => {
  const cyclicCatalog: Catalog = {
    buildings: [{ id: "a" }, { id: "b" }],
    recipes: [
      {
        id: "recipe-a",
        buildingId: "a",
        inputs: [{ good: "b", perMinute: 1 }],
        outputs: [{ good: "a", perMinute: 1 }],
      },
      {
        id: "recipe-b",
        buildingId: "b",
        inputs: [{ good: "a", perMinute: 1 }],
        outputs: [{ good: "b", perMinute: 1 }],
      },
      {
        id: "recipe-c",
        buildingId: "a",
        inputs: [],
        outputs: [{ good: "bread", perMinute: 2 }],
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

  const report = computeIsland(cyclicCatalog, {
    name: "Test",
    houses: { citizens: 2 },
    built: { a: 1, b: 1 },
    recipeAssignments: { "recipe-c": 1 },
  });

  expect(report.unresolvedAllocations).toEqual([]);
  expect(report.goods).toEqual([
    {
      good: "bread",
      demandPerMinute: 2,
      allocatedProductionPerMinute: 2,
      deficitPerMinute: 0,
      surplusPerMinute: 0,
      unresolved: false,
    },
  ]);
});

it("préserve le bilan des marchandises indépendantes d'un cycle actif", () => {
  const catalog: Catalog = {
    buildings: [
      { id: "a" },
      { id: "b" },
      { id: "bakery" },
    ],
    recipes: [
      {
        id: "recipe-a",
        buildingId: "a",
        inputs: [{ good: "b", perMinute: 1 }],
        outputs: [{ good: "a", perMinute: 1 }],
      },
      {
        id: "recipe-b",
        buildingId: "b",
        inputs: [{ good: "a", perMinute: 1 }],
        outputs: [{ good: "b", perMinute: 1 }],
      },
      {
        id: "recipe-bread",
        buildingId: "bakery",
        inputs: [],
        outputs: [{ good: "bread", perMinute: 2 }],
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

  const report = computeIsland(catalog, {
    name: "Test",
    houses: { citizens: 2 },
    built: { a: 1, b: 1, bakery: 1 },
    recipeAssignments: {
      "recipe-a": 1,
      "recipe-b": 1,
      "recipe-bread": 1,
    },
  });

  expect(
    report.unresolvedAllocations.some((message) =>
      message.includes("Cycle de production"),
    ),
  ).toBe(true);

  expect(report.goods).toContainEqual({
    good: "bread",
    demandPerMinute: 2,
    allocatedProductionPerMinute: 2,
    deficitPerMinute: 0,
    surplusPerMinute: 0,
    unresolved: false,
  });
});

it("signale les marchandises dépendantes indirectement d'un cycle actif", () => {
  const catalog: Catalog = {
    buildings: [
      { id: "a" },
      { id: "b" },
      { id: "mill" },
      { id: "bakery" },
    ],
    recipes: [
      {
        id: "recipe-a",
        buildingId: "a",
        inputs: [{ good: "b", perMinute: 1 }],
        outputs: [{ good: "a", perMinute: 1 }],
      },
      {
        id: "recipe-b",
        buildingId: "b",
        inputs: [{ good: "a", perMinute: 1 }],
        outputs: [{ good: "b", perMinute: 1 }],
      },
      {
        id: "recipe-flour",
        buildingId: "mill",
        inputs: [{ good: "a", perMinute: 1 }],
        outputs: [{ good: "flour", perMinute: 1 }],
      },
      {
        id: "recipe-bread",
        buildingId: "bakery",
        inputs: [],
        outputs: [{ good: "bread", perMinute: 2 }],
      },
    ],
    tiers: [],
  };

  const report = computeIsland(catalog, {
    name: "Test",
    houses: {},
    built: { a: 1, b: 1, mill: 1, bakery: 1 },
    recipeAssignments: {
      "recipe-a": 1,
      "recipe-b": 1,
      "recipe-flour": 1,
      "recipe-bread": 1,
    },
  });

  expect(
    report.goods.find((good) => good.good === "flour")?.unresolved,
  ).toBe(true);

  expect(
    report.goods.find((good) => good.good === "bread")?.unresolved,
  ).toBe(false);
});

it("additionne les productions de plusieurs recettes sans signaler une ambiguïté globale", () => {
  const multipleProducers: Catalog = {
    buildings: [...catalog.buildings, { id: "second-farm" }],
    recipes: [
      ...catalog.recipes,
      {
        id: "second-farm-grain",
        buildingId: "second-farm",
        inputs: [],
        outputs: [{ good: "grain", perMinute: 1 }],
      },
    ],
    tiers: catalog.tiers,
  };

  const report = computeIsland(multipleProducers, {
    ...island,
    built: { ...island.built, "second-farm": 1 },
    recipeAssignments: {
      ...island.recipeAssignments,
      "second-farm-grain": 1,
    },
  });

  const grain = findGood(report, "grain");
  expect(grain.demandPerMinute).toBe(20);
  expect(grain.allocatedProductionPerMinute).toBe(21);
  expect(grain.deficitPerMinute).toBe(0);
  expect(grain.surplusPerMinute).toBe(1);
  expect(grain.unresolved).toBe(false);
  expect(report.unresolvedAllocations).not.toContain(
    "La couverture de « grain » ne peut pas être déterminée sans résoudre les allocations de production",
  );
});

  it("accepte un intrant sans producteur local", () => {
    const externalCatalog: Catalog = {
      buildings: [{ id: "bakery" }],
      recipes: [
        {
          id: "bakery-bread",
          buildingId: "bakery",
          inputs: [{ good: "imported_flour", perMinute: 2 }],
          outputs: [{ good: "bread", perMinute: 4 }],
        },
      ],
      tiers: catalog.tiers,
    };

    const report = computeIsland(externalCatalog, {
      name: "Test",
      houses: { t1: 20 },
      built: { bakery: 5 },
      recipeAssignments: { "bakery-bread": 5 },
    });

    expect(findGood(report, "bread").deficitPerMinute).toBeCloseTo(0);
    expect(findGood(report, "imported_flour").deficitPerMinute).toBeCloseTo(10);
  });

  it("rejette un dépassement numérique dans les flux calculés", () => {
    const overflowCatalog: Catalog = {
      buildings: [{ id: "lumberjack" }],
      recipes: [
        {
          id: "wood",
          buildingId: "lumberjack",
          inputs: [],
          outputs: [{ good: "wood", perMinute: 2 }],
        },
      ],
      tiers: [],
    };

    expect(() =>
      computeIsland(overflowCatalog, {
        name: "Test",
        houses: {},
        built: { lumberjack: 1 },
        recipeAssignments: { wood: 1 },
        productivity: { lumberjack: Number.MAX_VALUE },
      }),
    ).toThrow();
  });

  it("rejette un dépassement numérique dans les flux effectifs", () => {
  const catalog: Catalog = {
    buildings: [{ id: "bakery" }],
    recipes: [
      {
        id: "baking",
        buildingId: "bakery",
        inputs: [],
        outputs: [{ good: "bread", perMinute: 1e308 }],
      },
    ],
    tiers: [],
  };

  expect(() =>
    computeIsland(catalog, {
      name: "Test",
      houses: {},
      built: { bakery: 2 },
      recipeAssignments: { baking: 2 },
    }),
  ).toThrow(/limites numériques|dépassement|flux/i);
});

it("ignore une recette inactive même si sa productivité provoque un dépassement", () => {
  const catalog: Catalog = {
    buildings: [{ id: "bakery" }],
    recipes: [
      {
        id: "inactive-baking",
        buildingId: "bakery",
        inputs: [],
        outputs: [{ good: "bread", perMinute: 2 }],
      },
    ],
    tiers: [],
  };

  expect(() =>
    computeIsland(catalog, {
      name: "Test",
      houses: {},
      built: { bakery: 1 },
      recipeAssignments: {},
      productivity: { bakery: Number.MAX_VALUE },
    }),
  ).not.toThrow();
});

});
