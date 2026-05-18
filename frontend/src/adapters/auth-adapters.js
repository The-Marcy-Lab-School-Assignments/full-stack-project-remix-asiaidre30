// all the fetch calls related to auth

// send username + password to register
export const registerUser = async (username, password) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

// send username + password to log in
export const loginUser = async (username, password) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

// end the session
export const logoutUser = async () => {
  const res = await fetch("/api/auth/logout", { method: "DELETE" });
  return res.json();
};

// check if a session already exists (used on page load)
export const getMe = async () => {
  const res = await fetch("/api/auth/me");
  return res.json();
};
