import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all users - for task assignment dropdown
router.get("/", protect, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single user profile
router.get("/me", protect, async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user - Admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;