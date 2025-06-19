import express from "express";
import db from "../db/client.js";
import { getRecipeIngredients } from "../db/queries/recipes.js";

const router = express.Router();

// GET /recipes
router.get("/", async (req, res) => {
    try {
        const { rows } = await db.query(
            "SELECT id, title, description, instructions FROM recipes"
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching recipes:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /recipes/:id/ingredients
router.get("/:id/ingredients", async (req, res) => {
    try {
        const ingredients = await getRecipeIngredients(req.params.id);
        res.json(ingredients);
    } catch (err) {
        console.error("Error fetching ingredients:", err);
        res.status(500).json({ error: "Failed to fetch ingredients." });
    }
});

// POST /recipes
router.post("/", async (req, res) => {
    try {
        const { title, instructions, ingredients } = req.body;

        // Validate body
        if (!title || !instructions || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                error: "Invalid input: title, instructions, and ingredients[] required",
            });
        }

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: no user ID found in token" });
        }

        // Insert recipe
        const insertRecipeQuery = `
      INSERT INTO recipes (user_id, title, instructions)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
        const { rows } = await db.query(insertRecipeQuery, [userId, title, instructions]);
        const recipeId = rows[0].id;

        // Insert ingredients
        for (let ing of ingredients) {
            const name = ing.name?.trim().toLowerCase();
            const quantity = ing.quantity;
            const unit = ing.unit;

            if (!name || !quantity || !unit) {
                console.warn("Skipping invalid ingredient:", ing);
                continue;
            }

            const { rows: ingRows } = await db.query(
                `INSERT INTO ingredients (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
                [name]
            );

            const ingredientId = ingRows[0].id;

            await db.query(
                `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
         VALUES ($1, $2, $3, $4)`,
                [recipeId, ingredientId, quantity, unit]
            );
        }

        res.status(201).json({ message: "Recipe created", recipeId });
    } catch (err) {
        console.error("Error in POST /recipes:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
