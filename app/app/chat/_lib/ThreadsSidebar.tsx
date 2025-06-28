"use client";

import type { Conversation } from "@/app/app/chat/_lib/chat";
import { useConversations } from "@/app/app/chat/_lib/hooks/use-conversations";
import ThreadItem from "@/app/app/chat/_lib/ThreadItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Plus, X } from "lucide-react";

interface ThreadsSidebarProps {
  selectedThreadId?: string;
  onThreadSelect: (threadId: string) => void;
  onNewThread: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThreadsSidebar = ({
  selectedThreadId,
  onThreadSelect,
  onNewThread,
  isOpen,
  onClose
}: ThreadsSidebarProps) => {
  const { data, isLoading, error } = useConversations("user-1");

  if (isLoading) {
    return (
      <>
        {/* Mobile overlay backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        <div
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 
          border-r bg-background p-4 transform transition-transform duration-200 ease-in-out
          lg:transform-none lg:transition-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-4">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* Mobile overlay backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        <div
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 
          border-r bg-background p-4 transform transition-transform duration-200 ease-in-out
          lg:transform-none lg:transition-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Failed to load conversations
            </p>
          </div>
        </div>
      </>
    );
  }

  const conversations = data?.conversations || [];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 
        border-r bg-background flex flex-col transform transition-transform duration-200 ease-in-out
        lg:transform-none lg:transition-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-2 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b">
          <Button
            onClick={onNewThread}
            className="w-full justify-start"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nowa rozmowa
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nie rozpoczęto jeszcze żadnej rozmowy
                </p>
                <p className="text-xs text-muted-foreground">
                  Zacznij nową rozmowę
                </p>
              </div>
            ) : (
              conversations.map((conversation: Conversation) => (
                <ThreadItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedThreadId === conversation.id}
                  onClick={() => onThreadSelect(conversation.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
