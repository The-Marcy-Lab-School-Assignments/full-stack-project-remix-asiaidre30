// prints every incoming request to the terminal so you can see what's hitting the server
const logRoutes = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // pass the request along to the next handler
};

module.exports = logRoutes;
