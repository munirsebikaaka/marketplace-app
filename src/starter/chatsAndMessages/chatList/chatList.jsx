import ChatItem from "./ChatItem";

const ChatList = ({ searchQuery, onChatItemClick }) => {
  // Sample chat data
  const chats = [
    {
      id: 1,
      name: "Alice Smith",
      avatar: "AS",
      preview: "Hey, how are you doing?",
      time: "10:30 AM",
      unread: 3,
      active: true,
    },
    {
      id: 2,
      name: "Bob Johnson",
      avatar: "BJ",
      preview: "Meeting at 2 PM tomorrow",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      name: "Carol White",
      avatar: "CW",
      preview: "Please review the documents I sent",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 4,
      name: "David Green",
      avatar: "DG",
      preview: "The project is due next week",
      time: "Monday",
      unread: 0,
    },
    {
      id: 5,
      name: "Emma Brown",
      avatar: "EB",
      preview: "Let's catch up this weekend!",
      time: "Sunday",
      unread: 0,
    },
  ];

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-list">
      {filteredChats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} onClick={onChatItemClick} />
      ))}
    </div>
  );
};

export default ChatList;
