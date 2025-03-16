import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import './Dashboard.css';
import Chat from './Chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userType, setUserType] = useState('');
  const [groups, setGroups] = useState([]); // State to store groups
  const [newGroupName, setNewGroupName] = useState(''); // State for new group name
  const [newMemberId, setNewMemberId] = useState(''); // State for new member ID
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUsername(userData.username || 'Guest');
            setUserType(userData.userType || 'User');
          } else {
            console.warn('No user data found in Firestore.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

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

    const fetchGroups = async () => {
      try {
        const groupsRef = collection(db, 'groups');
        const groupsSnapshot = await getDocs(groupsRef);
        const groupsList = groupsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setGroups(groupsList);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
        fetchUsers();
        fetchGroups();
      } else {
        setUsername('Guest');
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
    setSelectedGroup(null);
  };

  const handleGroupClick = (groupId) => {
    setSelectedGroup(groupId);
    setSelectedUser(null);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const groupRef = doc(db, 'groups', newGroupName);
      await setDoc(groupRef, {
        name: newGroupName,
        members: [], // Start with an empty members list
      });
      setGroups([...groups, { id: newGroupName, name: newGroupName, members: [] }]);
      setNewGroupName('');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    // Prevent deletion of basic groups
    if (['General', 'Project Help', 'Social'].includes(groupId)) {
      alert("You cannot delete this group.");
      return;
    }

    try {
      await deleteDoc(doc(db, 'groups', groupId));
      setGroups(groups.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberId.trim() || !selectedGroup) return;

    try {
      const groupRef = doc(db, 'groups', selectedGroup);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        const updatedMembers = [...(groupData.members || []), newMemberId];

        await updateDoc(groupRef, { members: updatedMembers });
        setGroups(groups.map(group => group.id === selectedGroup ? { ...group, members: updatedMembers } : group));
        setNewMemberId('');
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  // Basic groups that cannot be deleted
  const basicGroups = [
    { id: 'General', name: 'General' },
    { id: 'Project Help', name: 'Project Help' },
    { id: 'Social', name: 'Social' },
  ];

  return (
    <div className={`dashboard ${fadeIn ? 'fade-in' : 'fade-out'}`}>
      <div className="sidebar">
        <h2 id="channeltitle">Groups</h2>
        <div className="group-list">
          {/* Render basic groups */}
          {basicGroups.map((group) => (
            <div key={group.id} className="group-item" onClick={() => handleGroupClick(group.id)}>
              {group.name}
            </div>
          ))}
          {/* Render dynamic groups from Firestore */}
          {groups.map((group) => (
            <div key={group.id} className="group-item" onClick={() => handleGroupClick(group.id)}>
              {group.name}
              {userType === 'Admin' && (
                <button onClick={() => handleDeleteGroup(group.id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          ))}
        </div>
        {userType === 'Admin' && (
          <div className="create-group">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="New Group Name"
              className="group-input"
            />
            <button onClick={handleCreateGroup} className="create-button">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        )}
        {selectedGroup && userType === 'Admin' && (
          <div className="add-member">
            <input
              type="text"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              placeholder="Add Member ID"
              className="member-input"
            />
            <button onClick={handleAddMember} className="add-button">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        )}
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
    </div>
  );
};

export default Dashboard;