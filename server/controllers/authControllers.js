const bcrypt = require("bcrypt");
const { createUser, findByUsername, findById } = require("../models/userModel");

// POST /api/auth/register — create a new account
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    req.session.userId = user.user_id; // save their id in the session cookie
    res.status(201).json(user);
  } catch (err) {
    // username already taken triggers a unique constraint error
    res.status(400).json({ error: "Username already taken." });
  }
};

// POST /api/auth/login — log into an existing account
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findByUsername(username);

    // if no user found, or password doesn't match — send the same vague error (security)
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    req.session.userId = user.user_id; // save their id in the session
    res.json({ user_id: user.user_id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/auth/logout — end the session
const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid"); // remove the session cookie from the browser
    res.json({ message: "Logged out." });
  });
};

// GET /api/auth/me — check who is currently logged in
const me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json(null); // no session = no user
    }
    const user = await findById(req.session.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, logout, me };
