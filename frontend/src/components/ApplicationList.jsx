import ApplicationCard from "./ApplicationCard";

// renders the list of application cards
export default function ApplicationList({ applications, onDelete }) {
  // show a message if there are no applications yet
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
        // each card gets its data and the refetch function
        <ApplicationCard
          key={app.application_id}
          application={app}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
