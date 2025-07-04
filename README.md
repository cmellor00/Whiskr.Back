Whiskr Capstone Pitch Document
________________________________________
⏰ 30-Second Elevator Pitch

How many times have you gone to the grocery store and forgotten an important item you need for your favorite recipe?

“Hey babe what do you want for dinner” *Proceeds to forget every meal you have ever enjoyed*

Whiskr is a full-stack recipe and pantry management web app that lets users upload and organize recipes, track pantry inventory, and generate smart grocery lists based on what they already have at home. With personalized authentication and intuitive design, Whiskr helps users streamline cooking and shopping while minimizing food waste.
________________________________________
🌎 Core MVP Features
•	Recipe Book (CRUD) 
•	Pantry inventory tracking (CRUD)
•	Smart grocery list generation based on pantry contents and selected recipe needs
•	User authentication (sign up, login, protected routes)

________________________________________
✨ Stretch Goal Features
•	Add expiration dates and alerts for pantry items
•	Remove from Pantry as you use ingredients in recipes
•	Weekly meal planning UI (calendar-style)
________________________________________

📆 Project Management System
Tool: GitHub
•	Tickets will be managed as issues in Xcel (Might move to Bugherd) with "Backlog", "To Do", "In Progress", and "Done" columns.
•	High-Level Tickets:
1.	Set up project structure and dependencies
2.	Build authentication system
3.	Design and seed database schema
4.	Recipe CRUD UI and API
5.	Pantry management UI and API
6.	Grocery list logic and UI
7.	Style and responsiveness
8.	Accessibility audit and improvements
________________________________________
📊 Database Schema
Users
•	id (PK)
•	name
•	email (unique)
•	password_hash
Recipes
•	id (PK)
•	user_id (FK)
•	title
•	description
•	instructions
•	image_url (optional)
Ingredients
•	name
•	ingredient_id 

Recipe_Ingredients
•	id (PK)
•	recipe_id (FK)
•	ingredient_id (FK) 
•	quantity
•	unit

Pantry_Ingredients
•	id (PK)
•	user_id (FK)
•	ingredient_id
•	quantity
•	unit



Concern: When a user adds an ingredient how can we make sure it links to the same ingredient in a recipe? Is it just matching text name, can we make it case sensitive? Would it be difficult to implement something like an ingredient look up list/table?

junction table user/ingredients and recipe/ingredients
________________________________________
🚨 API Endpoints
Auth
•	POST /register - Create new user
•	POST /login - Authenticate user
•	GET /me - Get current user info
Recipes
•	GET /recipes - List user recipes
•	POST /recipes - Create recipe
•	PUT /recipes/:id - Update recipe
•	DELETE /recipes/:id - Delete recipe
•	POST /recipes/:id/image - Upload image for a recipe
Ingredients
•	GET /recipes/:id/ingredients - Get ingredients for a recipe
Pantry
•	GET /pantry - List items
•	POST /pantry - Add item
•	PUT /pantry/:id - Edit item
•	DELETE /pantry/:id - Remove item
Grocery List
•	POST /grocery-list - Generate list based on selected recipe(s)
•	GET /grocery-list - View most recent list
________________________________________
🔺 Wireframe & Frontend Routes
Pages:
•	/login - login form
•	/register - signup form
•	/recipes - view + add/edit recipes
•	/pantry - manage pantry items
•	/grocery-list - dynamically generated list
Components:
•	NavBar
•	RecipeBook
•	RecipeCard 
•	GroceryListTable
•	PantryItemForm
•	IngredientSelector
Routes: React Router used for navigation between pages, with protected routes for logged-in users.
________________________________________
👤 User Stories
1.	As a new user, I want to register and log in securely so that I can access my personal data.
2.	As a returning user, I want to add and edit my own recipes so I can use them for grocery planning.
3.	As a user, I want to add items to my pantry so they aren't added to my grocery list.
4.	As a user, I want to select a recipe and generate a grocery list of missing items so I can shop more efficiently.

#   W h i s k r . B a c k  
 