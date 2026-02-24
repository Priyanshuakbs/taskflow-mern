const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// ADMIN DASHBOARD
router.get("/admin", protect, async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: "Completed" });
    const pending = await Task.countDocuments({ status: "Pending" });
    const users = await User.countDocuments();

    res.json({ total, completed, pending, users });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// EMPLOYEE DASHBOARD
router.get("/employee", protect, async (req, res) => {
  try {
    const total = await Task.countDocuments({
      assignedTo: req.user.id,
    });

    const completed = await Task.countDocuments({
      assignedTo: req.user.id,
      status: "Completed",
    });

    const pending = await Task.countDocuments({
      assignedTo: req.user.id,
      status: "Pending",
    });

    res.json({ total, completed, pending });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;