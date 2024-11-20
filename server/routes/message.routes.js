const express = require("express");
const router = express.Router();
const {
  sendMessage,
  receiveMessage,
  allMessages,
} = require("../controller/message.controller");
// const receiveMessage = require("../controller/message.controller");
const authRoute = require("../middleware/authRoute");
const {
  unreadMsg,
  getAllUnseenCount,
} = require("../controller/unreadMsg.controller");

router.get("/login-user/:id", authRoute, allMessages);
router.get("/:id", authRoute, receiveMessage);
router.get("/allUnseenCount/:id", authRoute, getAllUnseenCount);
router.post("/markUnreadMsg/:id", authRoute, unreadMsg);
router.post("/send/:id", authRoute, sendMessage);

module.exports = router;
