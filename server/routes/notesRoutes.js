const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { createNote, getNotes, updateNote, deleteNote } = require('../controllers/notesController');

// All notes routes require authentication
router.use(authenticateToken);

router.post('/', createNote);
router.get('/', getNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;