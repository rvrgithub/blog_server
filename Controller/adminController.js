const { Admin } = require("../Model/adminModel");
const { Blog } = require("../Model/blogModel");
const { User } = require("../Model/userModel");
const { isValidName, isValidEmail, isValidPwd } = require("../Util/validation");
const bcrypt = require("bcrypt");
exports.adminRegister = async (req, res) => {
  const { email, name, password, phoneNumber } = req.body;
  // console.log("req.body ", req.body);
  try {
    if (Object.keys(req.body).length === 0) {
      // console.log("req.body");
      return res.status(401).send({
        stauts: false,
        massage: "All Credientials Are Required.. !!",
      });
    }

    // .......................All Credientials Are Required....................
    if (!name || !email || !password) {
      // console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "All Credientials Are Required.. !!",
      });
    }
    //.......................error inside name.......................
    if (!isValidName(name)) {
      // console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "Only String valid !!",
      });
    }

    //  .......................error inside email .......................
    if (!isValidEmail(email)) {
      // console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "email is not valid !!",
      });
    }

    // ....................... error inside password .......................
    if (!isValidPwd(password)) {
      // console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "password is not valid !!",
      });
    }

    // ....................find Admin  ..................................
    const checkPassword = await Admin.findOne({ email });
    // console.log("chec" ,checkPassword);

    //  .......................chack Admin if alreay register ........
    if (checkPassword) {
      return res.status(401).json({
        stauts: false,
        massage: "already register!!",
      });
    } else {
      // .......................create password strong ......
      const hasmapPassword = await bcrypt.hash(password, 10);
      // console.log("hasjhg ", hasmapPassword);
      const response = new Admin({
        name,
        password: hasmapPassword,
        email,
        phoneNumber,
      });

      await response.save();
      return res.status(201).json({
        stauts: true,
        massage: "register succesfully!!",
        response,
      });
    }
  } catch (error) {
    return res.status(401).json({
      stauts: false,

      massage: "Something Wrong !!",
      error,
    });
  }
};

// ........................ update blog by admin..........................

exports.updateBlogByA = async (req, res) => {
  const blogId = req.params.id;
  const findBlog = await Blog.findOne({ _id: blogId });
  try {
    const { title, descriptions } = req.body;
    const checkValueImage = req.file ? req.file.filename : findBlog.image;
    const checkValueTitle = title ? title : findBlog.title;
    const checkValueDescriptions = descriptions
      ? descriptions
      : findBlog.descriptions;

    const updatBlog = await Blog.updateOne(
      { _id: blogId },
      {
        $set: {
          title: checkValueTitle,
          descriptions: checkValueDescriptions,
          image: checkValueImage,
        },
      }
    );

    // const response = await Blog.updateOne(
    //   { _id: blogId },
    //   { $set: { title, image, descriptions } }
    // );
    return res.status(201).json({
      stauts: true,
      massage: "Something is Good !!",
    });
  } catch (error) {
    return res.status(500).json({
      stauts: false,
      massage: "Something Wrong !!",
      error,
    });
  }
};

exports.approve = async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.updateOne(
    { _id: blogId },
    { $set: { status: "approve" } }
  );
  try {
    return res.status(200).json({
      stauts: true,
      massage: "is good to know !!",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      stauts: false,
      massage: "Something Wrong !!",
      error,
    });
  }
};

exports.pendingBlog = async (req, res) => {
  try {
    const response = await Blog.find({ status: "pending" }).populate("user");
    // console.log("response",response);
    return res.status(200).send({
      status: true,
      response,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      massage: "somthine wrong !!",
      error,
    });
  }
};

// ............. update state ...............
exports.approvAll = async (req, res) => {
  try {
    const updateAll = await Blog.updateMany(
      { status: "pending" },
      { $set: { status: "approve" } }
    );
    // console.log("update All", updateAll);
    return res.status(200).json({
      stauts: true,
      massage: "is good to know !!",
      updateAll,
    });
  } catch (error) {
    return res.status(500).json({
      stauts: false,
      massage: "Something Wrong !!",
      error,
    });
  }
};

exports.deleteBlogByA = async (req, res) => {
  try {
    const blogId = req.params.id;
    // const findBlog = await Blog.findOne({ _id: blogId });
    // console.log("findBlog", findBlog);
    // if (!findBlog) {
    //   return res.status(500).json({
    //     stauts: false,
    //     massage: "No Blog found here !!",
    //   });
    // } else {
    const deleteBlog = await Blog.deleteOne({ _id: blogId });
    return res.status(500).json({
      stauts: true,
      massage: "delete Blog Succesfully !!",
      deleteBlog,
    });
    // }
    // const
  } catch (error) {
    return res.status(500).json({
      stauts: false,
      massage: "Something Wrong !!",
      error,
    });
  }
};

exports.deleteUserByA = async (req, res) => {
  try {
    const userId = req.params.id;
    const findUser = await User.findOne({ _id: userId });
    if (!findUser) {
      return res.status(500).json({
        stauts: false,
        massage: "No User found here !!",
      });
    } else {
      const deleteUser = await User.deleteOne({ _id: userId });
      await Blog.deleteMany({ user: userId });

      return res.status(500).json({
        stauts: true,
        massage: "delete USer Succesfully !!",
        deleteUser,
      });
    }
    // const
  } catch (error) {
    return res.status(500).json({
      stauts: false,
      massage: "Something Wrong !!",
      error,
    });
  }
};

exports.adminProfile = async (req, res) => {
  try {
    const getUserId = req.user;
    return res.status(201).send({
      status: true,
      massage: "data get",
      getUserId,
    });
  } catch (error) {
    return res.status(401).send({
      status: false,
      massage: "data not get",
    });
  }
};

exports.getAdminBlog = async (req, res) => {
  const findUser = req.user;
  try {
    let response = await Blog.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(201).send({
      status: true,
      response,
    });
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: "Error in getting blog...",
      error,
    });
  }
};

exports.adminUploadImage = async (req, res) => {
  try {
    let profileImage = req.file.filename;

    let updateUserProfile = await Admin.updateOne(
      { _id: req.user._id },
      { $set: { profileImage: profileImage } }
    );

    res.status(200).json({ status: true, message: "Profile Image updated" });
  } catch (error) {
    return res.status(400).send({
      status: false,
      error,
    });
  }
};
