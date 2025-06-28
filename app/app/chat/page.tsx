"use client";

import { ChatWindow } from "@/app/app/chat/_lib/ChatWindow";
import { useMobileSidebar } from "@/app/app/chat/_lib/hooks/use-mobile-sidebar";
import { ThreadsSidebar } from "@/app/app/chat/_lib/ThreadsSidebar";
import { useState } from "react";

const ChatPage = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<
    string | undefined
  >();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useMobileSidebar();

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId);
    closeSidebar();
  };

  const handleNewThread = () => {
    const newThreadId = `new-thread-${Date.now()}`;
    setSelectedThreadId(newThreadId);
    closeSidebar();
  };

  const handleThreadIdUpdate = (newThreadId: string) => {
    setSelectedThreadId(newThreadId);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      <ThreadsSidebar
        selectedThreadId={selectedThreadId}
        onThreadSelect={handleThreadSelect}
        onNewThread={handleNewThread}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <ChatWindow
        threadId={selectedThreadId}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        onThreadIdUpdate={handleThreadIdUpdate}
      />
    </div>
  );
};

export default ChatPage;
