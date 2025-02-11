import React, { useState, useEffect } from "react";
import "./LoginRegisterPage.css";

function LoginRegisterPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100); 
  }, []);

  return (
    <div className={`auth-wrapper ${fadeIn ? "fade-in" : ""}`}>
      <div className="auth-container">
        
        <div className="login-container">
          <div className="form-box sign-in">
            <h2>Sign in</h2>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
          </div>
        </div>

    
        <div className="sign-up-container">
          <div className="form-box sign-up">
            <h2>Create an Account</h2>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
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
