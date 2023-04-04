const express = require("express");
const router = express.Router();
const category = require("../controllers/categoryController");
const user = require("../controllers/userController");

router.post("/create/category", user.protect, category.createCategory);

router.get("/display/recipesByCategory/:categoryName", user.protect, category.recipesByCategory);

router.put("/update/category/:categoryName", user.protect, category.updateCategory);

router.put("/delete/category/:categoryName", user.protect, category.deleteCategory);

module.exports = router;  