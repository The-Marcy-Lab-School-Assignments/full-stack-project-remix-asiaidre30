import { useState, useEffect } from "react";
import { getApplications } from "../adapters/application-adapters";
import AddApplicationForm from "./AddApplicationForm";
import ApplicationList from "./ApplicationList";

// main dashboard page — shows form and list of applications
export default function ApplicationPage({ currentUser }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch applications when the page loads
  useEffect(() => {
    fetchApplications();
  }, []);

  // get all applications from the server and update state
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

      {/* form to add a new application — refetches list after adding */}
      <AddApplicationForm onAdd={fetchApplications} />

      {/* show loading, error, or the list */}
      {isLoading && <p className="status-msg">Loading your applications...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!isLoading && !error && (
        <ApplicationList
          applications={applications}
          onDelete={fetchApplications}
        />
      )}
    </div>
  );
}
