import express from "express";
import cors from "cors"; // allows cross origin requests
import usersRouter from "./routes/users.js";
import pantryRouter from "./routes/pantry.js";
import recipesRouter from "./routes/recipes.js";
import getUserFromToken from "./middleware/getUserFromToken.js";
import savedRoutes from "./routes/savedRecipes.js";

const app = express();

app.use(cors({
    origin: "https://whiskr-app.netlify.app", // or use an environment variable
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
