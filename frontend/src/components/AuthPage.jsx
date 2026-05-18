import { useState } from "react";
import { loginUser, registerUser } from "../adapters/auth-adapters";

// this page shows login and register forms for guests
export default function AuthPage({ onLogin }) {
  // toggle between login and register mode
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page from refreshing
    setError(null);
    setIsLoading(true);

    // call login or register depending on which mode we're in
    const user = isLogin
      ? await loginUser(username, password)
      : await registerUser(username, password);

    setIsLoading(false);

    // if server sent back an error message, show it
    if (user.error) {
      setError(user.error);
      return;
    }

    // success — tell App.jsx who logged in
    onLogin(user);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
          <p>
            {isLogin
              ? "Sign in to track your applications"
              : "Start tracking your job search"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {/* show error message if something went wrong */}
          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* toggle between login and register */}
        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
