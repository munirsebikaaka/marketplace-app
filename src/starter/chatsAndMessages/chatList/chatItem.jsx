const ChatItem = ({ chat, onClick }) => {
  return (
    <div
      className={`chat-item ${chat.active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="chat-avatar">{chat.avatar}</div>
      <div className="chat-info">
        <div className="chat-name">{chat.name}</div>
        <div className="chat-preview">{chat.preview}</div>
      </div>
      <div className="chat-meta">
        <div className="chat-time">{chat.time}</div>
        {chat.unread > 0 && <div className="chat-unread">{chat.unread}</div>}
      </div>
    </div>
  );
};

export default ChatItem;
