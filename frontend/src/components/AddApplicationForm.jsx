import { useState } from "react";
import { createApplication } from "../adapters/application-adapters";

// form to create a new job application
export default function AddApplicationForm({ onAdd }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("applied");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // toggle showing/hiding the form
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createApplication({
      company,
      role,
      status,
      date_applied: dateApplied,
      notes,
    });

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // clear the form after success
    setCompany("");
    setRole("");
    setStatus("applied");
    setDateApplied("");
    setNotes("");
    setIsOpen(false);

    // tell ApplicationPage to refetch the list
    onAdd();
  };

  return (
    <div className="form-section">
      <button className="add-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕ Cancel" : "+ Add Application"}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-row">
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Applied</label>
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this application..."
              rows={3}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Application"}
          </button>
        </form>
      )}
    </div>
  );
}
