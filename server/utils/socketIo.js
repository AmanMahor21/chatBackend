const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { userInfo } = require("os");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    credentials: true, // Allow credentials to be sent
  })
);
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const activeUser = {};
io?.on("connection", (socket) => {
  const userId = socket?.handshake?.query?.userId;
  // console.log(userId, "userid");
  if (!userId) {
    console.error("Connection attempt without userId");
    socket.disconnect();
    return;
  }
  activeUser[userId] = socket?.id;

  io.emit("activeUser", Object.keys(activeUser));

  socket.on("selectedUser", (data) => {
    if (activeUser[data?.openUser]) {
      io.to(activeUser[data?.openUser]).emit("sendUser", {
        ...data,
      });
    }
  });
  // socket.on("isSenderSelected", (data) => {
  //   if (activeUser[data.sender]) {
  //     console.log(data, "check");
  //     io.to(activeUser[data.sender]).emit("senderOpened", {
  //       ...data,
  //     });
  //   }
  // });
  socket.on("sendLastMsgInfo", (data) => {
    // console.log(activeUser);
    const { date, unseenMsg, receiver, sender, freshMsg } = data;
    // console.log(sender, "activesuer");
    // console.log(freshMsg, "ac 65  65656 ");
    // console.log(receiver, "receiver");
    // console.log(unseenMsg, " unseenMsg unseenMsg ");
    // if (sender !== freshMsg?.senderID) return;
    // if (freshMsg.length == 0) return;
    // const receiver = freshMsg[freshMsg?.length - 1]?.receiverID;
    // console.log(date, display, "freshMsg freshMsg");
    // io.to(activeUser[]).emit("rcvLastMessage", {
    io.to(activeUser[receiver])?.emit("rcvLastMessage", {
      data,
      // freshMsg,
      // sender,
      // userId,
      // date,
      // display,/
    });
  });

  // let date = new Date();
  // let dateHolder = new Intl.DateT  imeFormat("en-US").format(date);
  // console.log(activeUser, "aa");
  // io.emit("date", dateHolder);

  socket.on("disconnect", () => {
    console.error("user disconnect:", socket.id);
    delete activeUser[userId];
    io.emit("activeUser", Object.keys(activeUser)); // Emit the updated active users list to all clients
    // io.emit("date", dateHolder);
  });
  // console.log(activeUser, "activeUser", "activeUser");
});

io?.on("error", (err) => {
  console.error("Socket error:", err);
});
// console.log(activeUser, "activeUser activeUacser");
const activeIds = (rcv) => {
  const activeMap = Object.keys(activeUser);
  return activeUser[rcv]; // Directly return the socket ID
};
module.exports = { app, httpServer, activeUser, io, activeUser, activeIds };
