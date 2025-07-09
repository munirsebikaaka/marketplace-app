import { useContext, useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../../firebase";
import { UserContext } from "../../../contexts/UserContext";

export default function ChatBox({ chatId }) {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("chatId", "==", chatId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chatId]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function formatTime(timestamp) {
    if (!timestamp?.toDate) return "";
    return new Date(timestamp.toDate()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function sendMessage() {
    if (!input.trim()) return;
    if (!chatId) return;

    try {
      await addDoc(collection(db, "messages"), {
        chatId,
        senderId: user.uid,
        text: input.trim(),
        createdAt: serverTimestamp(),
      });
      setInput("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage();
  }

  return (
    <div className="chat-main">
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map(({ id, text, senderId, createdAt }) => {
          const isSentByCurrentUser = senderId === user?.uid;
          return (
            <div
              key={id}
              className={`message ${isSentByCurrentUser ? "sent" : "received"}`}
              aria-label={`${
                isSentByCurrentUser ? "Sent" : "Received"
              } message: ${text}`}
            >
              {text}
              <div className="message-time">{formatTime(createdAt)}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!chatId}
          aria-label="Message input"
          autoComplete="off"
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
