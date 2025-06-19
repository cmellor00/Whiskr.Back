-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS pantry_ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS saved_recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Ingredients table (centralized lookup)
CREATE TABLE ingredients (
    id serial PRIMARY KEY,
    name text UNIQUE NOT NULL
);

-- Recipes table
CREATE TABLE recipes (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    instructions text,
    image_url text
);

CREATE TABLE saved_recipes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE(user_id, recipe_id)  -- prevent duplicate saves
);

-- Junction table: Recipe_Ingredients
CREATE TABLE recipe_ingredients (
    id serial PRIMARY KEY,
    recipe_id integer NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id integer NOT NULL REFERENCES ingredients(id),
    quantity numeric(10, 2),
    unit text
);

-- Pantry_Ingredients table (user-specific)
CREATE TABLE pantry_ingredients (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ingredient_id integer NOT NULL REFERENCES ingredients(id),
    quantity numeric(10, 2),
    unit text
);
