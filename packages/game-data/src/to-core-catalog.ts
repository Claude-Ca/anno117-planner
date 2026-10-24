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

  const recipesById = new Map(
    gameCatalog.recipes.map((recipe) => [recipe.id, recipe]),
  );

  const buildings = gameCatalog.buildings.map((building) => {
    if (building.recipeIds.length !== 1) {
      throw new Error(
        `Le bâtiment "${building.id}" doit référencer exactement une recette pour être compatible avec core.`,
      );
    }

    const recipe = recipesById.get(building.recipeIds[0]!);

    if (!recipe) {
      throw new Error(
        `Recette introuvable pour le bâtiment "${building.id}".`,
      );
    }

    if (recipe.outputs.length !== 1) {
      throw new Error(
        `La recette "${recipe.id}" doit avoir exactement une sortie pour être compatible avec core.`,
      );
    }

    return {
      id: building.id,
      output: recipe.outputs[0]!,
      inputs: recipe.inputs,
    };
  });

  // Le moteur actuel ne permet pas de répartir la production
  // d'un même bien entre plusieurs bâtiments.
  const producerByGood = new Map<string, string>();

  for (const building of buildings) {
    const previousBuildingId = producerByGood.get(building.output.good);

    if (previousBuildingId !== undefined) {
      throw new Error(
        `Le bien "${building.output.good}" est produit par plusieurs bâtiments : "${previousBuildingId}" et "${building.id}".`,
      );
    }

    producerByGood.set(building.output.good, building.id);
  }

  return {
    buildings,
    tiers: gameCatalog.tiers.map((tier) => ({
      id: tier.id,
      residentsPerHouse: tier.residentsPerHouse,
      consumptionPerResident: tier.consumptionPerResident,
    })),
  };
}