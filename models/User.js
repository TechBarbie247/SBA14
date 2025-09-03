const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  username: { type: String, trim: true },
  password: { type: String },             
  githubId: { type: String, index: true },
}, { timestamps: true });


userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (pw) {
  if (!this.password) return false;
  return bcrypt.compare(pw, this.password);
};

module.exports = model("User", userSchema);