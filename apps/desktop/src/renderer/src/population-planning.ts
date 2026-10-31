import type { IslandInput, PopulationNeedCategory } from "@anno117/core";

export interface PopulationNeedOption {
  id: string;
  category: PopulationNeedCategory;
  goodId: string;
  choiceGroupId?: string;
  unlockAtHouses?: number;
  consumptionPerHousePerMinute?: number;
  buildingIds?: string[];
}
export interface PopulationTierInput {
  id: string;
  needs?: PopulationNeedOption[];
}
export interface TheoreticalNeedRow {
  tierId: string;
  groupId: string;
  category: PopulationNeedCategory;
  selectedNeedId: string | null;
  options: PopulationNeedOption[];
  houses: number;
  unlocked: boolean;
  requiredPerMinute: number | null;
}

/** Converts editable house counts into the core input; selected needs are explicit. */
export function createPopulationIslandInput(
  islandName: string,
  tiers: readonly PopulationTierInput[],
  houseCounts: Readonly<Record<string, string>>,
  selectedNeeds: Readonly<Record<string, string>> = {},
): IslandInput {
  const name = islandName.trim();
  if (!name) throw new TypeError("Le nom de l'île est obligatoire.");

  const houses: Record<string, number> = {};
  const fulfilledNeeds: Record<string, string[]> = {};
  for (const tier of tiers) {
    if (!tier.id.trim()) throw new TypeError("Chaque palier doit posséder un identifiant valide.");
    if (Object.hasOwn(houses, tier.id)) throw new Error(`Identifiant de palier dupliqué : « ${tier.id} »`);
    const rawCount = houseCounts[tier.id] ?? "";
    const count = rawCount.trim() === "" ? 0 : Number(rawCount);
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError(`Le nombre de maisons pour le palier « ${tier.id} » doit être un entier positif ou nul.`);
    }
    houses[tier.id] = count;
    fulfilledNeeds[tier.id] = (tier.needs ?? [])
      .filter((need) => selectedNeeds[need.choiceGroupId ?? need.id] === need.id)
      .map((need) => need.id);
  }
  return { name, houses, built: {}, fulfilledNeeds };
}

/** Live theoretical view: unknown rates stay null rather than being guessed. */
export function calculateTheoreticalNeeds(
  tiers: readonly PopulationTierInput[],
  houseCounts: Readonly<Record<string, string>>,
  selectedNeeds: Readonly<Record<string, string>>,
): TheoreticalNeedRow[] {
  return tiers.flatMap((tier) => {
    const raw = houseCounts[tier.id] ?? "0";
    const houses = raw.trim() === "" ? 0 : Number(raw);
    const groups = new Map<string, PopulationNeedOption[]>();
    for (const need of tier.needs ?? []) {
      const groupId = need.choiceGroupId ?? need.id;
      groups.set(groupId, [...(groups.get(groupId) ?? []), need]);
    }
    return [...groups.entries()].map(([groupId, options]) => {
      const selectedNeedId = selectedNeeds[groupId] ?? null;
      const selected = options.find((option) => option.id === selectedNeedId);
      const unlocked = houses > 0 && options.some((option) =>
        option.unlockAtHouses === undefined || houses >= option.unlockAtHouses);
      const available = selected && (selected.unlockAtHouses === undefined || houses >= selected.unlockAtHouses)
        ? selected : undefined;
      return {
        tierId: tier.id, groupId, category: options[0]!.category, selectedNeedId,
        options, houses, unlocked,
        requiredPerMinute: available?.consumptionPerHousePerMinute === undefined
          ? null : houses * available.consumptionPerHousePerMinute,
      };
    });
  });
}
