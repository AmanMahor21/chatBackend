var User = require("../model/user.model");

const contactController = async (req, res) => {
  try {
    const senderID = req.user._id;
    // console.log(senderID, "senderId ");
    // const allUsers = user.where(_id).ne(senderID);
    const allUsers = await User.find({ _id: { $ne: senderID } }).select(
      "-password"
    );
    // .populate({ path: "last  Messages" });
    // console.log(allUsers, "i m from controller");
    res.status(200).json(allUsers);
  } catch (error) {
    console.log("Error in contactController controller");
    res.status(500).json({ error, message: "Internal Server Error" });
  }
};

module.exports = contactController;
