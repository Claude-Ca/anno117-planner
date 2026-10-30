import { describe, expect, it } from "vitest";
import { validateModularCatalog } from "./catalog-validation";
import type { ModularGameCatalog } from "./catalog-types";

const moduleNames = ["resources", "buildings", "production", "population", "regions", "islandAvailability", "evidence"] as const;
function fixture(): ModularGameCatalog {
  return {
    manifest: {
      id: "anno117-base", catalogVersion: "0.0.1", schemaVersion: "1",
      gameVersion: "à relever", scope: { edition: "base-game", regions: ["latium", "albion"] },
      modules: [...moduleNames],
    },
    modules: {
      resources: [{ id: "wood", name: "Bois", category: "raw", status: "verified", evidenceIds: ["obs-wood"] }],
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
    const c = fixture();
    c.modules.resources.push({ id: "planks", name: "Planches", category: "intermediate", status: "verified", evidenceIds: ["obs-wood"] });
    expect(validateModularCatalog(c)).toEqual([]);
  });
  it("reports unknown cross-module references", () => {
    const c = fixture();
    c.modules.production[0]!.inputs[0]!.good = "missing";
    expect(validateModularCatalog(c).some((d) => d.code === "RESOURCE_UNKNOWN")).toBe(true);
  });
  it("requires evidence and disallows external-source-only provenance", () => {
    const c = fixture();
    c.modules.resources[0]!.evidenceIds = [];
    expect(validateModularCatalog(c).some((d) => d.code === "EVIDENCE_REQUIRED")).toBe(true);
  });
  it("requires derived records to identify their evidence dependencies", () => {
    const c = fixture();
    c.modules.evidence[0]!.method = "derived";
    expect(validateModularCatalog(c).some((d) => d.code === "DERIVATION_UNGROUNDED")).toBe(true);
  });
});
