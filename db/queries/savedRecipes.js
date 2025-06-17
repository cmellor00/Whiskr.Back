import db from "../client.js";

export async function addSavedRecipe(userId, recipeId) {
    const {
        rows: [entry],
    } = await db.query(
        `INSERT INTO saved_recipes (user_id, recipe_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING
         RETURNING *`,
        [userId, recipeId]
    );

    return entry || { alreadySaved: true };
}


export async function getSavedRecipes(userId) {
    const { rows } = await db.query(
        `SELECT r.*
         FROM saved_recipes sr
         JOIN recipes r ON sr.recipe_id = r.id
         WHERE sr.user_id = $1`,
        [userId]
    );
    return rows;
}


export async function deleteSavedRecipe(userId, recipeId) {
    await db.query(
        `DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2`,
        [userId, recipeId]
    );
}
