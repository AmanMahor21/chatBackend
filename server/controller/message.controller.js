const Conversation = require("../model/conversation.model");
const Message = require("../model/message.model");
const User = require("../model/user.model");
const { activeIds, io, clickedUser } = require("../utils/socketIo");
const { default: mongoose } = require("mongoose");

const sendMessage = async (req, res) => {
  try {
    const { message, isUserSelected, isSelected } = req.body;
    // console.log(isUserSelected, "122");
    // console.log(isSelected, "isSelected");
    const receiverID = req.params.id;
    const senderID = req.user._id;

    // console.log(clickedUser, "clickedUser clickedUser");
    let one_On_One = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    });

    if (!one_On_One) {
      one_On_One = await Conversation.create({
        participants: [senderID, receiverID],
      });
    }
    const newMessage = await Message.create({
      senderID,
      receiverID,
      message,
      read: false,
      // read: isSelected.selectedUser ? true : false,
    });
    if (newMessage) {
      one_On_One.message.push(newMessage._id);
    }
    await one_On_One.save();

    // console.log(one_On_One._id, "reverid");
    // const updatedUser = await User.findByIdAndUpdate(
    //   receiverID,
    //   { lastMessages: newMessage._id },
    //   { new: true }
    // );
    // console.log(updatedUser, "updated user");

    await res.status(200).json(newMessage);
    const activeUser = activeIds(receiverID);
    // console.log(activeUser, "activer iser");
    if (activeUser) {
      io.to(activeUser).emit("textSend", newMessage);
    }
    // console.log(isSelected.selectedUser);
    // console.log(newMessage.senderID);
    // if (isSelected.selectedUser != newMessage.senderID.toString()) {
    const unreadCount = await Message.countDocuments({
      receiverID,
      senderID,
      read: false,
    });
    // console.log(unreadCount, "ss");
    const senderIDString = senderID.toString(); // Convert ObjectId to string
    // console.log(senderIDString, "ss555");
    io.to(activeUser).emit(
      "unreadCount",
      unreadCount,
      senderIDString,
      newMessage.createdAt
    );
    // }
  } catch (error) {
    console.log("Error in send Message controller");
    res.status(500).json({ error, error: "Internal Server Error" });
  }
};

const receiveMessage = async (req, res) => {
  try {
    const senderID = req.user._id;
    // console.log(senderID, "2222");
    const receiverID = req.params.id;

    let collect_Message = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    }).populate("message");

    if (!collect_Message) {
      return res.status(200).json([]);
    }
    // await collect_Message.save();
    // console.log(collect_Message.message, "collect_Message collect_Message");
    return await res.status(200).json(collect_Message.message);

    // console.log(senderID, receiverID);
  } catch (error) {
    console.log("Error in receiveMessage controller", error);
    res.status(500).json({ error, error: "Internal Server Error" });
  }
};

const allMessages = async (req, res) => {
  const loginUser = new mongoose.Types.ObjectId(req.params.id);

  try {
    const lastMsgDay = await Message.aggregate([
      {
        $match: {
          $or: [{ senderID: loginUser }, { receiverID: loginUser }],
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $lt: ["$senderID", "$receiverID"] },
              then: { sender: "$senderID", receiver: "$receiverID" },
              else: { sender: "$receiverID", receiver: "$senderID" },
            },
          },
          createdAt: { $first: "$createdAt" },
          message: { $first: "$message" },
        },
      },
    ]);

    return await res.status(200).json(lastMsgDay);
  } catch (error) {
    console.log("Error in allMessages controller", error);
    res.status(500).json({ error, error: "Internal Server Error" });
  }
};

module.exports = { sendMessage, receiveMessage, allMessages };
