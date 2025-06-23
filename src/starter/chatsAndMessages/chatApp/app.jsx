import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatArea from "./components/ChatArea/ChatArea";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  const [mobileView, setMobileView] = useState(window.innerWidth <= 768);
  const [showChatArea, setShowChatArea] = useState(!mobileView);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setMobileView(isMobile);
      if (!isMobile) setShowChatArea(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatItemClick = () => {
    if (mobileView) {
      setShowChatArea(true);
    }
  };

  const handleBackToChats = () => {
    setShowChatArea(false);
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <Sidebar
          mobileView={mobileView}
          showChatArea={showChatArea}
          onChatItemClick={handleChatItemClick}
        />
        <ChatArea
          mobileView={mobileView}
          showChatArea={showChatArea}
          onBackClick={handleBackToChats}
        />
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
