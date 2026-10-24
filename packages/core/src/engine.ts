import type {
  Building,
  BuildingReport,
  Catalog,
  Flow,
  GoodId,
  IslandInput,
  IslandReport,
} from "./types";

function addTo(map: Map<GoodId, number>, good: GoodId, amount: number): void {
  map.set(good, (map.get(good) ?? 0) + amount);
}

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
  if (!Array.isArray(catalog.buildings) || !Array.isArray(catalog.tiers)) {
    throw new TypeError("Le catalogue doit contenir des tableaux buildings et tiers");
  }

  const buildingIds = new Set<string>();
  for (const building of catalog.buildings) {
    if (building === null || typeof building !== "object") {
      throw new TypeError("Chaque bâtiment doit être un objet valide");
    }
    assertNonEmptyString(building.id, "building.id");
    if (buildingIds.has(building.id)) {
      throw new Error(`Identifiant de bâtiment dupliqué : « ${building.id} »`);
    }
    buildingIds.add(building.id);
    validateFlow(building.output, `building « ${building.id} ».output`);
    assertPositiveNumber(building.output.perMinute, `Production de « ${building.id} »`);
    if (!Array.isArray(building.inputs)) {
      throw new TypeError(`Les intrants de « ${building.id} » doivent être un tableau`);
    }
    building.inputs.forEach((input, index) =>
      validateFlow(input, `building « ${building.id} ».inputs[${index}]`),
    );
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
    tier.consumptionPerResident.forEach((flow, index) =>
      validateFlow(flow, `tier « ${tier.id} ».consumptionPerResident[${index}]`),
    );
  }
}

function validateIsland(catalog: Catalog, island: IslandInput): void {
  if (island === null || typeof island !== "object") {
    throw new TypeError("Les paramètres de l’île doivent être un objet valide");
  }
 
  assertNonEmptyString(island.name, "island.name");

  if (island.houses === null || typeof island.houses !== "object" || Array.isArray(island.houses)) {
    throw new TypeError("houses doit être un objet associant les paliers à des nombres de maisons");
  }
  if (island.built === null || typeof island.built !== "object" || Array.isArray(island.built)) {
    throw new TypeError("built doit être un objet associant les bâtiments à des quantités");
  }
  if (
    island.productivity !== undefined &&
    (island.productivity === null || typeof island.productivity !== "object" || Array.isArray(island.productivity))
  ) {
    throw new TypeError("productivity doit être un objet associant les bâtiments à des facteurs de productivité");
  }

  const tierIds = new Set(catalog.tiers.map((tier) => tier.id));
  for (const [tierId, houses] of Object.entries(island.houses)) {
    if (!tierIds.has(tierId)) throw new Error(`Palier de population inconnu : « ${tierId} »`);
    assertNonNegativeNumber(houses, `Nombre de maisons pour « ${tierId} »`);
    if (!Number.isSafeInteger(houses)) {
      throw new RangeError(`Le nombre de maisons pour « ${tierId} » doit être un entier`);
    }
  }

  const buildingIds = new Set(catalog.buildings.map((building) => building.id));
  for (const [buildingId, count] of Object.entries(island.built)) {
    if (!buildingIds.has(buildingId)) throw new Error(`Bâtiment construit inconnu : « ${buildingId} »`);
    assertNonNegativeNumber(count, `Nombre de bâtiments construits pour « ${buildingId} »`);
    if (!Number.isSafeInteger(count)) {
      throw new RangeError(`Le nombre de bâtiments construits pour « ${buildingId} » doit être un entier`);
    }
  }

  for (const [buildingId, factor] of Object.entries(island.productivity ?? {})) {
    if (!buildingIds.has(buildingId)) throw new Error(`Bâtiment de productivité inconnu : « ${buildingId} »`);
    assertPositiveNumber(factor, `Facteur de productivité pour « ${buildingId} »`);
  }
}

/**
 * Ordonne les biens pour que chaque bien soit traité AVANT ses intrants.
 * Ainsi, quand on traite un bien, toute sa demande a déjà été cumulée.
 */
function consumersFirst(producers: Map<GoodId, Building>): GoodId[] {
  const visited = new Set<GoodId>();
  const onPath = new Set<GoodId>();
  const order: GoodId[] = [];

  const visit = (good: GoodId): void => {
    if (visited.has(good)) return;
    if (onPath.has(good)) throw new Error(`Cycle de production autour de « ${good} »`);
    onPath.add(good);
    for (const input of producers.get(good)?.inputs ?? []) visit(input.good);
    onPath.delete(good);
    visited.add(good);
    order.push(good);
  };

  for (const good of producers.keys()) visit(good);
  return order.reverse();
}

/** Calcule les besoins de production d’une île à partir du catalogue et de ses paramètres. */
export function computeIsland(catalog: Catalog, island: IslandInput): IslandReport {
  validateCatalog(catalog);
  validateIsland(catalog, island);

  // Un producteur par bien : hypothèse provisoire à réexaminer avec les données du jeu.
  const producers = new Map<GoodId, Building>();
  for (const building of catalog.buildings) {
    const good = building.output.good;
    if (producers.has(good)) throw new Error(`Plusieurs bâtiments produisent « ${good} »`);
    producers.set(good, building);
  }

  // Demande initiale : consommation des habitants.
  const demand = new Map<GoodId, number>();
  let totalPopulation = 0;
  for (const tier of catalog.tiers) {
    const residents = (island.houses[tier.id] ?? 0) * tier.residentsPerHouse;
    totalPopulation += residents;
    for (const need of tier.consumptionPerResident) {
      addTo(demand, need.good, residents * need.perMinute);
    }
  }

  if (!Number.isFinite(totalPopulation)) {
    throw new RangeError("La population totale calculée dépasse les limites numériques autorisées");
  }
  for (const [good, amount] of demand) {
    if (!Number.isFinite(amount)) {
      throw new RangeError(`La demande calculée pour « ${good} » dépasse les limites numériques autorisées`);
    }
  }

  // Propagation de la demande de l’aval vers l’amont.
  const buildings: BuildingReport[] = [];
  for (const good of consumersFirst(producers)) {
    const building = producers.get(good);
    if (!building) continue;

    const productivity = island.productivity?.[building.id] ?? 1;

    const effectiveOutputPerMinute =
      building.output.perMinute * productivity;

    if (
      !Number.isFinite(effectiveOutputPerMinute) ||
      effectiveOutputPerMinute <= 0
    ) {
      throw new RangeError(
        `Capacité de production invalide pour « ${building.id} »`,
      );
    }

    const demandPerMinute = demand.get(good) ?? 0;
    const required = demandPerMinute / effectiveOutputPerMinute;
    const built = island.built[building.id] ?? 0;

    buildings.push({
      buildingId: building.id,
      good,
      demandPerMinute,
      required,
      built,
      delta: required - built,
    });

    // La productivité accélère la cadence : les intrants par unité produite restent constants.
    for (const input of building.inputs) {
      addTo(
        demand,
        input.good,
        demandPerMinute * (input.perMinute / building.output.perMinute),
      );
    }
  }

  for (const [good, amount] of demand) {
    if (!Number.isFinite(amount)) {
      throw new RangeError(`La demande calculée pour « ${good} » dépasse les limites numériques autorisées`);
    }
  }
  if (buildings.some((building) => !Number.isFinite(building.required) || !Number.isFinite(building.delta))) {
    throw new RangeError("Le résultat du calcul dépasse les limites numériques autorisées");
  }

  return { totalPopulation, buildings };
}