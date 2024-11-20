const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Message = require("./message.model");
const messageSchema = require("./message.model");
const conversation = require("./conversation.model");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "other",
    },
    avatar: {
      type: String,
      require: true,
    },
    // lastMessages: [messageSchema],
    messageDay: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      default: null,
      // ref: "Message",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
