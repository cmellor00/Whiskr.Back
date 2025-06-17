import { getUserById } from "#db/queries/users";
// middleware/getUserFromToken.js
import { verifyToken } from "../utils/jwt.js";

export default function getUserFromToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(); // Token not provided or improperly formatted
    }

    const token = authHeader.split(" ")[1]; // Get actual token part

    try {
        const payload = verifyToken(token); // Decode token
        req.user = payload; // Attach to req
    } catch (err) {
        console.error("❌ Token verification failed:", err.message);
        // Optionally: return res.status(401).send("Invalid token");
    }

    next(); // Continue regardless, user may be undefined
}

