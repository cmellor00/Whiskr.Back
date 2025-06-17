import express from "express";
import { addSavedRecipe, getSavedRecipes, deleteSavedRecipe } from "../db/queries/savedRecipes.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
    const userId = req.user?.id;
    const { recipeId } = req.body;
    if (!userId) return res.status(401).send("Unauthorized");

    try {
        const saved = await addSavedRecipe(userId, recipeId);
        if (saved.alreadySaved) {
            return res.status(200).json({ message: "Already saved" });
        }
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
});


router.get("/", async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).send("Unauthorized");

    try {
        const recipes = await getSavedRecipes(userId);
        res.json(recipes);
    } catch (err) {
        next(err);
    }
});


router.delete("/:id", async (req, res, next) => {
    const userId = req.user?.id;
    const recipeId = parseInt(req.params.id);
    if (!userId) return res.status(401).send("Unauthorized");

    try {
        await deleteSavedRecipe(userId, recipeId);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

export default router;


