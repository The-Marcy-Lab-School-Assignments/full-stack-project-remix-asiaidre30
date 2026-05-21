const {
  findByUser,
  create,
  remove,
  update,
} = require("../models/applicationModel");

// GET /api/applications — get all applications for the logged-in user
const getApplications = async (req, res) => {
  try {
    const applications = await findByUser(req.session.userId);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/applications — create a new application
const createApplication = async (req, res) => {
  try {
    const { company, role, status, date_applied, notes } = req.body;
    const newApp = await create({
      company,
      role,
      status,
      date_applied,
      notes,
      user_id: req.session.userId, // tie it to whoever is logged in
    });
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/applications/:application_id — delete one application
const deleteApplication = async (req, res) => {
  try {
    const { application_id } = req.params;
    const deleted = await remove(application_id, req.session.userId);
    if (!deleted)
      return res.status(404).json({ error: "Application not found." });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/applications/:application_id — update one application
const updateApplication = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { company, role, status, date_applied, notes } = req.body;
    const updated = await update(
      application_id,
      req.session.userId, // ownership check — can only edit your own
      { company, role, status, date_applied, notes },
    );
    if (!updated)
      return res.status(404).json({ error: "Application not found." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getApplications,
  createApplication,
  deleteApplication,
  updateApplication,
};
