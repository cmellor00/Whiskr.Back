import express from "express";
const router = express.Router();


import { createUser, getUserByUsernameAndPassword } from "../db/queries/users.js";
import requireBody from "../middleware/requireBody.js";
import { createToken } from "../utils/jwt.js";


router
    .route("/register")
    .post(requireBody(["username", "password"]), async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const user = await createUser(username, password);
            const token = createToken({ id: user.id });
            res.status(201).json({ token });
        } catch (err) {
            if (err.code === "23505") {
                res.status(400).json({ error: "Username already exists." });
            } else {
                next(err);
            }
        }
    });


router
    .route("/login")
    .post(requireBody(["username", "password"]), async (req, res) => {
        const { username, password } = req.body;
        const user = await getUserByUsernameAndPassword(username, password);
        if (!user) return res.status(401).send("Invalid username or password.");

        const token = createToken({ id: user.id });
        res.json({ token });
    });

export default router;
