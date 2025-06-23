import { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import ChatList from "./ChatList";

const Sidebar = ({ mobileView, showChatArea, onChatItemClick }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={`sidebar ${!mobileView || !showChatArea ? "active" : ""}`}>
      <SidebarHeader />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ChatList searchQuery={searchQuery} onChatItemClick={onChatItemClick} />
    </div>
  );
};

export default Sidebar;
