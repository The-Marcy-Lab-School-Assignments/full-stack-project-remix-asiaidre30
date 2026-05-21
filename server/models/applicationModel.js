const pool = require("../db/pool");

// get all applications that belong to one user
const findByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM applications WHERE user_id = $1 ORDER BY date_applied DESC`,
    [user_id],
  );
  return result.rows;
};

// add a new application row to the database
const create = async ({
  company,
  role,
  status,
  date_applied,
  notes,
  user_id,
}) => {
  const result = await pool.query(
    `INSERT INTO applications (company, role, status, date_applied, notes, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [company, role, status, date_applied, notes, user_id],
  );
  return result.rows[0];
};

// delete one application — only if it belongs to this user
const remove = async (application_id, user_id) => {
  const result = await pool.query(
    `DELETE FROM applications
     WHERE application_id = $1 AND user_id = $2
     RETURNING *`,
    [application_id, user_id],
  );
  return result.rows[0];
};

// update an application — only if it belongs to this user
const update = async (
  application_id,
  user_id,
  { company, role, status, date_applied, notes },
) => {
  const result = await pool.query(
    `UPDATE applications
     SET company = $1, role = $2, status = $3, date_applied = $4, notes = $5
     WHERE application_id = $6 AND user_id = $7
     RETURNING *`,
    [company, role, status, date_applied, notes, application_id, user_id],
  );
  return result.rows[0]; // returns undefined if application not found or wrong user
};

module.exports = { findByUser, create, remove, update };
