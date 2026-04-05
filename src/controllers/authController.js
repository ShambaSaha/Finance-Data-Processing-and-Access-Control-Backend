const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const allowedRoles = ["viewer", "analyst", "admin"];
  const userRole = allowedRoles.includes(role) ? role : "viewer";

  const user = await User.create({
    name,
    email,
    password: hash,
    role: userRole
  });

  // ✅ Clean response (no password)
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token });
};