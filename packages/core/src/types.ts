export type GoodId = string;
export type BuildingId = string;
export type TierId = string;

/** Un flux de marchandise, en unités par minute. Les quantités doivent être finies et positives ou nulles. */
export interface Flow {
  good: GoodId;
  perMinute: number;
}

/** Un bâtiment de production : un produit en sortie, des intrants en entrée (à 100 %). */
export interface Building {
  id: BuildingId;
  output: Flow;
  inputs: Flow[];
}

/** Un palier de population et ce que consomme chaque habitant, par minute. */
export interface PopulationTier {
  id: TierId;
  residentsPerHouse: number;
  consumptionPerResident: Flow[];
}

/** Le catalogue du jeu : sera chargé depuis les fichiers JSON de data/. */
export interface Catalog {
  buildings: Building[];
  tiers: PopulationTier[];
}

/**
 * Paramètres saisis pour une île.
 * Les quantités de maisons et de bâtiments construits sont des entiers positifs ou nuls.
 * Les facteurs de productivité doivent être finis et strictement positifs.
 */
export interface IslandInput {
  name: string;
  houses: Record<TierId, number>;
  built: Record<BuildingId, number>;
  /** Facteur de productivité par bâtiment (1 = 100 %, valeur par défaut). */
  productivity?: Record<BuildingId, number>;
}

export interface BuildingReport {
  buildingId: BuildingId;
  good: GoodId;
  demandPerMinute: number;
  /** Nombre de bâtiments nécessaires, fractionnaire. */
  required: number;
  built: number;
  /** required - built : positif = il en manque, négatif = excédent. */
  delta: number;
}

export interface IslandReport {
  totalPopulation: number;
  buildings: BuildingReport[];
}