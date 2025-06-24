import express from "express";
import cors from "cors"; // allows cross origin requests
import usersRouter from "./routes/users.js";
import pantryRouter from "./routes/pantry.js";
import recipesRouter from "./routes/recipes.js";
import getUserFromToken from "./middleware/getUserFromToken.js";
import savedRoutes from "./routes/savedRecipes.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173", // Vite (or whatever your local frontend uses)
    "http://localhost:3000", // Create React App (optional)
    "https://whiskr-app.netlify.app" // Your live frontend
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/pantry", pantryRouter);
app.use("/recipes", recipesRouter);
app.use("/saved", getUserFromToken, savedRoutes);

app.use((req, res, next) => {
    res.status(404).send({ error: "Not found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Sorry! Something went wrong.");
});

export default app;
