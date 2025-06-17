import express from "express";
import { getUserPantry } from "../db/queries/pantry.js";
import { addPantryItem } from "../db/queries/pantry.js";
import { deletePantryItem } from "../db/queries/pantry.js";

const router = express.Router();


router.get("/", async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const pantry = await getUserPantry(userId);
        res.json(pantry);
    } catch (err) {
        next(err);
    }
});


router.post("/", async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { name, quantity, unit } = req.body;
        const item = await addPantryItem(userId, name, quantity, unit);
        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const itemId = parseInt(req.params.id);
        if (!userId) return res.status(401).send("Unauthorized");
        await deletePantryItem(userId, itemId);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});


export default router;
