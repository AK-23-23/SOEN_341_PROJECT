import React, { useState } from "react";
import "./LoginRegisterPage.css";

function LoginRegisterPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Login Container */}
        <div className="login-container">
          <div className="form-box sign-in">
            <h2>Sign in</h2>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
          </div>
        </div>

        {/* Sign-up Container */}
        <div className="sign-up-container">
          <div className="form-box sign-up">
            <h2>Create an Account</h2>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
          </div>
        </div>

        {/* Overlay - Hides Sign-Up at Start */}
        <div className={`overlay ${isSignUp ? "move-left" : ""}`}>
          {/* Conditional Rendering for h1 and messages */}
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