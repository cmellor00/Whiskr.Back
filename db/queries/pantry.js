import db from "../client.js";

export async function getUserPantry(userId) {
    const { rows } = await db.query(`
        SELECT pi.id, i.name, pi.quantity, pi.unit
        FROM pantry_ingredients pi
        JOIN ingredients i ON pi.ingredient_id = i.id
        WHERE pi.user_id = $1
    `, [userId]);
    return rows;
}


export async function addPantryItem(userId, name, quantity, unit) {
    const {
        rows: [ingredient],
    } = await db.query(
        `INSERT INTO ingredients (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING *`,
        [name]
    );

    const {
        rows: [pantryItem],
    } = await db.query(
        `INSERT INTO pantry_ingredients (user_id, ingredient_id, quantity, unit)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING
         RETURNING *`,
        [userId, ingredient.id, quantity, unit]
    );



    return pantryItem;
}

export async function deletePantryItem(userId, itemId) {
    await db.query(
        `DELETE FROM pantry_ingredients WHERE id = $1 AND user_id = $2`,
        [itemId, userId]
    );
}
