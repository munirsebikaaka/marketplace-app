import { useContext, useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";

import { db } from "../../../firebase";
import { UserContext } from "../../../contexts/UserContext";
import "../../../styles/chats.css";

export default function SellerChatList({
  productId,
  selectedChatId,
  onSelectChat,
  onSetShowChat,
}) {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user || !productId) return;

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("sellerId", "==", user.uid),
      where("productId", "==", productId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsList);
    });

    return () => unsubscribe();
  }, [user, productId]);

  function getInitials(name) {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  }

  if (!user) return <p>Please log in to see chats.</p>;
  if (!chats.length)
    return (
      <p className="default-p">
        No buyers chats yet.
        <button onClick={() => onSetShowChat(false)} className="go-back">
          go back
        </button>
      </p>
    );

  return (
    <div className="chat-sidebar">
      <button onClick={() => onSetShowChat(false)} className="go-back main">
        go back
      </button>
      <div className="sidebar-header">Buyer Chats</div>
      <ul className="chat-list" role="list">
        {chats.map(({ id, buyerId, lastMessage, updatedAt }) => (
          <li
            key={id}
            className={`chat-list-item ${
              id === selectedChatId ? "active" : ""
            }`}
            onClick={() => onSelectChat(id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSelectChat(id);
            }}
          >
            <div className="avatar">{getInitials(buyerId)}</div>
            {/* <div className="chat-info">
              <div className="chat-name">{buyerId}</div>
              <div className="chat-last-message">
                {lastMessage
                  ? lastMessage.slice(0, 30) +
                    (lastMessage.length > 30 ? "…" : "")
                  : "No messages yet"}
              </div>
            </div> */}
            <div className="chat-time">
              {updatedAt?.toDate
                ? new Date(updatedAt.toDate()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
