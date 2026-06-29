require("dotenv").config();
const pool = require("./pool");

const migrate = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id       SERIAL PRIMARY KEY,
        username      TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        application_id SERIAL PRIMARY KEY,
        company        TEXT NOT NULL,
        role           TEXT NOT NULL,
        status         TEXT NOT NULL DEFAULT 'applied',
        date_applied   DATE,
        notes          TEXT,
        user_id        INTEGER REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

    console.log("Migration complete.");
    pool.end();
  } catch (err) {
    console.error("Migration failed:", err);
    pool.end();
    process.exit(1);
  }
};

migrate();
