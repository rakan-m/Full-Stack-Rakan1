const express = require("express");
const router = express.Router(); 
const urlController = require("../Controllers/urlController");



router.post("/url", urlController.URL);

module.exports = router;