const { Router } = require("express");
const multer = require("multer");
const path = require("path");

//import model
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

//for the uploades
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get('/:id', async (req, res)=>{
  // populate("createdBy") req.body ma createdBy  fild ma   user ni full details add kar se bec. apde schma ma createdBy : ref = user aapel chhe athi automatic user.id == createdBy ma jeni id hoy te add thai jai

  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId :req.params.id}).populate("createdBy");

  res.render('blog',{
    user : req.user,
    blog,
    comments,
  })
})

router.post("/", upload.single("coverImage"), async(req, res) => {
    const {title, body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageUrl:`/uploads/${req.file.filename}`,
        createdBy:req.user._id,
    });
    return res.redirect(`/blog/${blog._id}`);
});

router.post('/comment/:blogId', async(req, res)=>{
  const comment = await Comment.create({
    content : req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

//export
module.exports = router;
