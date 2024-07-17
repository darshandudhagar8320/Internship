require('dotenv').config()

const express = require("express");
const path = require("path");
const mongooes = require("mongoose");
const cookieParser = require("cookie-parser");

//import model
const Blog = require("./models/blog");

//import the routes
const UserRouter = require("./routes/user");
const BlogRouter = require("./routes/blog");


//import middleWare
const {
  chackeForAuthenticationCookie,
} = require("./middleware/authentication");

const app = express();
const PORT = process.env.PORT ||8000;

//connect the mongoDB
mongooes
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log("Error:", err);
  });

// set views
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middleware for the data that porvied by user from thr frontend
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(chackeForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

//routes user
app.get("/", async(req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs : allBlogs,
  });
});

app.use("/user", UserRouter);

//router blog
app.use('/blog', BlogRouter);

// set the server
app.listen(PORT, () => console.log("Server started!", PORT));