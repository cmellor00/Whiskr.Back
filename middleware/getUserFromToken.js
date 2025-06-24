import { getUserById } from "#db/queries/users";
import { verifyToken } from "../utils/jwt.js";

export default function getUserFromToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyToken(token);
        req.user = payload;
    } catch (err) {
        console.error("❌ Token verification failed:", err.message);

    }

    next();
}

