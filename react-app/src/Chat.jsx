import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import "./Chat.css";

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

 
  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const user = usersSnapshot.docs.find((doc) => doc.id === userId);
        if (user) setRecipient(user.data());
      } catch (error) {
        console.error("Error fetching recipient:", error);
        setError("Failed to load recipient details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipient();
  }, [userId]);

 
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

  
    const chatId = user.uid < userId ? `${user.uid}_${userId}` : `${userId}_${user.uid}`;
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("chatId", "==", chatId), orderBy("timestamp"));

   
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [userId]);

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  const sendMessage = async () => {
    const user = auth.currentUser;
    if (!user || !newMessage.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    try {
      
      const chatId = user.uid < userId ? `${user.uid}_${userId}` : `${userId}_${user.uid}`;
      await addDoc(collection(db, "messages"), {
        chatId,
        senderId: user.uid,
        receiverId: userId,
        text: newMessage,
        timestamp: new Date(),
      });

      setNewMessage("");
      setError("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp?.toDate()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ←
        </button>
        <span>Chat with {recipient?.username || "User"}</span>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.senderId === auth.currentUser?.uid ? "sent" : "received"}`}
          >
            {msg.text}
            <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Chat;