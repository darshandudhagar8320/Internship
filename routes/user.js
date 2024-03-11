const { Router } = require("express");
const User = require("../models/user");

const router = Router();

//controllers
router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGeneratToken(email, password);
    console.log("token ", token);
    return res.cookie("token", token).redirect("/");
  } 
  catch (err){
    console.log("Password wrong");
    res.render("signin",{
        error:"Invalid Password"
    });
  }

});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  // create the User
  await User.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
  
});

router.get("/logout",(req, res)=>{
  res.clearCookie("token").redirect("/");
})

//export
module.exports = router;
