const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get task summary for dashboard
// @route   GET /api/tasks/summary/user
// @access  Private
router.get('/summary/user', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        const summary = {
            total: tasks.length,
            todo: tasks.filter(t => t.status === 'To Do').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            completed: tasks.filter(t => t.status === 'Completed').length,
        };
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all tasks for a board
// @route   GET /api/tasks/:boardId
// @access  Private
router.get('/:boardId', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ board: req.params.boardId, user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, status, priority, deadline, boardId } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            deadline,
            board: boardId,
            user: req.user.id,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Make sure user owns task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Make sure user owns task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
