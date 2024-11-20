const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controller/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// router.get("/register", register);
// router.get("/login", login);
// router.get("/logout", logout);
module.exports = router;
