import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import "../Chat.css";

const ChatWindow = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState(null);
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
      const messageData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMessages(messageData);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="recipient-info">
          <span className="recipient-name">{recipient?.username || "User"}</span>
          <span className="recipient-status">Online</span>
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
                  {msg.timestamp && new Date(msg.timestamp.toDate ? msg.timestamp.toDate() : msg.timestamp).toLocaleTimeString()}
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
    </div>
  );
};

export default ChatWindow; 