import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import SellerChatList from "./SellerChatList";
import BuyerChat from "./BuyerChatList";

import "../styles/chats.css";
import ChatBox from "./ChartBox";

export default function ProductChatManager({ sellerId, productId }) {
  const { user } = useContext(UserContext);
  const [selectedChatId, setSelectedChatId] = useState(null);

  if (!user) return <p>Please log in to chat.</p>;

  if (user.uid === sellerId) {
    return (
      <div className="chat-container">
        <SellerChatList
          productId={productId}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
        <ChatBox chatId={selectedChatId} />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <BuyerChat sellerId={sellerId} productId={productId} />
    </div>
  );
}
