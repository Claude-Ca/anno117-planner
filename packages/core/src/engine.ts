
import type {
  BuildingId,
  Catalog,
  Flow,
  GoodBalance,
  GoodId,
  IslandInput,
  IslandReport,
  Recipe,
  RecipeReport,
  RecipeId,
} from "./types";

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${label} doit être une chaîne non vide`);
  }
}

function assertFiniteNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${label} doit être un nombre fini`);
  }
}

function assertNonNegativeNumber(value: unknown, label: string): asserts value is number {
  assertFiniteNumber(value, label);
  if (value < 0) throw new RangeError(`${label} doit être supérieur ou égal à 0`);
}

function assertPositiveNumber(value: unknown, label: string): asserts value is number {
  assertFiniteNumber(value, label);
  if (value <= 0) throw new RangeError(`${label} doit être strictement positif`);
}

function addTo(map: Map<GoodId, number>, good: GoodId, amount: number): void {
  const next = (map.get(good) ?? 0) + amount;
  if (!Number.isFinite(next)) {
    throw new RangeError(`Le calcul du flux pour « ${good} » dépasse les limites numériques`);
  }
  map.set(good, next);
}

function validateFlow(flow: Flow, label: string): void {
  if (flow === null || typeof flow !== "object") {
    throw new TypeError(`${label} doit être un flux valide`);
  }
  assertNonEmptyString(flow.good, `${label}.good`);
  assertNonNegativeNumber(flow.perMinute, `${label}.perMinute`);
}

function validateCatalog(catalog: Catalog): void {
  if (catalog === null || typeof catalog !== "object") {
    throw new TypeError("Le catalogue doit être un objet valide");
  }
  if (
    !Array.isArray(catalog.buildings) ||
    !Array.isArray(catalog.recipes) ||
    !Array.isArray(catalog.tiers)
  ) {
    throw new TypeError("Le catalogue doit contenir buildings, recipes et tiers sous forme de tableaux");
  }

  const buildingIds = new Set<BuildingId>();
  for (const building of catalog.buildings) {
    if (building === null || typeof building !== "object") {
      throw new TypeError("Chaque bâtiment doit être un objet valide");
    }
    assertNonEmptyString(building.id, "building.id");
    if (buildingIds.has(building.id)) {
      throw new Error(`Identifiant de bâtiment dupliqué : « ${building.id} »`);
    }
    buildingIds.add(building.id);
  }

  const recipeIds = new Set<RecipeId>();
  for (const recipe of catalog.recipes) {
    if (recipe === null || typeof recipe !== "object") {
      throw new TypeError("Chaque recette doit être un objet valide");
    }
    assertNonEmptyString(recipe.id, "recipe.id");
    if (recipeIds.has(recipe.id)) {
      throw new Error(`Identifiant de recette dupliqué : « ${recipe.id} »`);
    }
    recipeIds.add(recipe.id);

    assertNonEmptyString(recipe.buildingId, `recipe « ${recipe.id} ».buildingId`);
    if (!buildingIds.has(recipe.buildingId)) {
      throw new Error(`Bâtiment inconnu pour la recette « ${recipe.id} » : « ${recipe.buildingId} »`);
    }
    if (!Array.isArray(recipe.inputs) || !Array.isArray(recipe.outputs)) {
      throw new TypeError(`Les intrants et sorties de « ${recipe.id} » doivent être des tableaux`);
    }
    if (recipe.inputs.length === 0 && recipe.outputs.length === 0) {
      throw new Error(`La recette « ${recipe.id} » ne possède ni intrant ni sortie`);
    }
    recipe.inputs.forEach((flow, i) => validateFlow(flow, `recipe « ${recipe.id} ».inputs[${i}]`));
    recipe.outputs.forEach((flow, i) => validateFlow(flow, `recipe « ${recipe.id} ».outputs[${i}]`));

    for (const output of recipe.outputs) {
      assertPositiveNumber(output.perMinute, `Sortie de « ${recipe.id} » pour « ${output.good} »`);
    }
  }

  const tierIds = new Set<string>();
  for (const tier of catalog.tiers) {
    if (tier === null || typeof tier !== "object") {
      throw new TypeError("Chaque palier de population doit être un objet valide");
    }
    assertNonEmptyString(tier.id, "tier.id");
    if (tierIds.has(tier.id)) {
      throw new Error(`Identifiant de palier dupliqué : « ${tier.id} »`);
    }
    tierIds.add(tier.id);
    assertNonNegativeNumber(tier.residentsPerHouse, `Population par maison pour « ${tier.id} »`);
    if (!Array.isArray(tier.consumptionPerResident)) {
      throw new TypeError(`La consommation du palier « ${tier.id} » doit être un tableau`);
    }
    tier.consumptionPerResident.forEach((flow, i) =>
      validateFlow(flow, `tier « ${tier.id} ».consumptionPerResident[${i}]`),
    );
    const needIds = new Set<string>();
    for (const need of tier.needs ?? []) {
      assertNonEmptyString(need.id, `need.id pour « ${tier.id} »`);
      if (needIds.has(need.id)) throw new Error(`Besoin dupliqué pour « ${tier.id} » : « ${need.id} »`);
      needIds.add(need.id);
      assertNonEmptyString(need.goodId, `need.goodId pour « ${need.id} »`);
      if (need.consumptionPerHousePerMinute !== undefined) {
        assertPositiveNumber(need.consumptionPerHousePerMinute, `Consommation par maison pour « ${need.id} »`);
      }
      if (need.consumptionModifier !== undefined) {
        assertPositiveNumber(need.consumptionModifier, `Modificateur de consommation pour « ${need.id} »`);
      }
      for (const value of [need.effects?.population, need.effects?.income]) {
        if (value !== undefined) assertFiniteNumber(value, `Effet du besoin « ${need.id} »`);
      }
    }
  }
}

