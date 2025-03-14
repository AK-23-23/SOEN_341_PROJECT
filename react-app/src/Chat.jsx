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
} from "firebase/firestore";
import "./Chat.css";

const Chat = ({ userId, groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    setMessages([]); 
    setLoading(true); 
  }, [groupId, userId]);

  useEffect(() => {
    if (!auth.currentUser) return;

    let q;
    if (groupId) {
      // Fetch group messages
      q = query(
        collection(db, "groupMessages"),
        where("groupId", "==", groupId),
        orderBy("timestamp", "asc")
      );
    } else if (userId) {
      // Fetch user messages
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
      const newMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
      if (groupId) {
        // Send the msg in one of the channels and update the database
        await addDoc(collection(db, "groupMessages"), {
          groupId,
          senderId: auth.currentUser.uid,
          senderName: auth.currentUser.displayName || auth.currentUser.email,
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
          senderName: auth.currentUser.displayName || auth.currentUser.email,
          receiverId: userId,
          text: newMessage,
          timestamp: serverTimestamp(),
        });
      }

      setNewMessage(""); // This is to clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
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