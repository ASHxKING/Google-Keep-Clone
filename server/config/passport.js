const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Check if user already exists by google_id
        let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);

        if (result.rows.length > 0) {
          return done(null, result.rows[0]); // existing Google user
        }

        // Check if email already exists (signed up normally before)
        result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
          // Link Google account to existing email-based account
          const updated = await pool.query(
            'UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *',
            [googleId, email]
          );
          return done(null, updated.rows[0]);
        }

        // Brand new user via Google
        const newUser = await pool.query(
          'INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *',
          [name, email, googleId]
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Required by Passport, even though we won't rely on sessions long-term
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;