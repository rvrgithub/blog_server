const { response } = require("express");
const { Blog } = require("../Model/blogModel");
const { User } = require("../Model/userModel");
const { isValidEmail, isValidPwd, isValidName } = require("../Util/validation");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
var jwt = require("jsonwebtoken");
const { Admin } = require("../Model/adminModel");
exports.register = async (req, res) => {

  const { email, name, password, phoneNumber } = req.body;
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(401).send({
        stauts: false,
        massage: "All Credientials Are Required 1.. !!",
      });
    }

    // .......................All Credientials Are Required....................
    if (!name || !email || !password || !phoneNumber) {
      return res.status(401).send({
        stauts: false,
        massage: "All Credientials Are Required.. !!",
      });
    }
    //.......................error inside name.......................
    if (!isValidName(name)) {
      return res.status(401).send({
        stauts: false,
        massage: "Only String valid !!",
      });
    }

    //  .......................error inside email .......................
    if (!isValidEmail(email)) {
      console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "email is not valid !!",
      });
    }

    // ....................... error inside password .......................
    if (!isValidPwd(password)) {
      console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "password is not valid !!",
      });
    }

    // ....................find user  ..................................
    const checkPassword = await User.findOne({ email });
    // console.log("chec" ,checkPassword);

    //  .......................chack user if alreay register ........
    if (checkPassword) {
      return res.status(401).json({
        stauts: false,
        massage: "already register!!",
      });
    } else {
      // .......................create password strong ......
      const hasmapPassword = await bcrypt.hash(password, 10);
      const response = new User({
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

//  Login Section ....

exports.getAllUser = async (req, res) => {
  try {
    // console.log("req.body")
    const response = await User.find();
    // await response.save();
    return res.status(201).send({
      status: true,
      massage: "data get",
      response,
    });
  } catch (error) {
    return res.status(401).send({
      status: false,
      massage: "data not get",
    });
  }
};

exports.profile = async (req, res) => {
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

exports.updateProfile = async (req, res) => {
  const { email, password, phoneNumber, name } = req.body;
  const encryptPwd = await bcrypt.hash(password, 10);

  // console.log("req.user",req.user,req.body)
  try {
    const response = await User.updateOne(
      { _id: req.user._id },
      { $set: { email, password: encryptPwd, name, phoneNumber } }
    );

    return res.status(201).send({
      status: true,
      massage: "data get",
      response,
    });
  } catch (error) {
    return res.status(401).send({
      status: false,
      massage: "data not get",
    });
  }
};

// ..................  Blog Section...............................

exports.createBlog = async (req, res) => {
  try {
    const user = req.user;
    if (user.role == "admin") {
      const reponse = new Blog({
        title: req.body.title,
        image: req.file.filename,
        descriptions: req.body.descriptions,
        user: req.user._id,
        status: "approve",
      });
      await reponse.save();
      res.json({ status: true, message: reponse });
    } else {
      const reponse = new Blog({
        title: req.body.title,
        image: req.file.filename,
        descriptions: req.body.descriptions,
        user: req.user._id,
      });
      await reponse.save();
      res.json({ status: true, message: reponse });
    }
  } catch (error) {
    res.json("false");
  }
};

exports.updateBlog = async (req, res) => {
  const userFind = req.user;
  const { title, descriptions } = req.body;
  const id = req.params.id;
  const findBlog = await Blog.findOne({ _id: id, user: req.user._id });
  // console.log("findblog", findBlog);

  const checkValueImage = req.file.filename
    ? req.file.filename
    : findBlog.image;
  const checkValueTitle = title ? title : findBlog.title;
  const checkValueDescriptions = descriptions
    ? descriptions
    : findBlog.descriptions;

  const updatBlog = await Blog.updateOne(
    { _id: id, user: req.user._id },
    {
      $set: {
        title: checkValueTitle,
        descriptions: checkValueDescriptions,
        image: checkValueImage,
      },
    }
  );
  try {
    return res.status(201).send({
      status: true,
      massage: "blog is updated",
      updatBlog,
    });
  } catch (error) {
    return res.status(401).send({
      status: false,
      massage: "blog error",
    });
  }
};

exports.getAllBlog = async (req, res) => {
  const getuser = req.user;
  // console.log("getUSer", getuser);

  try {
    const allBlog = await Blog.find({ user: getuser.id }).sort({
      createdAt: -1,
    });
    return res.status(201).send({
      status: true,
      // data: allBlog[0].blogs,
      allBlog,
    });
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: "Error in getting blog...",
      error,
    });
  }
};

exports.getSelfBlog = async (req, res) => {
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

//  ........by id ....................
exports.singleBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const singleBlog = await Blog.findOne({ _id: id });
    return res.status(201).send({
      status: true,
      singleBlog,
    });
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: "Error in getting blog...",
      error,
    });
  }
};

