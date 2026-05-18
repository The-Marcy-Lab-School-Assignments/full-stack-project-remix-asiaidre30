// blocks any request that doesn't have a logged-in session
const checkAuthentication = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    // no session = not logged in
    return res.status(401).json({ error: "You must be logged in." });
  }
  next(); // they're logged in, let them through
};

module.exports = checkAuthentication;
