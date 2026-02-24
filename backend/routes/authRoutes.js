const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// GET all employees (Admin only)
router.get("/users", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const users = await User.find({ role: "employee" })
      .select("name email");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;