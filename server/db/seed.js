// load env variables
require("dotenv").config();

const pool = require("./pool");

// this function drops everything and rebuilds fresh
const seed = async () => {
  try {
    const bcrypt = require("bcrypt");

    // drop tables if they already exist (order matters because of foreign key)
    await pool.query(`DROP TABLE IF EXISTS applications`);
    await pool.query(`DROP TABLE IF EXISTS users`);

    // create the users table
    await pool.query(`
      CREATE TABLE users (
        user_id       SERIAL PRIMARY KEY,
        username      TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

    // create the applications table — each row belongs to one user
    await pool.query(`
      CREATE TABLE applications (
        application_id SERIAL PRIMARY KEY,
        company        TEXT NOT NULL,
        role           TEXT NOT NULL,
        status         TEXT NOT NULL DEFAULT 'applied',
        date_applied   DATE,
        notes          TEXT,
        user_id        INTEGER REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

    // hash both passwords before storing them
    const hash1 = await bcrypt.hash("password123", 10);
    const hash2 = await bcrypt.hash("password123", 10);

    // insert demo users with hashed passwords
    const user1 = await pool.query(
      `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *`,
      ["demoUser", hash1],
    );
    const user2 = await pool.query(
      `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *`,
      ["recruiter", hash2],
    );

    const id1 = user1.rows[0].user_id;
    const id2 = user2.rows[0].user_id;

    // add sample applications for demoUser
    await pool.query(
      `INSERT INTO applications (company, role, status, date_applied, notes, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        "Google",
        "Frontend Engineer",
        "applied",
        "2025-05-01",
        "Applied via LinkedIn",
        id1,
      ],
    );
    await pool.query(
      `INSERT INTO applications (company, role, status, date_applied, notes, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        "Stripe",
        "Full Stack Developer",
        "interviewing",
        "2025-04-28",
        "Phone screen scheduled",
        id1,
      ],
    );

    // add one for recruiter
    await pool.query(
      `INSERT INTO applications (company, role, status, date_applied, notes, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        "Airbnb",
        "Software Engineer",
        "offer",
        "2025-04-15",
        "Negotiating salary",
        id2,
      ],
    );

    console.log("Database seeded successfully!");
    pool.end();
  } catch (err) {
    console.error("Seed failed:", err);
    pool.end();
  }
};

seed();
