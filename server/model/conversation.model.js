// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
const User = require("./user.model");
const Message = require("./message.model");
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    message: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Message,
        default: [],
      },
    ],
  },
  { timestamps: true }
);
const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
