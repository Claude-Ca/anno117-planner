import { describe, expect, it } from "vitest";
import { validateModularCatalog } from "./catalog-validation";
import type { ModularGameCatalog } from "./catalog-types";

const moduleNames = ["resources", "buildings", "production", "population", "regions", "islandAvailability", "evidence"] as const;
function fixture(): ModularGameCatalog {
  return {
    manifest: {
      id: "anno117-base", catalogVersion: "0.0.1", schemaVersion: "1",
      gameVersion: "à relever", scope: { edition: "base-game", regions: ["latium"] },
      modules: [...moduleNames],
    },
    modules: {
      resources: [
        { id: "wood", name: "Bois", category: "raw", status: "verified", evidenceIds: ["obs-wood"] },
        { id: "planks", name: "Planches", category: "intermediate", status: "verified", evidenceIds: ["obs-wood"] },
      ],
      buildings: [{ id: "sawmill", name: "Scierie", regionId: "latium", recipeIds: ["planks"], status: "verified", evidenceIds: ["obs-wood"] }],
      production: [{ id: "planks", name: "Planches", buildingId: "sawmill", inputs: [{ good: "wood", perMinute: 2 }], outputs: [{ good: "planks", perMinute: 1 }], status: "verified", evidenceIds: ["obs-wood"] }],
      population: [],
      regions: [{ id: "latium", name: "Latium", status: "verified", evidenceIds: ["obs-wood"] }],
      islandAvailability: [],
      evidence: [{ id: "obs-wood", method: "observation", observedAt: "2026-10-30", gameVersion: "à relever", notes: "Fixture synthétique de test." }],
    },
  };
}

describe("validateModularCatalog", () => {
  it("accepts a coherent modular catalog", () => {
    expect(validateModularCatalog(fixture())).toEqual([]);
  });
  it("reports unknown cross-module references", () => {
    const c = fixture();
    c.modules.production[0]!.inputs[0]!.good = "missing";
    expect(validateModularCatalog(c).some((d) => d.code === "RESOURCE_UNKNOWN")).toBe(true);
  });
  it("requires evidence for observed records", () => {
    const c = fixture();
    c.modules.resources[0]!.evidenceIds = [];
    expect(validateModularCatalog(c).some((d) => d.code === "EVIDENCE_REQUIRED")).toBe(true);
  });
  it("allows candidate records without evidence", () => {
    const c = fixture();
    c.modules.resources[0]!.status = "candidate";
    c.modules.resources[0]!.evidenceIds = [];
    expect(validateModularCatalog(c)).toEqual([]);
  });
  it("allows to-observe candidates without evidence", () => {
    const c = fixture();
    c.modules.resources[0]!.status = "to-observe";
    c.modules.resources[0]!.evidenceIds = [];
    expect(validateModularCatalog(c)).toEqual([]);
  });
  it("requires derived records to identify their evidence dependencies", () => {
    const c = fixture();
    c.modules.evidence[0]!.method = "derived";
    expect(validateModularCatalog(c).some((d) => d.code === "DERIVATION_UNGROUNDED")).toBe(true);
  });
  it("accepts residence-level need effects and an optional consumption rate", () => {
    const c = fixture();
    c.modules.population.push({
      id: "liberti", name: "Liberti", residentsPerHouse: 10,
      consumptionPerResident: [], status: "to-observe", evidenceIds: [],
      needs: [{
        id: "sardines", category: "food", goodId: "wood",
        effects: { population: 1, income: 1 },
      }],
    });
    expect(validateModularCatalog(c)).toEqual([]);
  });
  it("rejects an invalid residence-level consumption modifier", () => {
    const c = fixture();
    c.modules.population.push({
      id: "liberti", name: "Liberti", residentsPerHouse: 10,
      consumptionPerResident: [], status: "to-observe", evidenceIds: [],
      needs: [{
        id: "sardines", category: "food", goodId: "wood",
        consumptionModifier: 0,
      }],
    });
    expect(validateModularCatalog(c).some((d) => d.code === "NEED_MODIFIER_INVALID")).toBe(true);
  });
  it("rejects unknown resources referenced by population needs", () => {
    const c = fixture();
    c.modules.population.push({
      id: "liberti", name: "Liberti", residentsPerHouse: 10,
      consumptionPerResident: [], status: "to-observe", evidenceIds: [],
      needs: [{ id: "sardines", category: "food", goodId: "missing" }],
    });
    expect(validateModularCatalog(c).some((d) => d.code === "RESOURCE_UNKNOWN")).toBe(true);
  });
  it("rejects a date that is syntactically valid but impossible", () => {
    const c = fixture();
    c.modules.evidence[0]!.observedAt = "2026-02-30";
    expect(validateModularCatalog(c).some((d) => d.code === "DATE_INVALID")).toBe(true);
  });
  it("rejects non-positive need consumption rates and non-finite effects", () => {
    const c = fixture();
    c.modules.population.push({
      id: "liberti", name: "Liberti", residentsPerHouse: 10,
      consumptionPerResident: [], status: "to-observe", evidenceIds: [],
      needs: [{ id: "sardines", category: "food", goodId: "wood",
        consumptionPerHousePerMinute: 0, effects: { population: Number.NaN } }],
    });
    const diagnostics = validateModularCatalog(c);
    expect(diagnostics.some((d) => d.code === "NEED_RATE_INVALID")).toBe(true);
    expect(diagnostics.some((d) => d.code === "NEED_EFFECT_INVALID")).toBe(true);
  });

});
