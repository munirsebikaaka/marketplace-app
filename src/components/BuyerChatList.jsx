import { useState, useContext, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../contexts/UserContext";
import ChatBox from "./ChartBox"; // Note: 'ChartBox' seems like a typo; should be 'ChatBox'

export default function BuyerChat({ sellerId, productId }) {
  const { user } = useContext(UserContext);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!user || !sellerId || !productId) return;

    // Optional: Check if buyer already has a chat with messages
    async function fetchExistingChat() {
      const chatQuery = query(
        collection(db, "chats"),
        where("buyerId", "==", user.uid),
        where("sellerId", "==", sellerId),
        where("productId", "==", productId)
      );

      const chatSnapshot = await getDocs(chatQuery);
      if (!chatSnapshot.empty) {
        setChatId(chatSnapshot.docs[0].id);
      }
    }

    fetchExistingChat();
  }, [user, sellerId, productId]);

  async function handleSendMessage(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    let currentChatId = chatId;

    // If no chat exists, create one now
    if (!currentChatId) {
      const newChatRef = await addDoc(collection(db, "chats"), {
        buyerId: user.uid,
        sellerId,
        productId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: trimmed,
      });
      currentChatId = newChatRef.id;
      setChatId(currentChatId);
    } else {
      // Update chat metadata (e.g., lastMessage, updatedAt)
      // Optional: Implement if needed
    }

    // Send the message
    await addDoc(collection(db, "messages"), {
      chatId: currentChatId,
      senderId: user.uid,
      text: trimmed,
      createdAt: serverTimestamp(),
    });

    setInput("");
  }

  return (
    <div className="chat-container">
      {!chatId ? (
        <form onSubmit={handleSendMessage} className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Send a message to start chat"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message input"
            autoComplete="off"
          />
          <button type="submit" className="chat-send-button">
            Send
          </button>
        </form>
      ) : (
        <ChatBox chatId={chatId} />
      )}
    </div>
  );
}
