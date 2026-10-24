
import type { Flow } from "@anno117/core";
import type { GameCatalog } from "./types";

export interface CatalogValidationError {
  path: string;
  message: string;
}

export function validateGameCatalog(
  catalog: GameCatalog,
): CatalogValidationError[] {
  const errors: CatalogValidationError[] = [];

  function add(path: string, message: string): void {
    errors.push({ path, message });
  }

  function checkUniqueIds(
    items: readonly { id: string }[],
    path: string,
  ): Set<string> {
    const ids = new Set<string>();

    items.forEach((item, index) => {
      if (!item.id.trim()) {
        add(`${path}[${index}].id`, "L'identifiant est obligatoire.");
      } else if (ids.has(item.id)) {
        add(`${path}[${index}].id`, `Identifiant dupliqué : ${item.id}.`);
      }

      ids.add(item.id);
    });

    return ids;
  }

  function checkSource(sourceId: string, path: string): void {
    if (!sourceIds.has(sourceId)) {
      add(path, `Source inconnue : ${sourceId}.`);
    }
  }

  function checkFlows(flows: readonly Flow[], path: string): void {
    const seenGoods = new Set<string>();

    flows.forEach((flow, index) => {
      const flowPath = `${path}[${index}]`;

      if (!goodIds.has(flow.good)) {
        add(`${flowPath}.good`, `Bien inconnu : ${flow.good}.`);
      }

      if (!Number.isFinite(flow.perMinute) || flow.perMinute <= 0) {
        add(
          `${flowPath}.perMinute`,
          "Le débit doit être un nombre fini strictement positif.",
        );
      }

      if (seenGoods.has(flow.good)) {
        add(
          `${flowPath}.good`,
          `Le bien ${flow.good} est déclaré plusieurs fois dans le même flux.`,
        );
      }

      seenGoods.add(flow.good);
    });
  }

  const sourceIds = checkUniqueIds(catalog.sources, "sources");
  const goodIds = checkUniqueIds(catalog.goods, "goods");
  const buildingIds = checkUniqueIds(catalog.buildings, "buildings");
  const recipeIds = checkUniqueIds(catalog.recipes, "recipes");
  checkUniqueIds(catalog.tiers, "tiers");

  catalog.sources.forEach((source, index) => {
    const path = `sources[${index}]`;

    if (!source.title.trim()) {
      add(`${path}.title`, "Le titre de la source est obligatoire.");
    }

    try {
      const url = new URL(source.url);

      if (url.protocol !== "https:" && url.protocol !== "http:") {
        add(`${path}.url`, "L'URL doit utiliser HTTP ou HTTPS.");
      }
    } catch {
      add(`${path}.url`, "L'URL de la source est invalide.");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.accessedAt)) {
      add(`${path}.accessedAt`, "La date doit respecter le format YYYY-MM-DD.");
    } else {
      const date = new Date(`${source.accessedAt}T00:00:00.000Z`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== source.accessedAt
      ) {
        add(`${path}.accessedAt`, "La date de consultation est invalide.");
      }
    }
  });

  catalog.goods.forEach((good, index) => {
    const path = `goods[${index}]`;

    if (!good.name.trim()) {
      add(`${path}.name`, "Le nom du bien est obligatoire.");
    }

    checkSource(good.sourceId, `${path}.sourceId`);
  });

  catalog.buildings.forEach((building, index) => {
    const path = `buildings[${index}]`;

    if (!building.name.trim()) {
      add(`${path}.name`, "Le nom du bâtiment est obligatoire.");
    }

    checkSource(building.sourceId, `${path}.sourceId`);

    if (building.recipeIds.length === 0) {
      add(`${path}.recipeIds`, "Le bâtiment doit référencer au moins une recette.");
    }

    const seenRecipes = new Set<string>();

    building.recipeIds.forEach((recipeId, recipeIndex) => {
      if (!recipeIds.has(recipeId)) {
        add(
          `${path}.recipeIds[${recipeIndex}]`,
          `Recette inconnue : ${recipeId}.`,
        );
      }

      if (seenRecipes.has(recipeId)) {
        add(
          `${path}.recipeIds[${recipeIndex}]`,
          `Recette référencée plusieurs fois : ${recipeId}.`,
        );
      }

      seenRecipes.add(recipeId);
    });
  });

  catalog.recipes.forEach((recipe, index) => {
    const path = `recipes[${index}]`;

    if (!buildingIds.has(recipe.buildingId)) {
      add(`${path}.buildingId`, `Bâtiment inconnu : ${recipe.buildingId}.`);
    }

    checkSource(recipe.sourceId, `${path}.sourceId`);

    if (recipe.inputs.length === 0 && recipe.outputs.length === 0) {
      add(path, "Une recette doit avoir au moins une entrée ou une sortie.");
    }

    checkFlows(recipe.inputs, `${path}.inputs`);
    checkFlows(recipe.outputs, `${path}.outputs`);
  });

  catalog.tiers.forEach((tier, index) => {
    const path = `tiers[${index}]`;

    if (!tier.name.trim()) {
      add(`${path}.name`, "Le nom du palier est obligatoire.");
    }

    if (!Number.isFinite(tier.residentsPerHouse) || tier.residentsPerHouse <= 0) {
      add(
        `${path}.residentsPerHouse`,
        "Le nombre de résidents par maison doit être fini et strictement positif.",
      );
    }

    checkSource(tier.sourceId, `${path}.sourceId`);
    checkFlows(tier.consumptionPerResident, `${path}.consumptionPerResident`);
  });

  return errors;
}
