const pool = require("../db/pool");
const bcrypt = require("bcrypt");

// save a new user to the database — hashes the password first
const createUser = async (username, password) => {
  const hash = await bcrypt.hash(password, 10); // 10 = how hard the hash is to crack
  const result = await pool.query(
    `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id, username`,
    [username, hash],
  );
  return result.rows[0]; // return the new user (no password)
};

// find a user by username — used during login
const findByUsername = async (username) => {
  const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  return result.rows[0]; // returns undefined if not found
};

// find a user by their id — used to rehydrate the session
const findById = async (user_id) => {
  const result = await pool.query(
    `SELECT user_id, username FROM users WHERE user_id = $1`,
    [user_id],
  );
  return result.rows[0];
};

module.exports = { createUser, findByUsername, findById };
