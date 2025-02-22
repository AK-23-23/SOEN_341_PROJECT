import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase"; 
import { signOut } from "firebase/auth"; 
import './Dashboard.css';

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [fadeIn, setFadeIn] = useState(false); 
  const navigate = useNavigate(); 


  const handleHelpClick = () => {
    setShowPopup(!showPopup);
  };

 
  const handleLogout = async () => {
    try {
      setFadeIn(false); 
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      await signOut(auth); 
      navigate("/"); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    setFadeIn(true); 
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=settings";
    document.head.appendChild(link);
  }, []);

  return (
    <div className={`dashboard ${fadeIn ? 'fade-in' : 'fade-out'}`}>
      <div className="sidebar">
        <h2 id='channeltitle'>Channels</h2>
        <ul>
          <li>General</li>
          <li>Project Help</li>
          <li>Social</li>
        </ul>
      </div>
      <div className="chat">
        <div className="idk">
          <h2 id='Welcome'>Welcome message <br /> yap yap</h2>
        </div>

       
        <button id="logout-button" onClick={handleLogout}>
          Logout
        </button>

        <span className="material-symbols-outlined">settings</span>

        <span className="help" onClick={handleHelpClick}>
          ?
        </span>

        <div className={`popup-overlay ${showPopup ? 'active' : ''}`}>
          <div className="popup">
            <div className="popup-content">
              <h3>How to use the app:</h3>
              <p>Help Message</p>
              <button onClick={handleHelpClick}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;