import { Message } from "@/app/app/chat/_lib/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { User, Bot } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start space-x-3 ${
        isUser ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <Card
        className={`max-w-[70%] ${
          isUser ? "bg-primary text-primary-foreground" : ""
        }`}
      >
        <CardContent className="p-3">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p
            className={`text-xs mt-1 ${
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {message.timestamp.toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageBubble;