// ................

exports.loginBoth = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(401).send({
        status: false,
        massage: "Fill All Credientials...",
      });
    } // all are empty..
    if (!email || !password) {
      return res.status(401).send({
        status: false,
        massage: "All Credientials are needed...",
      }); // if any one is empty..
    }
    const userLogin = await User.findOne({ email });
    if (userLogin && (await bcrypt.compare(password, userLogin.password))) {
      let token = jwt.sign({ id: userLogin._id }, "radhika");
      return res.status(200).send({
        status: true,
        massage: "Login Successfull !!",
        token,
        // userLogin,
        role: userLogin.role,
      });
    } else {
      const adminLogin = await Admin.findOne({ email });
      if (!adminLogin) {
        return res.status(400).send({
          status: false,
          massage: "Please Register First !!",
        });
      }
      if (adminLogin && (await bcrypt.compare(password, adminLogin.password))) {
        let token = jwt.sign({ id: adminLogin._id }, "radhika");
        return res.status(200).send({
          status: true,
          massage: "Login Successfull !!",
          token,
          role: adminLogin.role,
        });
      } else {
        res.status(403).json("invalid credential");
      }
    }
  } catch (error) {
    return res.status(400).send({
      status: false,
      massage: error.massege,
      error,
    });
  }
};

exports.approvalBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "approve" })
      .populate("user")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      status: true,
      massage: "approve blogs ",
      blogs,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      massage: "something error",
      error,
    });
  }
};

exports.singleUesr = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("id" ,id)
    const response = await User.findOne({ _id: id });
    // console.log("response",response)
    return res.status(200).send({
      status: true,
      massage: "approve response ",
      response,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      massage: "something error",
      error,
    });
  }
};

exports.getBlogBySingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Blog.find({ user: id });
    return res.status(200).send({
      status: true,
      response,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      massage: "something error",
      error,
    });
  }
};

// ....................... extra code  ....

// exports.login = async (req, res) => {
//   const { email, password, id } = req.body;
//   try {
//     if (!email || !password) {
//       return res.status(401).json({
//         stauts: false,
//         massage: "Fill All Credientials",
//       });
//     }
//     //  .......................error inside email .......................
//     if (!isValidEmail(email)) {
//       //   console.log("email is not valid");
//       return res.status(401).send({
//         stauts: false,
//         massage: "email is not valid !!",
//       });
//     }

//     // ....................... error inside password .......................
//     if (!isValidPwd(password)) {
//       //   console.log("all are required");
//       return res.status(401).send({
//         stauts: false,
//         massage: "password is not valid !!",
//       });
//     }

//     //.................find user ....................
//     const findUser = await User.findOne({ email });
//     console.log("user", findUser);

//     // ................. check user.........................
//     if (!findUser) {
//       return res.status(401).json({
//         stauts: false,
//         massage: "User Not Found Please Register !!",
//       });
//     } else {
//       //  ............... check passowrd  ............
//       const matchPasswrod = await bcrypt.compare(password, findUser.password);
//       //   console.log("matchPasswrod", matchPasswrod);
//       // ..........................Match Password......................
//       if (!matchPasswrod) {
//         return res.status(401).json({
//           stauts: false,
//           massage: "Password and Email Not Match!!",
//         });
//       } else {
//         // ...........................create Token..................................
//         const token = jwt.sign({ id: findUser._id }, "dsjglsdkjhgkldjfg");
//         console.log("token", token);
//         return res.status(201).json({
//           stauts: true,
//           massage: "Login Successfully !!",
//           token,
//         });
//       }
//     }
//   } catch (error) {
//     return res.status(401).json({
//       stauts: false,
//       massage: "Something Wrong !!",
//       error,
//     });
//   }
// };

