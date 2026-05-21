require("dotenv").config(); // load .env first, before anything else

const express = require("express");
const session = require("express-session");
const logRoutes = require("./middleware/logRoutes");
const checkAuthentication = require("./middleware/checkAuthentication");
const authControllers = require("./controllers/authControllers");
const applicationControllers = require("./controllers/applicationControllers");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(logRoutes); // log every request to the terminal
app.use(express.json()); // parse incoming JSON request bodies

// set up sessions — stores a cookie in the browser to track who's logged in
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// serve the built React app as static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ── Auth Routes ───────────────────────────────────────────────────────────────

app.post("/api/auth/register", authControllers.register);
app.post("/api/auth/login", authControllers.login);
app.delete("/api/auth/logout", authControllers.logout);
app.get("/api/auth/me", authControllers.me);
app.patch(
  "/api/applications/:application_id",
  checkAuthentication,
  applicationControllers.updateApplication,
);

// ── Application Routes (must be logged in) ────────────────────────────────────

app.get(
  "/api/applications",
  checkAuthentication,
  applicationControllers.getApplications,
);
app.post(
  "/api/applications",
  checkAuthentication,
  applicationControllers.createApplication,
);
app.delete(
  "/api/applications/:application_id",
  checkAuthentication,
  applicationControllers.deleteApplication,
);

// ── Catch-All: send React app for any unknown route ───────────────────────────

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// ── Global Error Handler ──────────────────────────────────────────────────────

// catches any error passed via next(err) and sends a 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

// ── Start Server ──────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
