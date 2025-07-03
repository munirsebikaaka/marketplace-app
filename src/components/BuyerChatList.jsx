import { useContext, useEffect, useState } from "react";
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
import ChatBox from "./ChartBox";

import "../styles/chats.css";

export default function BuyerChat({ sellerId, productId }) {
  const { user } = useContext(UserContext);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function findOrCreateChat() {
      if (!user || !sellerId || !productId) return;

      setLoading(true);
      setError(null);

      try {
        const chatsRef = collection(db, "chats");
        const q = query(
          chatsRef,
          where("buyerId", "==", user.uid),
          where("sellerId", "==", sellerId),
          where("productId", "==", productId)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setChatId(snapshot.docs[0].id);
        } else {
          const newChat = await addDoc(chatsRef, {
            buyerId: user.uid,
            sellerId,
            productId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastMessage: "",
          });
          setChatId(newChat.id);
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load or create chat.");
      }
      setLoading(false);
    }

    findOrCreateChat();
  }, [user, sellerId, productId]);

  if (loading) return <p>Loading chat...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!chatId) return <p>Unable to start chat. Please try again later.</p>;

  return <ChatBox chatId={chatId} />;
}
