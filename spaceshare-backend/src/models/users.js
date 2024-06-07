const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber:{
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["space owner", "user"],
      default: "user",
    },
    spaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Spaces",
      },
    ],

    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { collection: "Users" }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
}); 


userSchema.methods.createPasswordResetToken = function () {
  const resetToken = [...Array(32)]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join("");
  this.passwordResetToken = bcrypt.hashSync(resetToken, 12);
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};
const users = mongoose.model("Users", userSchema);

module.exports = users;
