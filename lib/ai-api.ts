import type { ConversationsResponse, Message } from "@/app/app/chat/_lib/chat";
import axios from "axios";

const aiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_ROOT_URL || "http://localhost:3001",
  timeout: 120000, // 2 minutes to handle long AI responses
  headers: {
    "Content-Type": "application/json"
  }
});

export const getConversations = async (
  userId: string
): Promise<ConversationsResponse> => {
  const response = await aiApi.get<ConversationsResponse>("/conversations", {
    params: { userId }
  });
  return response.data;
};

export const getThreadMessages = async (
  threadId: string,
  userId: string
): Promise<Message[]> => {
  const response = await aiApi.get<{
    conversations: Array<{
      role: "user" | "assistant";
      text: string;
      createdAt: string;
    }>;
  }>(`/thread/${threadId}/messages`, {
    params: { userId }
  });

  return response.data.conversations.map((msg, index) => ({
    id: `${threadId}-${index}`,
    content: msg.text,
    role: msg.role,
    timestamp: new Date(msg.createdAt)
  }));
};

interface AskAIRequest {
  question: string;
  threadId?: string;
  resourceId: string;
}

interface AskAIResponse {
  answer: string;
  threadId: string;
  resourceId: string;
}

export const askAI = async (request: AskAIRequest): Promise<AskAIResponse> => {
  const body: AskAIRequest = {
    question: request.question,
    resourceId: request.resourceId
  };

  // Only include threadId if it exists (for continuing conversations)
  if (request.threadId) {
    body.threadId = request.threadId;
  }

  const response = await aiApi.post<AskAIResponse>("/ask-ai", body);
  return response.data;
};

export default aiApi;
