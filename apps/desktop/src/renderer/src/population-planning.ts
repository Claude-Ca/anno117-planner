import type { IslandInput } from "@anno117/core";

export interface PopulationTierInput {
  id: string;
}

export function createPopulationIslandInput(
  islandName: string,
  tiers: readonly PopulationTierInput[],
  houseCounts: Readonly<Record<string, string>>,
): IslandInput {
  const name = islandName.trim();
  if (!name) {
    throw new TypeError("Le nom de l'île est obligatoire.");
  }

  const houses: Record<string, number> = {};
  for (const tier of tiers) {
    if (!tier.id.trim()) {
      throw new TypeError("Chaque palier doit posséder un identifiant valide.");
    }
    if (Object.hasOwn(houses, tier.id)) {
      throw new Error(`Identifiant de palier dupliqué : « ${tier.id} »`);
    }

    const rawCount = houseCounts[tier.id] ?? "";
    const count = rawCount.trim() === "" ? 0 : Number(rawCount);
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError(
        `Le nombre de maisons pour le palier « ${tier.id} » doit être un entier positif ou nul.`,
      );
    }
    houses[tier.id] = count;
  }

  return { name, houses, built: {} };
}
