const express = require("express");
const router = express.Router();
const recipe = require("../controllers/recipeController");
const user = require("../controllers/userController");

router.post("/create/recipe", user.protect, recipe.createRecipe);

router.get("/recipe/search", recipe.recipeSearch);

router.put("/update/recipe/:id", user.protect, recipe.updateRecipe);

router.put("/delete/recipe/:id",  user.protect, recipe.deleteRecipe);

router.patch("/rate/recipe/:id", user.protect, recipe.rateRecipe);

router.put("/update/favorite/:id", user.protect, recipe.favorites);

router.get("/display/favorites", user.protect, recipe.displayFavorites);

module.exports = router;