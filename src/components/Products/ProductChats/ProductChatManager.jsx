import { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";

import BuyerChat from "./BuyerChatList";

import ChatBox from "./ChartBox";
import SellerChatList from "./SellerChatList";
import "../../../styles/chats.css";

export default function ProductChatManager({
  sellerId,
  productId,
  onSetShowChat,
}) {
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
          onSetShowChat={onSetShowChat}
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
