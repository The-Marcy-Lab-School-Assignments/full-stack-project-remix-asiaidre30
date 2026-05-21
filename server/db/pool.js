// load env variables from .env file
require("dotenv").config();

// bring in pg so we can talk to postgres
const { Pool } = require("pg");

// create a connection pool
// if we're on Render (production), turn off SSL certificate verification
const pool = new Pool({
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// share the pool so other files can use it
module.exports = pool;
