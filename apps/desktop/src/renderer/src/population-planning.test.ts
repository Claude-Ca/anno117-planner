import { describe, expect, it } from "vitest";
import { createPopulationIslandInput } from "./population-planning";

const tiers = [{ id: "latins" }, { id: "equites" }];

describe("createPopulationIslandInput", () => {
  it("creates one non-negative house count for each population tier", () => {
    expect(createPopulationIslandInput("  Alba  ", tiers, { latins: "12" })).toEqual({
      name: "Alba",
      houses: { latins: 12, equites: 0 },
      built: {},
    });
  });

  it("rejects an empty island name", () => {
    expect(() => createPopulationIslandInput("   ", tiers, {}))
      .toThrow("Le nom de l'île est obligatoire.");
  });

  it.each(["-1", "1.5", "NaN", "Infinity", "9007199254740992"])(
    "rejects an invalid house count: %s",
    (value) => {
      expect(() => createPopulationIslandInput("Alba", tiers, { latins: value }))
        .toThrow("doit être un entier positif ou nul");
    },
  );

  it("rejects duplicate or empty tier identifiers", () => {
    expect(() => createPopulationIslandInput("Alba", [{ id: "latins" }, { id: "latins" }], {}))
      .toThrow("Identifiant de palier dupliqué");
    expect(() => createPopulationIslandInput("Alba", [{ id: " " }], {}))
      .toThrow("identifiant valide");
  });
});
