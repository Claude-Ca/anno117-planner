import type {
  Building,
  BuildingReport,
  Catalog,
  GoodId,
  IslandInput,
  IslandReport,
} from "./types";

function addTo(map: Map<GoodId, number>, good: GoodId, amount: number): void {
  map.set(good, (map.get(good) ?? 0) + amount);
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
    order.push(good); // post-ordre : intrants d'abord
  };

  for (const good of producers.keys()) visit(good);
  return order.reverse(); // on inverse : consommateurs d'abord
}

export function computeIsland(catalog: Catalog, island: IslandInput): IslandReport {
  // 1. Un producteur par bien (hypothèse provisoire, à valider avec les vraies données)
  const producers = new Map<GoodId, Building>();
  for (const building of catalog.buildings) {
    const good = building.output.good;
    if (producers.has(good)) throw new Error(`Plusieurs bâtiments produisent « ${good} »`);
    producers.set(good, building);
  }

  // 2. Demande initiale : ce que consomment les habitants
  const demand = new Map<GoodId, number>();
  let totalPopulation = 0;
  for (const tier of catalog.tiers) {
    const residents = (island.houses[tier.id] ?? 0) * tier.residentsPerHouse;
    totalPopulation += residents;
    for (const need of tier.consumptionPerResident) {
      addTo(demand, need.good, residents * need.perMinute);
    }
  }

  // 3. Éclatement de la chaîne : de l'aval vers l'amont
  const buildings: BuildingReport[] = [];
  for (const good of consumersFirst(producers)) {
    const building = producers.get(good);
    if (!building) continue; // matière sans producteur (ex. importée) : ignorée pour l'instant

    const productivity = island.productivity?.[building.id] ?? 1;
    if (building.output.perMinute <= 0 || productivity <= 0) {
      throw new RangeError(`Production invalide pour « ${building.id} »`);
    }

    const demandPerMinute = demand.get(good) ?? 0;
    const required = demandPerMinute / (building.output.perMinute * productivity);

    // Hypothèse : la productivité accélère la cadence (sortie ET intrants),
    // donc les intrants par unité produite ne changent pas.
    for (const input of building.inputs) {
      addTo(demand, input.good, demandPerMinute * (input.perMinute / building.output.perMinute));
    }

    const built = island.built[building.id] ?? 0;
    buildings.push({
      buildingId: building.id,
      good,
      demandPerMinute,
      required,
      built,
      delta: required - built,
    });
  }

  return { totalPopulation, buildings };
}