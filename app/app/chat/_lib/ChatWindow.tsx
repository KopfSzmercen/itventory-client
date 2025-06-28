"use client";

import type { Message } from "@/app/app/chat/_lib/chat";
import {
  useAskAI,
  useThreadMessages
} from "@/app/app/chat/_lib/hooks/use-conversations";
import MessageBubble from "@/app/app/chat/_lib/MessageBubble";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Menu, MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatWindowProps {
  threadId?: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onThreadIdUpdate?: (newThreadId: string) => void;
}

export const ChatWindow = ({
  threadId,
  onToggleSidebar,
  onThreadIdUpdate
}: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const {
    data: threadMessages,
    isLoading: isLoadingMessages,
    error
  } = useThreadMessages(threadId, "user-1");

  const askAIMutation = useAskAI("user-1");

  useEffect(() => {
    if (threadMessages) {
      setMessages(threadMessages);
    } else if (!threadId) {
      setMessages([]);
    }
  }, [threadMessages, threadId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || askAIMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    const question = inputValue;
    setInputValue("");

    try {
      const response = await askAIMutation.mutateAsync({
        question,
        threadId: threadId?.startsWith("new-thread-") ? undefined : threadId
      });

      if (threadId?.startsWith("new-thread-") && onThreadIdUpdate) {
        onThreadIdUpdate(response.threadId);
      }
    } catch (e) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Przepraszam, wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie." +
          e,
        role: "assistant",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!threadId) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        {/* Header for welcome screen */}
        <div className="border-b p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden h-8 w-8 mr-3"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold">AI Chat</h2>
        </div>

        {/* Welcome content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Witaj w IT Ventory AI Chat
            </h3>
            <p className="text-muted-foreground mb-4">
              Wybierz rozmowę z lewego panelu lub rozpocznij nową.
            </p>
            <Button
              onClick={onToggleSidebar}
              variant="outline"
              className="lg:hidden"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Zobacz rozmowy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div>
            <h2 className="font-semibold">Konwersacja </h2>
            <p className="text-sm text-muted-foreground">
              {threadId ? `Thread ID: ${threadId}` : "No thread selected"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2 animate-pulse" />
              <p className="text-muted-foreground">Ładowanie wiadomości...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-destructive mx-auto mb-2" />
              <p className="text-destructive">
                Błąd podczas ładowania wiadomości
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Spróbuj ponownie później
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Rozpocznij chat</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {askAIMutation.isPending && (
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Card className="max-w-[70%]">
              <CardContent className="p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Twoja wiadomość..."
            disabled={askAIMutation.isPending}
            className="flex-1"
            rows={3}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || askAIMutation.isPending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
