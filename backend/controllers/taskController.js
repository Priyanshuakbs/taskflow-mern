const Task = require("../models/Task");

// CREATE TASK (ADMIN ONLY)
exports.createTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create tasks" });
    }

    const task = await Task.create({
  ...req.body,
  file: req.file ? req.file.filename : null,
  createdBy: req.user.id,
});

    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET TASKS (ROLE BASED)
exports.getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo", "name email");
    } else {
      tasks = await Task.find({
        assignedTo: req.user.id,
      }).populate("assignedTo", "name email");
    }

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE TASK (WITH FILE SUPPORT)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If file uploaded
    if (req.file) {
      task.file = req.file.filename;
    }

    // EMPLOYEE → only update status
    if (req.user.role === "employee") {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      task.status = req.body.status || task.status;

      await task.save();
      return res.json(task);
    }

    // ADMIN → full update
    if (req.user.role === "admin") {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.priority = req.body.priority || task.priority;
      task.deadline = req.body.deadline || task.deadline;
      task.status = req.body.status || task.status;
      task.assignedTo = req.body.assignedTo || task.assignedTo;

      await task.save();
      return res.json(task);
    }

    return res.status(403).json({ message: "Not authorized" });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE TASK (ADMIN ONLY)
exports.deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};