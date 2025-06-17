import db from "#db/client";
import bcrypt from "bcrypt";

await db.connect();
await seed();
await db.end();
console.log("🌱 Whiskr database seeded.");

async function seed() {
    const passwordHash = await bcrypt.hash("testpass", 10);
    const {
        rows: [user],
    } = await db.query(
        `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
        ["TestUser", await bcrypt.hash("testpass", 10)]
    );

    // Seed ingredients
    const ingredientNames = [
        "flour", "sugar", "eggs", "butter", "milk",
        "baking powder", "salt", "vanilla extract",
        "olive oil", "cheddar cheese", "macaroni", "tomato sauce", "garlic", "onion", "chocolate chips"
    ];
    const ingredientIds = {};

    for (const name of ingredientNames) {
        const {
            rows: [ingredient],
        } = await db.query(
            `INSERT INTO ingredients (name) VALUES ($1) RETURNING *`,
            [name]
        );
        ingredientIds[name] = ingredient.id;
    }

    // Seed recipes
    const recipes = [
        {
            title: "Fluffy Pancakes",
            description: "Classic fluffy pancakes for breakfast.",
            instructions:
                "1. Mix dry ingredients (flour, baking powder, salt).\n" +
                "2. Add milk, eggs, and melted butter. Stir until just combined.\n" +
                "3. Pour onto hot griddle and cook until bubbles form. Flip and cook until golden.",
            ingredients: [
                { name: "flour", quantity: 2.0, unit: "cups" },
                { name: "milk", quantity: 1.5, unit: "cups" },
                { name: "eggs", quantity: 2, unit: "pcs" },
                { name: "baking powder", quantity: 1.5, unit: "tsp" },
                { name: "salt", quantity: 0.5, unit: "tsp" },
                { name: "butter", quantity: 2.0, unit: "tbsp" },
            ],
        },
        {
            title: "Chocolate Chip Cookies",
            description: "Crispy on the edge, chewy in the center.",
            instructions:
                "1. Cream butter and sugar until fluffy.\n" +
                "2. Beat in eggs and vanilla extract.\n" +
                "3. Mix in dry ingredients. Fold in chocolate chips.\n" +
                "4. Drop spoonfuls on baking sheet and bake at 350°F for 10–12 min.",
            ingredients: [
                { name: "flour", quantity: 2.25, unit: "cups" },
                { name: "sugar", quantity: 0.75, unit: "cups" },
                { name: "butter", quantity: 1.0, unit: "cups" },
                { name: "eggs", quantity: 2, unit: "pcs" },
                { name: "vanilla extract", quantity: 1.0, unit: "tsp" },
                { name: "chocolate chips", quantity: 1.0, unit: "cup" },
            ],
        },
        {
            title: "Mac and Cheese",
            description: "Creamy, cheesy comfort food.",
            instructions:
                "1. Boil macaroni until al dente.\n" +
                "2. In a pan, melt butter and stir in flour. Slowly whisk in milk.\n" +
                "3. Stir in cheese until melted. Combine with drained macaroni.",
            ingredients: [
                { name: "macaroni", quantity: 2.0, unit: "cups" },
                { name: "milk", quantity: 1.0, unit: "cups" },
                { name: "butter", quantity: 2.0, unit: "tbsp" },
                { name: "cheddar cheese", quantity: 2.0, unit: "cups" },
                { name: "salt", quantity: 0.5, unit: "tsp" },
            ],
        },
        {
            title: "Garlic Bread",
            description: "Toasty and buttery garlic bread.",
            instructions:
                "1. Mix softened butter with minced garlic and salt.\n" +
                "2. Spread on sliced baguette.\n" +
                "3. Bake at 375°F for 10 min until crispy.",
            ingredients: [
                { name: "butter", quantity: 0.5, unit: "cups" },
                { name: "garlic", quantity: 3.0, unit: "cloves" },
                { name: "salt", quantity: 0.25, unit: "tsp" },
            ],
        },
        {
            title: "Simple Marinara Sauce",
            description: "Fresh tomato sauce for pasta.",
            instructions:
                "1. Sauté garlic and onion in olive oil.\n" +
                "2. Add tomato sauce and simmer for 20 minutes.\n" +
                "3. Season with salt to taste.",
            ingredients: [
                { name: "olive oil", quantity: 2.0, unit: "tbsp" },
                { name: "garlic", quantity: 2.0, unit: "cloves" },
                { name: "onion", quantity: 0.5, unit: "pcs" },
                { name: "tomato sauce", quantity: 2.0, unit: "cups" },
                { name: "salt", quantity: 0.5, unit: "tsp" },
            ],
        },
    ];

    for (const r of recipes) {
        const {
            rows: [recipe],
        } = await db.query(
            `INSERT INTO recipes (user_id, title, description, instructions) VALUES ($1, $2, $3, $4) RETURNING *`,
            [user.id, r.title, r.description, r.instructions]
        );

        for (const ing of r.ingredients) {
            await db.query(
                `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)`,
                [recipe.id, ingredientIds[ing.name], ing.quantity, ing.unit]
            );
        }
    }

    // Seed pantry
    const pantryItems = [
        { name: "flour", quantity: 5.0, unit: "cups" },
        { name: "milk", quantity: 2.0, unit: "cups" },
        { name: "eggs", quantity: 6, unit: "pcs" },
        { name: "salt", quantity: 1.0, unit: "tsp" },
    ];

    for (const item of pantryItems) {
        await db.query(
            `INSERT INTO pantry_ingredients (user_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)`,
            [user.id, ingredientIds[item.name], item.quantity, item.unit]
        );
    }
}
