const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// Get all employees (admin only)
router.get("/employees", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;