// exports.loginBoth = async (req, res) => {
//   const { email, password } = req.body;
//   // console.log("email,password", email, password);
//   try {
//     // ...................
//     if (!email || !password) {
//       return res.status(401).json({
//         stauts: false,
//         massage: "Fill All Credientials",
//       });
//     }

//     //  .......................error inside email .......................
//     if (!isValidEmail(email)) {
//       //   console.log("email is not valid");
//       return res.status(401).send({
//         stauts: false,
//         massage: "email is not valid !!",
//       });
//     }
//     // ....................... error inside password .......................
//     if (!isValidPwd(password)) {
//       //   console.log("all are required");
//       return res.status(401).send({
//         stauts: false,
//         massage: "password is not valid !!",
//       });
//     }
//
//     // .................... find user In Admin ..............
//     const findEmailAdmin = await Admin.findOne({ email, password });

//     console.log("findemail", findEmailAdmin);
//     // if we want only admin  .. data ...
//     if (findEmailAdmin !== null) {
//       // const reposne = new Admin(req.body);
//       console.log("reposne", reposne);

//       // const matchPasswrodAdmin = await bcrypt.compare(password, findEmailAdmin.password);
//       // console.log("passwordAdmin" ,matchPasswrodAdmin )
//       return res.status(201).send({
//         status: true,
//         findEmailAdmin,
//       });
//     } else if (findEmailAdmin === null) {
//       const findEmailUser = await User.findOne({ email, password });
//       if (findEmailUser !== null) {
//         const reposne = new User(req.body);
//         console.log("reposne", reposne);
//         return res.status(201).send({
//           status: true,
//           findEmailUser,
//         });
//       } else {
//         return res.status(401).send({
//           status: false,
//           message: "no found data in user",
//         });
//       }
//     } else {
//       return res.status(401).send({
//         status: false,
//         message: "no found data in admin",
//       });
//     }
//   } catch (error) {
//     return res.status(401).send({
//       status: false,
//       message: "something error",
//     });
//   }
// };

exports.checkBoth = async (req, res) => {
  const { email, password } = req.body;
  // console.log("email,password", email, password);
  try {
    // ...................
    if (!email || !password) {
      return res.status(401).json({
        stauts: false,
        massage: "Fill All Credientials",
      });
    }

    //  .......................error inside email .......................
    if (!isValidEmail(email)) {
      //   console.log("email is not valid");
      return res.status(401).send({
        stauts: false,
        massage: "email is not valid !!",
      });
    }
    // ....................... error inside password .......................
    if (!isValidPwd(password)) {
      //   console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "password is not valid !!",
      });
    }

    // ....................
    const findEmailAdmin = await Admin.findOne({ email, password });

    // if we want only admin  .. data ...
    if (findEmailAdmin !== null) {
      const reposne = new Admin(req.body);
      return res.status(201).send({
        status: true,
        findEmailAdmin,
      });
    } else if (findEmailAdmin === null) {
      const findEmailUser = await User.findOne({ email, password });
      if (findEmailUser !== null) {
        const reposne = new User(req.body);
        return res.status(201).send({
          status: true,
          findEmailUser,
        });
      } else {
        return res.status(401).send({
          status: false,
          message: "no found data",
        });
      }
    } else {
      return res.status(401).send({
        status: false,
        message: "no found data",
      });
    }
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: "something error",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    // console.log("req.body")
    const response = await User.find();

    // await response.save();
    return res.status(201).send({
      status: true,
      massage: "data get",
      response,
    });
  } catch (error) {
    return res.status(401).send({
      status: false,
      massage: "data not get",
    });
  }
};

// ..................  Blog Section...............................

// exports.createBlog = async (req, res) => {
//   // console.log("asfg l")
//   try {
//     const user = req.user;
//     console.log("user", user._id);
//     const reponse = new Blog({
//       title: req.body.title,
//       image: req.body.image,
//       descriptions: req.body.descriptions,
//       user: req.user._id,
//     });
//     await reponse.save();
//     res.json(reponse);
//   } catch (error) {
//     res.json("false");
//   }
// };

