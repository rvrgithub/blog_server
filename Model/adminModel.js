const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  phoneNumber: { type: Number, require: true },
  role: { type: String, default: "admin" },
  profileImage: { type: String, default: "1694688315354.jfif" },
});


exports.Admin =mongoose.model("Admin" , adminSchema);
