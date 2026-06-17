// load env variables from .env file
require("dotenv").config();

// bring in pg so we can talk to postgres
const { Pool } = require("pg");

// create a connection pool
// in production use the full connection string; locally use individual PG* env vars
const pool = new Pool(
  process.env.PG_CONNECTION_STRING
    ? {
        connectionString: process.env.PG_CONNECTION_STRING,
        ssl: { rejectUnauthorized: false },
      }
    : { ssl: false },
);

// share the pool so other files can use it
module.exports = pool;
