import { useState, useEffect } from "react";
import { getApplications } from "../adapters/application-adapters";
import AddApplicationForm from "./AddApplicationForm";
import ApplicationList from "./ApplicationList";

export default function ApplicationPage({ currentUser }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch applications when the page loads
  useEffect(() => {
    fetchApplications();
  }, []);

  // get all applications and update state — called after every create, update, delete
  const fetchApplications = async () => {
    setIsLoading(true);
    const data = await getApplications();
    if (data.error) {
      setError(data.error);
    } else {
      setApplications(data);
    }
    setIsLoading(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Your Applications</h2>
          <p className="dashboard-subtitle">
            {applications.length} application
            {applications.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
      </div>

      <AddApplicationForm onAdd={fetchApplications} />

      {isLoading && <p className="status-msg">Loading your applications...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!isLoading && !error && (
        <ApplicationList
          applications={applications}
          onDelete={fetchApplications}
          onUpdate={fetchApplications}
        />
      )}
    </div>
  );
}
