import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleHelpClick = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=settings";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="dashboard">
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