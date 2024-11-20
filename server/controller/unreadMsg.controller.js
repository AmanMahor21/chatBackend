const { default: mongoose } = require("mongoose");
const Message = require("../model/message.model");

const { activeIds, io } = require("../utils/socketIo");
const unreadMsg = async (req, res) => {
  console.log(req.params.id, "Asd");
  // console.log(req.body.recieverID, "kkk");
  const senderID = req.params.id;
  const receiverID = req.body.recieverID;
  // console.log(senderID, "sender");
  // console.log(receiverID, "reciever");

  try {
    const updateResult = await Message.updateMany(
      { senderID, receiverID, read: false },
      { read: true }
    );
    // console.log(`Marked ${updateResult.modifiedCount} messages as read.`);
    const unreadCount = await Message.countDocuments({
      senderID,
      receiverID,
      read: false,
    });
    // console.log(unreadCount, "server");
    // console.log(senderID, "serve55555r");
    const activeUser = activeIds(receiverID);
    if (activeUser) {
      io.to(activeUser).emit("unreadCount", unreadCount, senderID);
    }

    res.status(200).json("Mark unread message count as read");
  } catch (error) {
    console.log("Failed to mark unread message count as read", {
      error: error,
    });
    res.status(500).json("Failed to mark unread message count as read");
  }
};

const getAllUnseenCount = async (req, res) => {
  const receiverId = new mongoose.Types.ObjectId(req.params.id);
  // console.log("Receiver ID:", receiverId);
  try {
    // const testQuery = await Message.find({
    //   receiverID: receiverId,
    //   read: false,
    // });
    // console.log("Test Query Result:", testQuery[testQuery.length - 1]);
    const allUnseenCount = await Message.aggregate([
      {
        $match: {
          receiverID: receiverId,
          read: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$senderID",
          unreadCount: { $sum: 1 },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);
    // console.log(allUnseenCount, "999"),
    // console.log(allUnseenCount, "222");

    res.status(200).json({
      message: "Successfully retrieved all unseen message counts",
      data: allUnseenCount,
    });
  } catch (error) {
    console.log("Failed to get all unseen count message at mount", {
      error: error,
    });
    res.status(500).json("Failed to get all unseen count message at mount");
  }
};
module.exports = { unreadMsg, getAllUnseenCount };
