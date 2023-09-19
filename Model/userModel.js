const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  phoneNumber: { type: Number, require: true },
  role: { type: String, default: "user" },
  profileImage: { type: String, default: "1694688315354.jfif" },
});


exports.User =mongoose.model("User" , userSchema);