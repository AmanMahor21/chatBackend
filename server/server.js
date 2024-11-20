const express = require("express");
// const app = express();
const cors = require("cors");
const mongoConnection = require("./MongoDB/mongoConnection");
const dotnev = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const messageRoutes = require("./routes/message.routes");
const contactRoutes = require("./routes/contact.routes");
const bodyParser = require("body-parser");
const { app, httpServer } = require("./utils/socketIo");

dotnev.config();
const port = process.env.SERVER_PORT || 8080;

app.use(express.json()); 
app.use(cookieParser());
app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
// app.use("/api/allMessages", messageRoutes);
app.use("/api/users", contactRoutes);

httpServer.listen(port, async () => {
  await mongoConnection();
  console.log("mongo connedted");
  console.log(`I m listenig ${port}`);
});
