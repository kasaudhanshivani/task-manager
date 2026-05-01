import express from "express";
import Project from "../models/Project.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all projects
router.get("/", protect, async (req, res) => {
    try {
        const projects = await Project.find().populate("createdBy", "name email");
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get single project
router.get("/:id", protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate(
            "createdBy",
            "name email"
        );
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Create project - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = await Project.create({
            name,
            description,
            createdBy: req.user._id,
        });

        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update project - Admin only
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete project - Admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;