function validateIsland(catalog: Catalog, island: IslandInput): void {
  if (island === null || typeof island !== "object") {
    throw new TypeError("Les paramètres de l'île doivent être un objet valide");
  }
  assertNonEmptyString(island.name, "island.name");

  for (const [field, value] of [
    ["houses", island.houses],
    ["built", island.built],
  ] as const) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new TypeError(`${field} doit être un objet valide`);
    }
  }

  for (const [field, value] of [
    ["productivity", island.productivity],
    ["recipeAssignments", island.recipeAssignments],
    ["fulfilledNeeds", island.fulfilledNeeds],
  ] as const) {
    if (value !== undefined && (value === null || typeof value !== "object" || Array.isArray(value))) {
      throw new TypeError(`${field} doit être un objet valide`);
    }
  }

  const tierIds = new Set(catalog.tiers.map((tier) => tier.id));
  for (const [id, count] of Object.entries(island.houses)) {
    if (!tierIds.has(id)) throw new Error(`Palier de population inconnu : « ${id} »`);
    assertNonNegativeNumber(count, `Nombre de maisons pour « ${id} »`);
    if (!Number.isSafeInteger(count)) throw new RangeError(`Le nombre de maisons pour « ${id} » doit être un entier`);
  }

  for (const [tierId, needIds] of Object.entries(island.fulfilledNeeds ?? {})) {
    const tier = catalog.tiers.find((item) => item.id === tierId);
    if (!tier) throw new Error(`Palier de population inconnu pour les besoins satisfaits : « ${tierId} »`);
    if (!Array.isArray(needIds)) throw new TypeError(`Les besoins satisfaits de « ${tierId} » doivent être un tableau`);
    const knownNeeds = new Set((tier.needs ?? []).map((need) => need.id));
    const seen = new Set<string>();
    for (const needId of needIds) {
      assertNonEmptyString(needId, `Besoin satisfait de « ${tierId} »`);
      if (!knownNeeds.has(needId)) throw new Error(`Besoin inconnu pour « ${tierId} » : « ${needId} »`);
      if (seen.has(needId)) throw new Error(`Besoin satisfait dupliqué pour « ${tierId} » : « ${needId} »`);
      seen.add(needId);
    }
  }

  const buildingIds = new Set(catalog.buildings.map((building) => building.id));
  for (const [id, count] of Object.entries(island.built)) {
    if (!buildingIds.has(id)) throw new Error(`Bâtiment construit inconnu : « ${id} »`);
    assertNonNegativeNumber(count, `Nombre de bâtiments construits pour « ${id} »`);
    if (!Number.isSafeInteger(count)) throw new RangeError(`Le nombre de bâtiments construits pour « ${id} » doit être un entier`);
  }

  for (const [id, factor] of Object.entries(island.productivity ?? {})) {
    if (!buildingIds.has(id)) throw new Error(`Bâtiment de productivité inconnu : « ${id} »`);
    assertPositiveNumber(factor, `Facteur de productivité pour « ${id} »`);
  }

  const recipes = new Map(catalog.recipes.map((recipe) => [recipe.id, recipe]));
  const assignedByBuilding = new Map<BuildingId, number>();

  for (const [recipeId, count] of Object.entries(island.recipeAssignments ?? {})) {
    const recipe = recipes.get(recipeId);
    if (!recipe) throw new Error(`Recette affectée inconnue : « ${recipeId} »`);
    assertNonNegativeNumber(count, `Nombre de bâtiments affectés à « ${recipeId} »`);
    if (!Number.isSafeInteger(count)) {
      throw new RangeError(`Le nombre de bâtiments affectés à « ${recipeId} » doit être un entier`);
    }
    assignedByBuilding.set(recipe.buildingId, (assignedByBuilding.get(recipe.buildingId) ?? 0) + count);
  }

  for (const [buildingId, assigned] of assignedByBuilding) {
    if (assigned > (island.built[buildingId] ?? 0)) {
      throw new Error(
        `Affectations invalides pour « ${buildingId} » : ${assigned} affectés, ${island.built[buildingId] ?? 0} construits`,
      );
    }
  }
}

