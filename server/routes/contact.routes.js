const express = require("express");
const authRoute = require("../middleware/authRoute");
const contactController = require("../controller/contact.controller");
const router = express.Router();

router.get("/", authRoute, contactController);

module.exports = router;
