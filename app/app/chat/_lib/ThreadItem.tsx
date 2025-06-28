import { Conversation } from "@/app/app/chat/_lib/chat";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";

interface ThreadItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ThreadItem = ({ conversation, isSelected, onClick }: ThreadItemProps) => {
  const timeAgo = formatDistance(new Date(conversation.createdAt), new Date(), {
    addSuffix: true,
    locale: pl
  });

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-accent/50 ${
        isSelected ? "bg-accent border-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium line-clamp-2">
          {conversation.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </CardContent>
    </Card>
  );
};

export default ThreadItem;
