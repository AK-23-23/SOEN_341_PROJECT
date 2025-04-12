import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegisterPage from "./LoginRegisterPage.jsx";
import "./App.css";
import Dashboard from "./Dashboard.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginRegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
  //Ci test
}

export default App;