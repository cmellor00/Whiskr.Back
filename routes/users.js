import express from "express";
const router = express.Router();

import db from "../db/client.js";
import { createUser, getUserByUsernameAndPassword } from "../db/queries/users.js";
import requireBody from "../middleware/requireBody.js";
import requireUser from "../middleware/requireUser.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { createToken } from "../utils/jwt.js";

// REGISTER
router.post("/register", requireBody(["username", "password"]), async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await createUser(username, password);
        const token = createToken({ id: user.id, is_admin: user.is_admin });
        res.status(201).json({ token });
    } catch (err) {
        if (err.code === "23505") {
            res.status(400).json({ error: "Username already exists." });
        } else {
            next(err);
        }
    }
});

// LOGIN
router.post("/login", requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password.");

    const token = createToken({ id: user.id, is_admin: user.is_admin });
    res.json({ token });
});

// GET /users/me - Return logged-in user's profile
router.get("/me", requireUser, async (req, res) => {
    const { id } = req.user;
    const {
        rows: [user],
    } = await db.query("SELECT id, username, is_admin FROM users WHERE id = $1", [id]);

    res.json(user);
});

// GET /users/all - Admin only
router.get("/all", requireUser, requireAdmin, async (req, res) => {
    const { rows } = await db.query("SELECT id, username, is_admin FROM users");
    res.json(rows);
});

export default router;
