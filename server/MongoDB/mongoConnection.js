const mongoose = require("mongoose");
// const { MONGO_URL } = process.env.MONGO_URL;
const dotnev = require("dotenv");
dotnev.config();

const mongoConnection = async () => {
  try {
    console.log("Connected mongo DB");
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoConnection;
