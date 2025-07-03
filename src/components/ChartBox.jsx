// import { useEffect, useState } from "react";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   setDoc,
//   getDoc,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import "../styles/chartBox.css";

// export default function ChatBox({
//   buyerId: initialBuyerId,
//   sellerId,
//   productId,
//   currentUserId, // logged-in user ID
// }) {
//   const [resolvedBuyerId, setResolvedBuyerId] = useState(
//     initialBuyerId || null
//   );
//   const [chatId, setChatId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // Resolve buyerId from existing chat if not passed
//   useEffect(() => {
//     async function resolveChatAndBuyerId() {
//       setLoading(true);
//       if (initialBuyerId) {
//         setResolvedBuyerId(initialBuyerId);
//         setChatId(`${initialBuyerId}_${productId}`);
//         setLoading(false);
//       } else if (sellerId && productId) {
//         const chatsRef = collection(db, "chats");

//         const q = query(
//           chatsRef,
//           where("sellerId", "==", sellerId),
//           where("productId", "==", productId)
//         );

//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//           const chatDoc = querySnapshot.docs[0];
//           const data = chatDoc.data();
//           if (data.buyerId) {
//             setResolvedBuyerId(data.buyerId);
//             setChatId(chatDoc.id);
//           }
//         } else {
//           console.warn(
//             "❗ Could not resolve buyerId from chat. No chat found."
//           );
//         }
//         setLoading(false);
//       } else {
//         setLoading(false);
//       }
//     }

//     resolveChatAndBuyerId();
//   }, [initialBuyerId, sellerId, productId]);

//   // Init chat + listen to messages
//   useEffect(() => {
//     if (!resolvedBuyerId || !productId || !sellerId) return;

//     const finalChatId = `${resolvedBuyerId}_${productId}`;
//     setChatId(finalChatId);

//     const chatRef = doc(db, "chats", finalChatId);

//     async function initChat() {
//       const snap = await getDoc(chatRef);
//       if (!snap.exists()) {
//         await setDoc(chatRef, {
//           buyerId: resolvedBuyerId,
//           sellerId,
//           productId,
//           createdAt: serverTimestamp(),
//         });
//       }
//     }

//     initChat();

//     setLoading(true);

//     const unsub = onSnapshot(
//       collection(db, "chats", finalChatId, "messages"),
//       (snap) => {
//         const msgs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setMessages(
//           msgs.sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis())
//         );
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Error listening to messages:", error);
//         setLoading(false);
//       }
//     );

//     return () => unsub();
//   }, [resolvedBuyerId, sellerId, productId]);

//   // Send message handler
//   const sendMessage = async () => {
//     if (!newMsg.trim() || !resolvedBuyerId || !chatId || !currentUserId) return;

//     setSubmitting(true);

//     try {
//       const senderId = currentUserId;

//       await addDoc(collection(db, "chats", chatId, "messages"), {
//         senderId,
//         text: newMsg.trim(),
//         timestamp: serverTimestamp(),
//       });

//       setNewMsg("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="chat-box">
//       <div className="chat-messages">
//         {loading ? (
//           <p className="loading-text">Loading messages...</p>
//         ) : messages.length === 0 ? (
//           <p className="no-messages-text">No messages yet.</p>
//         ) : (
//           messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`chat-msg ${
//                 msg.senderId === currentUserId ? "own" : ""
//               }`}
//             >
//               {msg.text}
//             </div>
//           ))
//         )}
//       </div>

//       <div className="chat-input">
//         <input
//           value={newMsg}
//           onChange={(e) => setNewMsg(e.target.value)}
//           placeholder="Type a message..."
//           disabled={loading || submitting}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !submitting && !loading) {
//               e.preventDefault();
//               sendMessage();
//             }
//           }}
//         />
//         <button
//           onClick={sendMessage}
//           disabled={loading || submitting || !newMsg.trim()}
//         >
//           {submitting ? "Sending..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }/

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

import { db } from "../firebase";
import { UserContext } from "../contexts/UserContext";

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
