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
    const q = query(
      messagesRef,
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsubscribe();
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !newMessage.trim()) return;

    try {
      const chatId = user.uid < userId ? `${user.uid}_${userId}` : `${userId}_${user.uid}`;
      await addDoc(collection(db, "messages"), {
        chatId,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        receiverId: userId,
        text: newMessage,
        timestamp: new Date(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-left">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            ←
          </button>
          <div className="recipient-info">
            <span className="recipient-name">{recipient?.username || "User"}</span>
            <span className="recipient-status">Online</span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.senderId === auth.currentUser?.uid ? "sent" : "received"}`}
            >
              <div className="message-header">
                <span className="message-author">
                  {msg.senderId === auth.currentUser?.uid ? "You" : recipient?.username}
                </span>
                <span className="message-time">
                  {new Date(msg.timestamp?.toDate()).toLocaleTimeString()}
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