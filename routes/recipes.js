import express from "express";
import db from "../db/client.js";
import { getRecipeIngredients } from "../db/queries/recipes.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { rows } = await db.query("SELECT id, title, description, instructions FROM recipes");
        res.json(rows);
    } catch (err) {
        console.error("Error fetching recipes:", err);
        res.status(500).json({ error: "Internal error" });
    }
});

router.get("/:id/ingredients", async (req, res) => {
    try {
        const ingredients = await getRecipeIngredients(req.params.id);
        res.json(ingredients);
    } catch (err) {
        console.error("Error fetching ingredients:", err);
        res.status(500).json({ error: "Failed to fetch ingredients." });
    }
});

export default router;
