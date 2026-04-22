const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all user boards
// @route   GET /api/boards
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const boards = await Board.find({ user: req.user.id });
        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a board
// @route   POST /api/boards
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, description } = req.body;

    try {
        const board = await Board.create({
            name,
            description,
            user: req.user.id,
        });
        res.status(201).json(board);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a board
// @route   PUT /api/boards/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Make sure user owns board
        if (board.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        board = await Board.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(board);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a board
// @route   DELETE /api/boards/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Make sure user owns board
        if (board.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Delete all tasks associated with this board
        await Task.deleteMany({ board: req.params.id });
        
        await board.deleteOne();
        res.json({ message: 'Board and associated tasks removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
