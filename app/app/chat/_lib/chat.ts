export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}
