import { describe, expect, it } from "vitest";
import { calculateTheoreticalNeeds, createPopulationIslandInput } from "./population-planning";

const tiers = [{ id: "latins" }, { id: "equites" }];
const needsTiers = [{
  id: "latins",
  needs: [
    { id: "sardines", category: "food" as const, goodId: "sardines", choiceGroupId: "food", consumptionPerHousePerMinute: 0.5 },
    { id: "porridge", category: "food" as const, goodId: "porridge", choiceGroupId: "food" },
  ],
}];

describe("createPopulationIslandInput", () => {
  it("creates one non-negative house count for each population tier", () => {
    expect(createPopulationIslandInput("  Alba  ", tiers, { latins: "12" })).toEqual({
      name: "Alba", houses: { latins: 12, equites: 0 }, built: {},
      fulfilledNeeds: { latins: [], equites: [] },
    });
  });

  it("passes the selected option as a fulfilled need", () => {
    expect(createPopulationIslandInput("Alba", needsTiers, { latins: "4" }, { "latins:food": "sardines" }))
      .toMatchObject({ fulfilledNeeds: { latins: ["sardines"] } });
  });

  it("rejects an empty island name", () => {
    expect(() => createPopulationIslandInput("   ", tiers, {})).toThrow("Le nom de l'île est obligatoire.");
  });

  it.each(["-1", "1.5", "NaN", "Infinity", "9007199254740992"])(
    "rejects an invalid house count: %s",
    (value) => expect(() => createPopulationIslandInput("Alba", tiers, { latins: value }))
      .toThrow("doit être un entier positif ou nul"),
  );

  it("rejects duplicate or empty tier identifiers", () => {
    expect(() => createPopulationIslandInput("Alba", [{ id: "latins" }, { id: "latins" }], {}))
      .toThrow("Identifiant de palier dupliqué");
    expect(() => createPopulationIslandInput("Alba", [{ id: " " }], {})).toThrow("identifiant valide");
  });
});

describe("calculateTheoreticalNeeds", () => {
  it("computes a per-minute quantity from house count when a validated rate exists", () => {
    const rows = calculateTheoreticalNeeds(needsTiers, { latins: "4" }, { "latins:food": "sardines" });
    expect(rows[0]).toMatchObject({ houses: 4, selectedNeedId: "sardines", requiredPerMinute: 2 });
  });

  it("keeps the quantity unknown when the per-house rate has not been measured", () => {
    const rows = calculateTheoreticalNeeds(needsTiers, { latins: "4" }, { "latins:food": "porridge" });
    expect(rows[0]).toMatchObject({ selectedNeedId: "porridge", requiredPerMinute: null });
  });

  it("does not expose a need option before its house threshold", () => {
    const rows = calculateTheoreticalNeeds([{
      id: "latins", needs: [{ id: "sardines", category: "food", goodId: "sardines", unlockAtHouses: 4 }],
    }], { latins: "3" }, { "latins:sardines": "sardines" });
    expect(rows[0]).toMatchObject({ unlocked: false, requiredPerMinute: null });
  });
});