// exports.updateBlog = async (req, res) => {
//   const userFind = req.user;
//   console.log("userfind", userFind);
//   const { title, descriptions, image } = req.body;
//   console.log("title", title, descriptions, image);
//   const id = req.params.id;
//   const findBlog = await Blog.findOne({ _id: id, user: req.user._id });
//   // console.log("findblog", findBlog);

//   const checkValueImage = image ? image : findBlog.image;
//   const updatBlog = await Blog.updateOne(
//     { _id: id, user: req.user._id },
//     { $set: { title, descriptions, image: checkValueImage } }
//   );
//   try {
//     return res.status(201).send({
//       status: true,
//       massage: "blog is updated",
//       updatBlog,
//     });
//   } catch (error) {
//     return res.status(401).send({
//       status: false,
//       massage: "blog error",
//     });
//   }
// };

// exports.getAllBlog = async (req, res) => {
//   const getuser = req.user;
//   // console.log("getUSer", getuser);

//   try {
//     const allBlog = await Blog.find({ user: getuser.id });
//     console.log("allblog", allBlog);
//     return res.status(201).send({
//       status: true,
//       // data: allBlog[0].blogs,
//       allBlog,
//     });
//   } catch (error) {
//     return res.status(401).send({
//       status: false,
//       message: "Error in getting blog...",
//       error,
//     });
//   }
// };

// //  ........by id ....................
// exports.singleBlog = async (req, res) => {
//   const id = req.params.id;
//   console.log("id....", id);
//   try {
//     const singleBlog = await Blog.findOne({ _id: id, user: req.user._id });
//     console.log("singleBlog", singleBlog);
//     return res.status(201).send({
//       status: true,
//       singleBlog,
//     });
//   } catch (error) {
//     return res.status(401).send({
//       status: false,
//       message: "Error in getting blog...",
//       error,
//     });
//   }
// };

exports.deleteBlog = async (req, res) => {
  console.log("qjdnaw");
  try {
    const blogId = req.params.id;
    console.log("id", blogId);
    const findBlog = Blog.findOne({ _id: blogId });
    if (!findBlog) {
      return res.status(401).send({
        status: false,
        message: "Blog is not found ...",
      });
    } else {
      const blog = await Blog.deleteOne({ _id: blogId });
      return res.status(201).send({
        status: true,
        message: "delete blog...",
        blog,
      });
    }
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: "Error in deleting blog...",
      error,
    });
  }
};
// ................

// exports.loginBoth = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (Object.keys(req.body).length === 0) {
//       return res.status(401).send({
//         status: false,
//         massage: "Fill All Credientials...",
//       });
//     } // all are empty..
//     if (!email || !password) {
//       return res.status(401).send({
//         status: false,
//         massage: "All Credientials are needed...",
//       }); // if any one is empty..
//     }
//     const userLogin = await User.findOne({ email });
//     if (userLogin && (await bcrypt.compare(password, userLogin.password))) {
//       let token = jwt.sign({ id: userLogin._id }, "radhika");
//       return res.status(200).send({
//         status: true,
//         massage: "Login Successfull !!",
//         token,
//         userLogin,
//       });
//     } else {
//       const adminLogin = await Admin.findOne({ email });
//       if (!adminLogin) {
//         return res.status(400).send({
//           status: false,
//           massage: "Please Register First !!",
//         });
//       }
//       if (adminLogin && (await bcrypt.compare(password, adminLogin.password))) {
//         let token = jwt.sign({ id: adminLogin._id }, "radhika");
//         return res.status(200).send({
//           status: true,
//           massage: "Login Successfull !!",
//           token,
//           adminLogin,
//         });
//       } else {
//         res.status(403).json("invalid credential");
//       }
//     }
//   } catch (error) {
//     return res.status(400).send({
//       status: false,
//       massage: "<h1>hello</h1>",
//       error,
//     });
//   }
// };
exports.uploadImage = async (req, res) => {
  try {
    let profileImage = req.file.filename;

    let updateUserProfile = await User.updateOne(
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
