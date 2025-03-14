import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { signOut, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import './Dashboard.css';
import Chat from './Chat'; 

const Dashboard = () => {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); 
  const [userType, setUserType] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          setEmail(user.email || '');
          setNewEmail(user.email || '');

          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUsername(userData.username || 'Guest');
            setNewUsername(userData.username || '');
            setUserType(userData.userType || 'User');
          } else {
            console.warn('No user data found in Firestore.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    // Fetch all users
    const fetchUsers = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);

        const usersList = usersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.id !== user.uid);

        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
        fetchUsers();
      } else {
        setUsername('Guest');
        setEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSettingsClick = () => {
    setShowSettingsPopup(!showSettingsPopup);
  };

  const handleLogout = async () => {
    try {
      setFadeIn(false);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUpdate = async () => {
    const user = auth.currentUser;

    try {
      if (newEmail || newPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      }

      if (newUsername && newUsername !== username) {
        await setDoc(doc(db, 'users', user.uid), { username: newUsername });
        setUsername(newUsername);
      }

      if (newEmail && newEmail !== email) {
        await updateEmail(user, newEmail);
        await sendEmailVerification(user);
        alert('Updated email');
        return;
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    }
  };

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
    setSelectedGroup(null); 
  };

  const handleGroupClick = (groupId) => {
    setSelectedGroup(groupId);
    setSelectedUser(null); 
  };

  return (
    <div className={`dashboard ${fadeIn ? 'fade-in' : 'fade-out'}`}>
      <div className="sidebar">
        <h2 id="channeltitle">Groups</h2>
        <div className="group-list">
          <div className="group-item" onClick={() => handleGroupClick("general")}>
            General Chat
          </div>
          <div className="group-item" onClick={() => handleGroupClick("project Help")}>
            Project Help
          </div>
          <div className="group-item" onClick={() => handleGroupClick("social")}>
            Social
          </div>
        </div>
        <h2 id="Message-title">Users</h2>
        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className={selectedUser === user.id ? 'active' : ''}
            >
              {user.username || 'Unknown User'}
            </li>
          ))}
        </ul>
        <button id="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main-content">
        {userType === 'Admin' && <h2 className="admin-message">You logged in as an Admin</h2>}

        {selectedUser ? (
          <Chat userId={selectedUser} />
        ) : selectedGroup ? (
          <Chat groupId={selectedGroup} />
        ) : (
          <div id="Welcome">Welcome back!</div>
        )}
      </div>

     
      <div className={`popup-overlay ${showSettingsPopup ? 'active' : ''}`}>
        <div className="setting-popup">
          <div className="setting-popup-content">
            <h3 className="title">Settings</h3>
            <div className="input-group">
              <label>Your username: {username || 'Guest'}</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
              />
            </div>
            <div className="input-group">
              <label>Your email: {email || 'Guest'}</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
              />
            </div>
            <div className="input-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <button className="update-button" onClick={handleUpdate}>
              Update
            </button>
            <button className="close-button" onClick={handleSettingsClick}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;