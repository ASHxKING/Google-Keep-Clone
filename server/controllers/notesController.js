const pool = require('../config/db');

// CREATE a note
const createNote = async (req, res) => {
  const { title, content, color } = req.body;
  const userId = req.user.userId;

  if (!content) {
    return res.status(400).json({ success: false, message: 'Note content is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO notes (user_id, title, content, color)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, title || '', content, color || '#ffffff']
    );
    res.status(201).json({ success: true, note: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET all notes for logged-in user
const getNotes = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM notes WHERE user_id = $1 ORDER BY is_pinned DESC, created_at DESC`,
      [userId]
    );
    res.status(200).json({ success: true, notes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE a note
const updateNote = async (req, res) => {
  const userId = req.user.userId;
  const noteId = req.params.id;
  const { title, content, color, is_pinned, is_archived } = req.body;

  try {
    // Verify ownership first
    const existing = await pool.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [noteId, userId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const result = await pool.query(
      `UPDATE notes
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           color = COALESCE($3, color),
           is_pinned = COALESCE($4, is_pinned),
           is_archived = COALESCE($5, is_archived),
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [title, content, color, is_pinned, is_archived, noteId, userId]
    );

    res.status(200).json({ success: true, note: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE a note
const deleteNote = async (req, res) => {
  const userId = req.user.userId;
  const noteId = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *',
      [noteId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };