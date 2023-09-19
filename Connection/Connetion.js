// const mongoose= require("mongoose");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// dotenv.config({ path: "../config/config.env" });
dotenv.config();
// console.log(process.env.MONGOOSE_URL)
exports.Connection = () => {
  try {
    mongoose
    .connect(process.env.MONGOOSE_URL, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then((data) => {
      console.log("connection is successfull");
    })
    .catch((err) => {
      console.log("No connection", err);
    });
  } catch (error) {
    console.log("No connection", error);
  }
};
