const { createHmac, randomBytes } = require("crypto");
const mongoose = require("mongoose");
const {createTokeForUser} = require("../services/authentication")

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);


// password ne hashe karava mate 
// this will run before the save the user in the mongoDB.
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashePassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashePassword;

  next();
});


//chake the user is correct or not while signin
userSchema.static("matchPasswordAndGeneratToken", async function(email, password){
  const user = await this.findOne({email});
  if(!user) throw new Error("User is not found");

  const salt = user.salt;
  const hashePassword = user.password;

  const usreProviedHash = createHmac("sha256", salt)
  .update(password)
  .digest("hex");

  if(hashePassword !== usreProviedHash) throw new Error("Incorrect Password");
  
  const token = createTokeForUser(user);
  return token;

});

const User = mongoose.model("user", userSchema);

module.exports = User;
