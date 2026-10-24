import { describe, expect, it } from "vitest";
import { computeIsland } from "./engine";
import type { Catalog, IslandInput } from "./types";

// Données de test fictives : champ → moulin → boulangerie
const catalog: Catalog = {
  buildings: [
    { id: "farm", output: { good: "grain", perMinute: 1 }, inputs: [] },
    {
      id: "mill",
      output: { good: "flour", perMinute: 2 },
      inputs: [{ good: "grain", perMinute: 4 }],
    },
    {
      id: "bakery",
      output: { good: "bread", perMinute: 4 },
      inputs: [{ good: "flour", perMinute: 2 }],
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
  houses: { t1: 20 }, // 200 habitants → 20 pains/min
  built: { bakery: 4 },
};

const find = (report: ReturnType<typeof computeIsland>, id: string) =>
  report.buildings.find((b) => b.buildingId === id)!;

describe("computeIsland", () => {
  it("remonte la demande à travers toute la chaîne", () => {
    const report = computeIsland(catalog, island);
    expect(report.totalPopulation).toBe(200);
    expect(find(report, "bakery").required).toBeCloseTo(5); // 20 / 4
    expect(find(report, "mill").required).toBeCloseTo(5); // 10 farine / 2
    expect(find(report, "farm").required).toBeCloseTo(20); // 20 grain / 1
  });

  it("calcule le déficit par rapport aux bâtiments construits", () => {
    const report = computeIsland(catalog, island);
    expect(find(report, "bakery").delta).toBeCloseTo(1); // 5 requis - 4 construits
  });

  it("réduit le nombre de bâtiments requis avec la productivité", () => {
    const report = computeIsland(catalog, { ...island, productivity: { farm: 2 } });
    expect(find(report, "farm").required).toBeCloseTo(10);
    expect(find(report, "mill").required).toBeCloseTo(5); // inchangé
  });

  it("rejette une productivité nulle, négative ou non finie", () => {
    for (const factor of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() =>
        computeIsland(catalog, { ...island, productivity: { bakery: factor } }),
      ).toThrow();
    }
  });

  it("rejette les nombres de maisons négatifs ou fractionnaires", () => {
    expect(() => computeIsland(catalog, { ...island, houses: { t1: -1 } })).toThrow();
    expect(() => computeIsland(catalog, { ...island, houses: { t1: 1.5 } })).toThrow();
  });

  it("rejette les quantités de bâtiments construits négatives ou fractionnaires", () => {
    expect(() => computeIsland(catalog, { ...island, built: { bakery: -1 } })).toThrow();
    expect(() => computeIsland(catalog, { ...island, built: { bakery: 1.5 } })).toThrow();
  });

  it("rejette les identifiants de paliers et de bâtiments inconnus dans les paramètres", () => {
    expect(() => computeIsland(catalog, { ...island, houses: { unknown: 1 } })).toThrow(/Palier de population inconnu/);
    expect(() => computeIsland(catalog, { ...island, built: { unknown: 1 } })).toThrow(/Bâtiment construit inconnu/);
    expect(() => computeIsland(catalog, { ...island, productivity: { unknown: 1 } })).toThrow(/Bâtiment de productivité inconnu/);
  });

  it("rejette une cadence de sortie nulle ou non finie dans le catalogue", () => {
    for (const perMinute of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      const invalidCatalog: Catalog = {
        ...catalog,
        buildings: catalog.buildings.map((building) =>
          building.id === "bakery"
            ? { ...building, output: { ...building.output, perMinute } }
            : building,
        ),
      };
      expect(() => computeIsland(invalidCatalog, island)).toThrow();
    }
  });

  it("rejette les identifiants dupliqués dans le catalogue", () => {
    const duplicateBuilding: Catalog = {
      ...catalog,
      buildings: [...catalog.buildings, catalog.buildings[0]!],
    };
    expect(() => computeIsland(duplicateBuilding, island)).toThrow(/Identifiant de bâtiment dupliqué/);

    const duplicateTier: Catalog = {
      ...catalog,
      tiers: [...catalog.tiers, catalog.tiers[0]!],
    };
    expect(() => computeIsland(duplicateTier, island)).toThrow(/Identifiant de palier dupliqué/);
  });

  it("détecte les cycles de production", () => {
    const cyclicCatalog: Catalog = {
      buildings: [
        { id: "a", output: { good: "a", perMinute: 1 }, inputs: [{ good: "b", perMinute: 1 }] },
        { id: "b", output: { good: "b", perMinute: 1 }, inputs: [{ good: "a", perMinute: 1 }] },
      ],
      tiers: [],
    };
    expect(() => computeIsland(cyclicCatalog, { name: "Test", houses: {}, built: {} })).toThrow(/Cycle de production/);
  });

  it("rejette plusieurs producteurs pour un même bien tant que cette règle reste en vigueur", () => {
    const multipleProducers: Catalog = {
      ...catalog,
      buildings: [...catalog.buildings, { id: "second-farm", output: { good: "grain", perMinute: 1 }, inputs: [] }],
    };
    expect(() => computeIsland(multipleProducers, island)).toThrow(/Plusieurs bâtiments produisent/);
  });

  it("accepte un intrant sans producteur sans propager de demande amont", () => {
    const catalogWithExternalInput: Catalog = {
      buildings: [
        {
          id: "bakery",
          output: { good: "bread", perMinute: 4 },
          inputs: [{ good: "imported_flour", perMinute: 2 }],
        },
      ],
      tiers: catalog.tiers,
    };
    const report = computeIsland(catalogWithExternalInput, island);
    expect(find(report, "bakery").required).toBeCloseTo(5);
  });

 it("rejects an overflowing effective production rate", () => {
  const catalog: Catalog = {
    buildings: [
      {
        id: "lumberjack",
        output: { good: "wood", perMinute: 2 },
        inputs: [],
      },
    ],
    tiers: [],
  };

  const island: IslandInput = {
    name: "Test island",
    houses: {},
    built: { lumberjack: 0 },
    productivity: { lumberjack: Number.MAX_VALUE },
  };

  expect(() => computeIsland(catalog, island)).toThrow(
    "Capacité de production invalide",
  );
});

});
