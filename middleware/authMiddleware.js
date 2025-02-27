import AdminUser from "../models/AdminUser.js";
import User from "../models/client/User.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    if (req.headers.isadmin === "true") {
      next();
    } else {
      const token = req.headers.authorization.replace("Bearer ", "");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user;
      user = await User.findById(decoded.id);

      if (!user) {
        throw new Error();
      }

      req.user = user;
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const adminAuthMiddleware = async (req, res, next) => {
  const adminToken = req.headers.authorization.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    let user;
    user = await AdminUser.findById(decoded.id);

    // if (role === "admin") {
    //   user = await Admin.findById(decoded.id);
    // } else if (role === "user") {
    //   user = await User.findById(decoded.id);
    // }

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
