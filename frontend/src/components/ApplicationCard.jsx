import { useState } from "react";
import { deleteApplication } from "../adapters/application-adapters";

// each status gets its own icon, color, and label
const statusConfig = {
  applied: {
    icon: "📤",
    label: "Applied",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.3)",
  },
  interviewing: {
    icon: "🎙️",
    label: "Interviewing",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
  },
  offer: {
    icon: "🎉",
    label: "Offer Received",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
  },
  rejected: {
    icon: "❌",
    label: "Rejected",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
  },
};

export default function ApplicationCard({ application, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // grab the config for this card's status (fallback to applied if unknown)
  const status = statusConfig[application.status] || statusConfig.applied;

  const handleDelete = async () => {
    if (!confirm(`Delete your ${application.company} application?`)) return;
    setIsDeleting(true);
    await deleteApplication(application.application_id);
    // tell parent to refetch the list
    onDelete();
  };

  // format date nicely or show fallback
  const formattedDate = application.date_applied
    ? new Date(application.date_applied).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      className={`app-card ${isDeleting ? "deleting" : ""}`}
      style={{ "--status-color": status.color }}
    >
      {/* colored left border bar based on status */}
      <div className="card-status-bar" style={{ background: status.color }} />

      <div className="card-inner">
        <div className="card-header">
          <div className="card-title-group">
            {/* company initial as avatar */}
            <div
              className="company-avatar"
              style={{ background: status.bg, color: status.color }}
            >
              {application.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="card-company">{application.company}</h3>
              <p className="card-role">💼 {application.role}</p>
            </div>
          </div>

          {/* status badge with icon */}
          <span
            className="status-badge"
            style={{
              color: status.color,
              background: status.bg,
              border: `1px solid ${status.border}`,
            }}
          >
            {status.icon} {status.label}
          </span>
        </div>

        {/* extra details row */}
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

        <div className="card-footer">
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
