import { useState } from "react";
import {
  deleteApplication,
  updateApplication,
} from "../adapters/application-adapters";

// each status gets its own icon, color, and label
const statusConfig = {
  applied: {
    icon: "📤",
    label: "Applied",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.3)",
  },
  interviewing: {
    icon: "🎙️",
    label: "Interviewing",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  offer: {
    icon: "🎉",
    label: "Offer Received",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  },
  rejected: {
    icon: "❌",
    label: "Rejected",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
  },
};

export default function ApplicationCard({ application, onDelete, onUpdate }) {
  // toggle between view mode and edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // edit form state — starts filled with current values
  const [company, setCompany] = useState(application.company);
  const [role, setRole] = useState(application.role);
  const [status, setStatus] = useState(application.status);
  const [dateApplied, setDateApplied] = useState(
    application.date_applied
      ? application.date_applied.split("T")[0] // format date for input field
      : "",
  );
  const [notes, setNotes] = useState(application.notes || "");

  const config = statusConfig[application.status] || statusConfig.applied;
  const editConfig = statusConfig[status] || statusConfig.applied;

  // save the updated application
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    const result = await updateApplication(application.application_id, {
      company,
      role,
      status,
      date_applied: dateApplied,
      notes,
    });
    setIsSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setIsEditing(false);
    onUpdate(); // tell parent to refetch the list
  };

  // cancel edit and reset form back to original values
  const handleCancel = () => {
    setCompany(application.company);
    setRole(application.role);
    setStatus(application.status);
    setDateApplied(
      application.date_applied ? application.date_applied.split("T")[0] : "",
    );
    setNotes(application.notes || "");
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete your ${application.company} application?`)) return;
    setIsDeleting(true);
    await deleteApplication(application.application_id);
    onDelete(); // tell parent to refetch the list
  };

  const formattedDate = application.date_applied
    ? new Date(application.date_applied).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // ── EDIT MODE ──────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="app-card editing">
        <div
          className="card-status-bar"
          style={{ background: editConfig.color }}
        />
        <div className="card-inner">
          <div className="edit-grid">
            <div className="form-group">
              <label>Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
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
              rows={2}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="edit-actions">
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "⏳ Saving..." : "✓ Save Changes"}
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW MODE ──────────────────────────────────────────
  return (
    <div className={`app-card ${isDeleting ? "deleting" : ""}`}>
      <div className="card-status-bar" style={{ background: config.color }} />
      <div className="card-inner">
        <div className="card-header">
          <div className="card-title-group">
            <div
              className="company-avatar"
              style={{ background: config.bg, color: config.color }}
            >
              {application.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="card-company">{application.company}</h3>
              <p className="card-role">💼 {application.role}</p>
            </div>
          </div>
          <span
            className="status-badge"
            style={{
              color: config.color,
              background: config.bg,
              border: `1px solid ${config.border}`,
            }}
          >
            {config.icon} {config.label}
          </span>
        </div>

        <div className="card-details">
          {formattedDate && (
            <span className="detail-chip">📅 {formattedDate}</span>
          )}
          {application.notes && (
            <span className="detail-chip notes-chip">
              📝 {application.notes}
            </span>
          )}
        </div>

        {/* edit and delete buttons side by side */}
        <div className="card-footer">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            ✏️ Edit
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "⏳ Deleting..." : "🗑 Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
