const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");
// const multer = require("multer");
var multer = require("multer");
const { route } = require("./route/route");
const { auth, authAdmin } = require("./middleware/middleware");
const {
  createBlog,
  updateBlog,
  uploadImage,
} = require("./Controller/userController");
const { Connection } = require("./Connection/Connetion");
const {
  updateBlogByA,
  adminUploadImage,
} = require("./Controller/adminController");

app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
app.use("/uploads", express.static("uploads"));
let upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  // console.log(req.file);
  res.send("sucess");
});

app.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, "upload", filename));
});

app.post("/create/blog", upload.single("image"), auth, createBlog);
app.post("/admin/create/blog", upload.single("image"), authAdmin, createBlog);

route.put(
  "/update/blogBy/admin/:id",
  upload.single("image"),
  authAdmin,
  updateBlogByA
);
route.put("/updateBlog/:id", upload.single("image"), auth, updateBlog);

route.put("/profile/image/upload/", upload.single("image"), auth, uploadImage);
route.put(
  "/admin/profile/image/upload/",
  upload.single("image"),
  authAdmin,
  adminUploadImage
);

app.use("/", route);
app.listen(4500, () => {
  Connection();
  // console.log("server");
});
