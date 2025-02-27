import AdminUser from "../../models/AdminUser.js";
import jwt from "jsonwebtoken";

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, username: admin.username, userType: admin.userType },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const authenticateAdmin = (req, res, next) => {
  const adminToken = req.headers.authorization?.split(" ")[1];
  if (!adminToken)
    return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    req.adminUser = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export const registerAdminUser = async (req, res) => {
  const { name, username, password, email, phone } = req.body;

  try {
    const existingUser = await AdminUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new AdminUser({ name, username, password, email, phone });
    await newUser.save();

    const adminToken = generateToken(newUser);

    res.status(201).json({
      message: "Admin user created successfully",
      adminToken,
      adminUser: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        userType: newUser.userType,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating admin user", error: error.message });
  }
};

export const loginAdminUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await AdminUser.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const adminToken = generateToken(admin);

    res.json({
      message: "User Login Successfully",
      adminToken,
      adminUser: {
        id: admin._id,
        username: admin.username,
        userType: admin.userType,
        email: admin.email,
        phone: admin.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAdminUserProfile = async (req, res) => {
  try {
    const admin = await AdminUser.findById(req.adminUser.id).select(
      "-password"
    );
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    res.json({
      id: admin._id,
      name: admin.name,
      username: admin.username,
      email: admin.email,
      phone: admin.phone,
      userType: admin.userType,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
