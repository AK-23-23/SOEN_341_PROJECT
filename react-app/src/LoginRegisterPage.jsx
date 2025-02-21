import React, { useState, useEffect, Alert } from "react";
import "./LoginRegisterPage.css";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from "../context/AuthContext";


function LoginRegisterPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState('user'); // Default to user
  const [username, setUsername] = useState(""); // Only needed for sign-up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const { signup } = useAuth();


  const validateInputs = () => {
    const emailValid = email && /\S+@\S+\.\S+/.test(email); // Check if email is filled and valid
    const passwordValid = password; // Check if password is filled
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
    e.preventDefault(); // Prevent form from causing a page refresh

    // Clear previous messages.
    setError("");
    setSuccessMessage("");

    // Check if email field is provided.
    if (!email) {
      setError("Email is required.");
      return;
    }
    // Check if password field is provided.
    if (!password) {
      setError("Password is required.");
      return;
    }
    // Validate that the email provided matches a basic email pattern.
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    try {
      // Attempt to sign in with Firebase.
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Successfully logged in!");
      // Optionally, redirect to the dashboard page here.
      // For example, using React Router's useNavigate:
      // navigate("/dashboard");
    } catch (err) {
      console.error("Error logging in:", err);
      // Depending on the error code received from Firebase, display an appropriate message.
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
    setError(""); // Clear previous error messages
    setSuccessMessage(""); // Clear previous success messages
    setLoading(true);

    // Validate that the email is properly formatted
    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign-Up Branch: Create the user via Auth then store additional data in Firestore
        const userCredential = await signup(email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          userType: userType
          // Add additional fields if needed
        });
        setSuccessMessage("Successfully signed up! You can now Login with the account created.");
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      if (!isSignUp) {
        // Error handling for login
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
    } finally{ 
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
            value={email} onChange={(e) => setEmail(e.target.value)} 
            required
            />
            <input 
            type="password" 
            placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            required
            />
            <button 
            type="submit" disabled={loading} onClick={handleLogin}>Login</button>
          </div>
        </div>

    
        <div className="sign-up-container">
          <div className="form-box sign-up">
            <h2>{isSignUp ? "Create an Account" : "Sign In"}</h2>
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
            <select className="user-type-selection" value={userType} onChange={(e) => setUserType(e.target.value)}>
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
            
           

            <button type="submit" disabled={loading} onClick={handleRegisterForm}>
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
