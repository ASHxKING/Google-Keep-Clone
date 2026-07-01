const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const pool = require('./config/db');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://google-keep-clone-self-iota.vercel.app/'],
  credentials: true,
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  res.send('Google Keep Clone API is running');
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});