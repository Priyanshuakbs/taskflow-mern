const Task = require("../models/Task");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  try {
    let totalTasks;
    let completedTasks;
    let pendingTasks;

    if (req.user.role === "admin") {
      totalTasks = await Task.countDocuments();
      completedTasks = await Task.countDocuments({ status: "Completed" });
      pendingTasks = await Task.countDocuments({ status: "Pending" });
    } else {
      totalTasks = await Task.countDocuments({ assignedTo: req.user.id });
      completedTasks = await Task.countDocuments({
        assignedTo: req.user.id,
        status: "Completed",
      });
      pendingTasks = await Task.countDocuments({
        assignedTo: req.user.id,
        status: "Pending",
      });
    }

    const totalUsers = await User.countDocuments();

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};