// all the fetch calls related to applications

// get all applications for the logged in user
export const getApplications = async () => {
  const res = await fetch("/api/applications");
  return res.json();
};

// create a new application
export const createApplication = async (data) => {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// delete one application by its id
export const deleteApplication = async (id) => {
  const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
  return res.json();
};
