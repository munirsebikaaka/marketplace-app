// src/components/ChatBox.jsx
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/chartBox.css";

export default function ChatBox({
  buyerId: initialBuyerId,
  sellerId,
  productId,
  currentUserId, // logged-in user ID
}) {
  const [resolvedBuyerId, setResolvedBuyerId] = useState(
    initialBuyerId || null
  );
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Resolve buyerId from existing chat if not passed
  useEffect(() => {
    async function resolveChatAndBuyerId() {
      setLoading(true);
      if (initialBuyerId) {
        setResolvedBuyerId(initialBuyerId);
        setChatId(`${initialBuyerId}_${productId}`);
        setLoading(false);
      } else if (sellerId && productId) {
        const chatsRef = collection(db, "chats");

        const q = query(
          chatsRef,
          where("sellerId", "==", sellerId),
          where("productId", "==", productId)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const chatDoc = querySnapshot.docs[0];
          const data = chatDoc.data();
          if (data.buyerId) {
            setResolvedBuyerId(data.buyerId);
            setChatId(chatDoc.id);
          }
        } else {
          console.warn(
            "❗ Could not resolve buyerId from chat. No chat found."
          );
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }

    resolveChatAndBuyerId();
  }, [initialBuyerId, sellerId, productId]);

  // Init chat + listen to messages
  useEffect(() => {
    if (!resolvedBuyerId || !productId || !sellerId) return;

    const finalChatId = `${resolvedBuyerId}_${productId}`;
    setChatId(finalChatId);

    const chatRef = doc(db, "chats", finalChatId);

    async function initChat() {
      const snap = await getDoc(chatRef);
      if (!snap.exists()) {
        await setDoc(chatRef, {
          buyerId: resolvedBuyerId,
          sellerId,
          productId,
          createdAt: serverTimestamp(),
        });
      }
    }

    initChat();

    setLoading(true);

    const unsub = onSnapshot(
      collection(db, "chats", finalChatId, "messages"),
      (snap) => {
        const msgs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(
          msgs.sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis())
        );
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to messages:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [resolvedBuyerId, sellerId, productId]);

  // Send message handler
  const sendMessage = async () => {
    if (!newMsg.trim() || !resolvedBuyerId || !chatId || !currentUserId) return;

    setSubmitting(true);

    try {
      const senderId = currentUserId;

      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId,
        text: newMsg.trim(),
        timestamp: serverTimestamp(),
      });

      setNewMsg("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {loading ? (
          <p className="loading-text">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="no-messages-text">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-msg ${
                msg.senderId === currentUserId ? "own" : ""
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          disabled={loading || submitting}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !submitting && !loading) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || submitting || !newMsg.trim()}
        >
          {submitting ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
