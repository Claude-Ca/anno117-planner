
import type { Catalog } from "@anno117/core";
import type { GameCatalog } from "./types";
import { validateGameCatalog } from "./validate-catalog";

export function toCoreCatalog(gameCatalog: GameCatalog): Catalog {
  const errors = validateGameCatalog(gameCatalog);

  if (errors.length > 0) {
    const details = errors
      .map(({ path, message }) => `${path}: ${message}`)
      .join("\n");

    throw new Error(`Catalogue invalide :\n${details}`);
  }

  const buildingByRecipeId = new Map<string, string>();

  for (const building of gameCatalog.buildings) {
    for (const recipeId of building.recipeIds) {
      if (buildingByRecipeId.has(recipeId)) {
        throw new Error(
          `La recette "${recipeId}" est référencée par plusieurs bâtiments.`,
        );
      }

      buildingByRecipeId.set(recipeId, building.id);
    }
  }

  for (const recipe of gameCatalog.recipes) {
    const buildingId = buildingByRecipeId.get(recipe.id);

    if (buildingId === undefined) {
      throw new Error(
        `Aucun bâtiment associé à la recette "${recipe.id}".`,
      );
    }

    if (buildingId !== recipe.buildingId) {
      throw new Error(
        `Association incohérente entre la recette "${recipe.id}" et le bâtiment "${recipe.buildingId}".`,
      );
    }
  }

  return {
    buildings: gameCatalog.buildings.map((building) => ({
      id: building.id,
    })),

    recipes: gameCatalog.recipes.map((recipe) => ({
      id: recipe.id,
      buildingId: buildingByRecipeId.get(recipe.id)!,
      inputs: recipe.inputs,
      outputs: recipe.outputs,
    })),

    tiers: gameCatalog.tiers.map((tier) => ({
      id: tier.id,
      residentsPerHouse: tier.residentsPerHouse,
      consumptionPerResident: tier.consumptionPerResident,
      needs: tier.needs,
    })),
  };
}