function getRecipeFlows(recipe: Recipe, productivity: number): RecipeReport {
  return {
    recipeId: recipe.id,
    buildingId: recipe.buildingId,
    assignedBuildings: 0,
    effectiveOutputs: recipe.outputs.map((flow) => ({
      good: flow.good,
      perMinute: flow.perMinute * productivity,
    })),
    effectiveInputs: recipe.inputs.map((flow) => ({
      good: flow.good,
      perMinute: flow.perMinute * productivity,
    })),
  };
}

function detectCycles(recipes: Recipe[]): {
  messages: string[];
  affectedGoods: Set<GoodId>;
} {
  const producers = new Map<GoodId, Recipe[]>();

  for (const recipe of recipes) {
    for (const output of recipe.outputs) {
      const list = producers.get(output.good) ?? [];
      list.push(recipe);
      producers.set(output.good, list);
    }
  }

  const visited = new Set<GoodId>();
  const path: GoodId[] = [];
  const active = new Set<GoodId>();
  const cycles = new Set<string>();
  const affectedGoods = new Set<GoodId>();

  function visit(good: GoodId): void {
    if (active.has(good)) {
      const start = path.indexOf(good);
      const cycle = path.slice(start);
      cycle.push(good);

      cycles.add(
        `Cycle de production détecté : ${cycle.join(" → ")}`,
      );

      for (const cycleGood of cycle) {
        affectedGoods.add(cycleGood);
      }

      return;
    }

    if (visited.has(good)) return;

    active.add(good);
    path.push(good);

    for (const recipe of producers.get(good) ?? []) {
      for (const input of recipe.inputs) {
        visit(input.good);
      }
    }

    path.pop();
    active.delete(good);
    visited.add(good);
  }

  for (const good of producers.keys()) {
    visit(good);
  }

  const queue = [...affectedGoods];

  for (let index = 0; index < queue.length; index++) {
    const affectedGood = queue[index];

    for (const recipe of recipes) {
      const dependsOnAffectedGood = recipe.inputs.some(
        (input) => input.good === affectedGood,
      );

      if (!dependsOnAffectedGood) continue;

      for (const output of recipe.outputs) {
        if (affectedGoods.has(output.good)) continue;

        affectedGoods.add(output.good);
        queue.push(output.good);
      }
    }
  }

  return {
    messages: [...cycles],
    affectedGoods,
  };
}

