import React, { useState, useEffect } from "react";
import "./LoginRegisterPage.css";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 

function LoginRegisterPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('user');
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate(); 

  const validateInputs = () => {
    const emailValid = email && /\S+@\S+\.\S+/.test(email);
    const passwordValid = password;
    setError({
      email: !emailValid,
      password: !passwordValid,
    });
    if (!emailValid || !passwordValid) {
      setError('Error', 'Please fill in all fields correctly');
    }
    return emailValid && passwordValid;
  };

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Successfully logged in!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error logging in:", err);

      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with that email address.");
      } else {
        setError("Login failed: " + err.message);
      }
    }
  }

  const db = getFirestore();

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
  }, []);

  async function handleRegisterForm(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await signup(email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          userType: userType
        });
        setSuccessMessage("Successfully signed up! You can now Login with the account created.");
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      if (!isSignUp) {
        if (err.code === "auth/wrong-password") {
          setError("Incorrect password. Please try again.");
        } else if (err.code === "auth/user-not-found") {
          setError("No account exists for that email.");
        } else {
          setError("Login failed: " + err.message);
        }
      } else {
        setError("Failed to create an account: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`auth-wrapper ${fadeIn ? "fade-in" : ""}`}>
      <div className="auth-container">
        <div className="login-container">
          <div className="form-box sign-in">
            <h2>Sign in</h2>
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>

        <div className="sign-up-container">
          <div className="form-box sign-up">
            <h2>{isSignUp ? "Create an Account" : "Sign In"}</h2>
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
            <select
              className="user-type-selection"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            {isSignUp && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              onClick={handleRegisterForm}
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
            <p onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </p>
          </div>
        </div>

        <div className={`overlay ${isSignUp ? "move-left" : ""}`}>
          {isSignUp ? (
            <>
              <h1 className="overlay-text">Join us!</h1>
              <p className="overlay-message">
                Already have an account?{" "}
                <span onClick={() => setIsSignUp(false)}>Login Now</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="overlay-text">Welcome back!</h1>
              <p className="overlay-message">
                Don't have an account?{" "}
                <span onClick={() => setIsSignUp(true)}>Sign Up Now</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterPage;