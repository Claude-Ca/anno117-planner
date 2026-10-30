import type { Catalog } from "@anno117/core";
import {
  toCoreCatalog,
  validateGameCatalog,
  type GameCatalog,
} from "@anno117/game-data";

export interface GameDataManifest {
  id: string;
  catalogVersion: string;
  schemaVersion: string;
  gameVersion: string;
  regions: string[];
}

export interface GameDataInput {
  manifest: GameDataManifest;
  catalog: GameCatalog;
}

export interface GameDataRepository {
  readonly manifest: Readonly<GameDataManifest>;
  readonly catalog: GameCatalog;
  readonly coreCatalog: Catalog;
}

/**
 * Builds the in-memory repository from bundled data.
 *
 * This function deliberately performs no filesystem or network access. The
 * desktop application is responsible for importing its bundled catalog module.
 */
export function loadGameData(input: GameDataInput): GameDataRepository {
  validateManifest(input.manifest);

  const errors = validateGameCatalog(input.catalog);
  if (errors.length > 0) {
    const details = errors
      .map(({ path, message }) => `${path}: ${message}`)
      .join("\n");
    throw new Error(`Catalogue invalide :\n${details}`);
  }

  const coreCatalog = toCoreCatalog(input.catalog);

  return Object.freeze({
    manifest: Object.freeze({
      ...input.manifest,
      regions: Object.freeze([...input.manifest.regions]),
    }),
    catalog: input.catalog,
    coreCatalog,
  });
}

function validateManifest(manifest: GameDataManifest): void {
  if (!manifest || typeof manifest !== "object") {
    throw new TypeError("Le manifeste du catalogue est obligatoire.");
  }

  for (const field of ["id", "catalogVersion", "schemaVersion", "gameVersion"] as const) {
    if (typeof manifest[field] !== "string" || manifest[field].trim().length === 0) {
      throw new TypeError(`Le champ manifest.${field} est obligatoire.`);
    }
  }

  if (!Array.isArray(manifest.regions) || manifest.regions.length === 0) {
    throw new TypeError("Le manifeste doit déclarer au moins une région.");
  }

  const uniqueRegions = new Set(manifest.regions);
  if (uniqueRegions.size !== manifest.regions.length || manifest.regions.some((region) => !region.trim())) {
    throw new Error("Les régions du manifeste doivent être non vides et uniques.");
  }
}

export type { CatalogValidationError } from "@anno117/game-data";
export type { GameCatalog } from "@anno117/game-data";
export type { Catalog } from "@anno117/core";