/** Calcule un bilan conservateur ; les allocations ambiguës sont explicitement signalées. */
export function computeIsland(catalog: Catalog, island: IslandInput): IslandReport {
  validateCatalog(catalog);
  validateIsland(catalog, island);

  let totalPopulation = 0;
  let totalIncomeBonus = 0;
  const demand = new Map<GoodId, number>();
  const populationByTier = catalog.tiers.map((tier) => {
    const houses = island.houses[tier.id] ?? 0;
    const basePopulation = houses * tier.residentsPerHouse;
    const fulfilled = new Set(island.fulfilledNeeds?.[tier.id] ?? []);
    let bonusPopulation = 0;
    let incomeBonus = 0;
    for (const need of tier.needs ?? []) {
      if (!fulfilled.has(need.id)) continue;
      bonusPopulation += houses * (need.effects?.population ?? 0);
      incomeBonus += houses * (need.effects?.income ?? 0);
      if (need.consumptionPerHousePerMinute !== undefined) {
        addTo(demand, need.goodId, houses * need.consumptionPerHousePerMinute * (need.consumptionModifier ?? 1));
      }
    }
    const residents = basePopulation + bonusPopulation;
    if (!Number.isFinite(residents) || !Number.isFinite(incomeBonus)) {
      throw new RangeError(`Le calcul de population ou de revenu pour « ${tier.id} » dépasse les limites numériques`);
    }
    totalPopulation += residents;
    totalIncomeBonus += incomeBonus;
    for (const flow of tier.consumptionPerResident) {
      addTo(demand, flow.good, residents * flow.perMinute);
    }
    return { tierId: tier.id, houses, basePopulation, bonusPopulation, totalPopulation: residents,
      fulfilledNeeds: [...fulfilled], incomeBonus };
  });
  if (!Number.isFinite(totalPopulation) || !Number.isFinite(totalIncomeBonus)) {
    throw new RangeError("Le calcul de population ou de revenu dépasse les limites numériques autorisées");
  }

  const assignments = island.recipeAssignments ?? {};
  const recipeReports: RecipeReport[] = catalog.recipes.map((recipe) => {
    const assignedBuildings = assignments[recipe.id] ?? 0;

    // Une recette inactive ne contribue à aucun flux.

    if (assignedBuildings === 0) {
      return {
        recipeId: recipe.id,
        buildingId: recipe.buildingId,
        assignedBuildings: 0,
        effectiveOutputs: recipe.outputs.map((flow) => ({
          good: flow.good,
          perMinute: 0,
        })),
        effectiveInputs: recipe.inputs.map((flow) => ({
          good: flow.good,
          perMinute: 0,
        })),
      };
    }

    const productivity = island.productivity?.[recipe.buildingId] ?? 1;
    const report = getRecipeFlows(recipe, productivity);
    report.assignedBuildings = assignedBuildings;

    for (const flow of report.effectiveOutputs) {
      flow.perMinute *= assignedBuildings;
    }
    for (const flow of report.effectiveInputs) {
      flow.perMinute *= assignedBuildings;
    }

    return report;
  });


  const activeRecipes = catalog.recipes.filter(
  (recipe) => (assignments[recipe.id] ?? 0) > 0,
);

  const cycleDetection = detectCycles(activeRecipes);
  const unresolvedAllocations = [...cycleDetection.messages];
  const allocated = new Map<GoodId, number>();
  const consumed = new Map<GoodId, number>();

  for (const recipe of recipeReports) {
    for (const flow of recipe.effectiveOutputs) addTo(allocated, flow.good, flow.perMinute);
    for (const flow of recipe.effectiveInputs) addTo(consumed, flow.good, flow.perMinute);
  }

  const allGoods = new Set<GoodId>([
  ...demand.keys(),
  ...[...allocated.entries()]
    .filter(([, amount]) => amount !== 0)
    .map(([good]) => good),
  ...[...consumed.entries()]
    .filter(([, amount]) => amount !== 0)
    .map(([good]) => good),
]);

  const goods: GoodBalance[] = [...allGoods].sort().map((good) => {
    const requested = demand.get(good) ?? 0;
    const produced = allocated.get(good) ?? 0;
    const used = consumed.get(good) ?? 0;
    const netDemand = requested + used;
    const unresolved = cycleDetection.affectedGoods.has(good);

    if (unresolved && (requested > 0 || used > 0 || produced > 0)) {
      unresolvedAllocations.push(
        `La couverture de « ${good} » ne peut pas être déterminée sans résoudre les allocations de production`,
      );
    }
    return {
      good,
      demandPerMinute: netDemand,
      allocatedProductionPerMinute: produced,
      deficitPerMinute: Math.max(0, netDemand - produced),
      surplusPerMinute: Math.max(0, produced - netDemand),
      unresolved,
    };
  });

  return {
    totalPopulation,
    totalIncomeBonus,
    populationByTier,
    recipes: recipeReports,
    goods,
    unresolvedAllocations: [...new Set(unresolvedAllocations)],
  };
}
