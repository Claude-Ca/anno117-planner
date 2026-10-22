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
});