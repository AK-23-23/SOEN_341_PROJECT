import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import "./Chat.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Chat = ({ userId, groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("Fetched current user data:", userData);
            setCurrentUser(userData);
          } else {
            console.error("No user data found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching current user data:", error);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    setMessages([]);
    setLoading(true);
  }, [groupId, userId]);

  useEffect(() => {
    if (!auth.currentUser) return;

    let q;
    if (groupId) {
      q = query(
        collection(db, "groupMessages"),
        where("groupId", "==", groupId),
        orderBy("timestamp", "asc")
      );
    } else if (userId) {
      const chatId =
        auth.currentUser.uid < userId
          ? `${auth.currentUser.uid}_${userId}`
          : `${userId}_${auth.currentUser.uid}`;
      q = query(
        collection(db, "messages"),
        where("chatId", "==", chatId),
        orderBy("timestamp", "asc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Retrieved message data:", data);
        return { id: doc.id, ...data };
      });
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, groupId]);

  useEffect(() => {
    if (userId) {
      const fetchRecipient = async () => {
        try {
          const usersRef = collection(db, "users");
          const usersSnapshot = await getDocs(usersRef);
          const user = usersSnapshot.docs.find((doc) => doc.id === userId);
          if (user) setRecipient(user.data());
        } catch (error) {
          console.error("Error fetching recipient:", error);
          setError("Error loading recipient.");
        } finally {
          setLoading(false);
        }
      };

      fetchRecipient();
    } else if (groupId) {
      setRecipient({ username: `Group ${groupId}` });
      setLoading(false);
    }
  }, [userId, groupId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || !newMessage.trim()) return;

    try {
      const senderName = currentUser?.username || auth.currentUser.email;
      console.log("Sending message with senderName:", senderName);

      if (groupId) {
        await addDoc(collection(db, "groupMessages"), {
          groupId,
          senderId: auth.currentUser.uid,
          senderName,
          text: newMessage,
          timestamp: serverTimestamp(),
        });
      } else if (userId) {
        const chatId =
          auth.currentUser.uid < userId
            ? `${auth.currentUser.uid}_${userId}`
            : `${userId}_${auth.currentUser.uid}`;
        await addDoc(collection(db, "messages"), {
          chatId,
          senderId: auth.currentUser.uid,
          senderName,
          receiverId: userId,
          text: newMessage,
          timestamp: serverTimestamp(),
        });
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!currentUser?.userType === 'Admin') {
      alert("You do not have permission to delete this message.");
      return;
    }

    try {
      if (groupId) {
        await deleteDoc(doc(db, "groupMessages", messageId));
      } else if (userId) {
        await deleteDoc(doc(db, "messages", messageId));
      }
      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="recipient-info">
            <span className="recipient-name">
              {recipient?.username || (groupId ? `Group ${groupId}` : "User")}
            </span>
            <span className="recipient-status">Online</span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.senderId === auth.currentUser?.uid ? "sent" : "received"
              }`}
            >
              <div className="message-header">
                <span className="message-author">
                  {msg.senderId === auth.currentUser?.uid
                    ? "You"
                    : msg.senderName || "Unknown User"}
                </span>
                <span className="message-time">
                  {msg.timestamp?.seconds
                    ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()
                    : "Sending..."}
                </span>
                {currentUser?.userType === "Admin" && (
                  <button onClick={() => handleDeleteMessage(msg.id)} className="delete-button">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message @${recipient?.username || "User"}`}
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Chat;