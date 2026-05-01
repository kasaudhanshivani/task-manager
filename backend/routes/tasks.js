import express from "express";
import Task from "../models/Task.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all tasks for a project
router.get("/project/:projectId", protect, async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate("assignedTo", "name email role")
            .populate("project", "name");
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get tasks assigned to logged-in user
router.get("/my", protect, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate("project", "name")
            .populate("assignedTo", "name email");
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Create task - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate, status, project } =
            req.body;

        const task = await Task.create({
            title,
            description,
            assignedTo,
            dueDate,
            status,
            project,
        });

        const populated = await task.populate("assignedTo", "name email role");
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update task status - Admin or assigned member
router.put("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Admin can update anything, member can only update their own task status
        if (
            req.user.role !== "admin" &&
            task.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updated = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("assignedTo", "name email role");

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete task - Admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;