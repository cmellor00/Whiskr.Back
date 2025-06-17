import db from "../client.js";

export async function getRecipeIngredients(recipeId) {
    const { rows } = await db.query(`
        SELECT i.name, ri.quantity, ri.unit
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = $1
    `, [recipeId]);

    return rows;
}

