import ApplicationCard from "./ApplicationCard";

export default function ApplicationList({ applications, onDelete, onUpdate }) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <p>No applications yet. Add your first one above!</p>
      </div>
    );
  }

  return (
    <div className="application-list">
      {applications.map((app) => (
        <ApplicationCard
          key={app.application_id}
          application={app}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
