import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegisterPage from "./LoginRegisterPage.jsx"; 
import "./index.css";
import Dashboard from "./Dashboard.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
      <LoginRegisterPage />
      {/*<Dashboard />*/}
      </AuthProvider>
    </div>
  );
}

export default App;
