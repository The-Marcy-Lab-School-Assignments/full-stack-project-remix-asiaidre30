import { useState, useEffect } from "react";
import { getMe, logoutUser } from "./adapters/auth-adapters";
import AuthPage from "./components/AuthPage";
import ApplicationPage from "./components/ApplicationPage";
import "./App.css";

export default function App() {
  // currentUser holds the logged in user or null if guest
  const [currentUser, setCurrentUser] = useState(null);
  // loading tracks whether we're still checking the session
  const [isLoading, setIsLoading] = useState(true);

  // on page load, check if a session already exists (rehydration)
  useEffect(() => {
    const checkSession = async () => {
      const user = await getMe();
      // if a user comes back, set them as current user
      if (user && user.user_id) setCurrentUser(user);
      setIsLoading(false);
    };
    checkSession();
  }, []);

  // called after login or register succeeds
  const handleLogin = (user) => setCurrentUser(user);

  // clear the session and set user back to null
  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  // show nothing while we're checking the session
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading ApplyFlow...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">⚡</span>
          <h1 className="brand-name">ApplyFlow</h1>
        </div>
        {/* only show logout button when logged in */}
        {currentUser && (
          <div className="header-right">
            <span className="welcome-text">hey, {currentUser.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {/* show auth forms for guests, application dashboard for logged in users */}
        {!currentUser ? (
          <AuthPage onLogin={handleLogin} />
        ) : (
          <ApplicationPage currentUser={currentUser} />
        )}
      </main>
    </div>
  );
}
