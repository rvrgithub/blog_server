const express = require("express");
// const {upload}=resquire("../index")
const {
  register,
  getAll,
  profile,
  updateProfile,
  createBlog,
  loginBoth,
  checkBoth,
  updateBlog,
  getAllBlog,
  singleBlog,
  deleteBlog,
  approvalBlogs,
  singleUesr,
  getBlogBySingleUser,
  getSelfBlog,
} = require("../Controller/userController");
const { auth, authAdmin } = require("../middleware/middleware");
const {
  adminRegister,
  updateBlogByA,
  approve,
  approvAll,
  deleteBlogByA,
  deleteUserByA,
  adminProfile,
  pendingBlog,
  getAdminBlog,
} = require("../Controller/adminController");
const route = express.Router();

// ...............................
route.post("/register", register);
route.get("/getAll/user", getAll);
route.get("/profile", auth, profile);
route.put("/updateProfile", auth, updateProfile);
route.post("/create/blog", auth, createBlog);
route.delete("/delete/blog/:id", auth, deleteBlog);
//..............................  Admin Section ......................
route.get("/admin/profile", authAdmin, adminProfile);

route.post("/admin/register", authAdmin, adminRegister);
route.put("/admin/approve/:id", authAdmin, approve);
route.put("/approvAll", authAdmin, approvAll);
route.delete("/admin/delete/blog/:id", authAdmin, deleteBlogByA);
route.delete("/admin/delete/user/:id", authAdmin, deleteUserByA);
// .............................. find both [admin and user] in login.............................

route.post("/findBothLogin", loginBoth);

//  ............................ Blog Section......................

route.get("/getAllBlog", auth, getAllBlog);
route.get("/single/blog/:id", singleBlog);
route.get("/", approvalBlogs);
route.get("/admin/pending/blog", pendingBlog);
route.get("/single/uesr/:id", singleUesr);
route.get("/sinlgeUser/blog/:id", getBlogBySingleUser);
route.get("/getself/blog", auth, getSelfBlog);
route.get("/admin/getself/blog", authAdmin, getAdminBlog);
module.exports = { route };
