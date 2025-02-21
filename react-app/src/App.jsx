import React from "react";
import LoginRegisterPage from "./LoginRegisterPage.jsx"; 
import "./index.css";
import Dashboard from "./Dashboard.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
      <LoginRegisterPage />
      {/* <Dashboard /> */}
      </AuthProvider>
    </div>
  );
}

export default App;
