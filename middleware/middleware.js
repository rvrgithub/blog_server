const { User } = require("../Model/userModel");
const { Admin } = require("../Model/adminModel");
var jwt = require("jsonwebtoken");
exports.auth = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
    return res.status(400).json("Invalid token");
  }
  if (req.headers.authorization.startsWith("Bearer") == false) {
    return res.status(400).json("Invalid token");
  }
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "radhika");
  const findUser = await User.findOne({ _id: decode.id });
  
  if (findUser) {
    // console.log("userFind", findUser);
    req.user = findUser;
  } else {
    const findAdmin = await Admin.findOne({ _id: decode.id });
    if (!findAdmin) {
      return res.status(401).send({
        status: false,
        message: "Invalid Token",
      });
    } else {
      // console.log("findAdmin", findAdmin);
      req.user = findAdmin;
    }
  }
  next();
};

exports.authAdmin = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).json("Invalid token");
  }
  if (req.headers.authorization.startsWith("Bearer") == false) {
    return res.status(400).json("Invalid token");
  }
  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, "radhika");
  const findAdmin = await Admin.findOne({ _id: decode.id });
  if (!findAdmin) {
    return res.status(401).send({
      status: false,
      message: "Invalid Token",
    });
  } else {
    req.user = findAdmin;
  }
  next();
};
