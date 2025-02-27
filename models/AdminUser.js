import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AdminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: { type: String },
  phone: { type: String },
  userType: { type: String, enum: ["admin"], default: "admin" },
});

AdminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminUserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

AdminUserSchema.methods.generateAdminToken = function () {
  const payload = {
    id: this._id,
    username: this.username,
    userType: this.userType,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

AdminUserSchema.statics.verifyAdminToken = function (adminToken) {
  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

export default mongoose.model("AdminUser", AdminUserSchema);
