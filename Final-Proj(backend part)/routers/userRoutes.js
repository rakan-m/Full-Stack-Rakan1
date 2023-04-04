const express = require("express");
const router = express.Router();
const user = require("../controllers/userController");
//const recipe = require("../controllers/recipeController");

router.post("/registration", user.registerUsers);

router.post("/login", user.login);

router.post("/forgotPassword", user.forgotPassword);

router.patch("/resetPassword/:token", user.resetPassword); //specific update


module.exports = router;