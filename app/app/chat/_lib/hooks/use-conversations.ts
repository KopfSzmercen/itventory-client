import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversations, getThreadMessages, askAI } from "@/lib/ai-api";

export const useConversations = (userId: string) => {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => getConversations(userId),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export const useThreadMessages = (
  threadId: string | undefined,
  userId: string
) => {
  return useQuery({
    queryKey: ["thread-messages", threadId, userId],
    queryFn: () => {
      if (!threadId) throw new Error("Thread ID is required");
      return getThreadMessages(threadId, userId);
    },
    enabled: !!threadId, // Only run query if threadId is provided
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};

export const useAskAI = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      question,
      threadId
    }: {
      question: string;
      threadId?: string;
    }) =>
      askAI({
        question,
        threadId,
        resourceId: userId
      }),
    onSuccess: (data) => {
      // Invalidate and refetch conversations to get updated list
      queryClient.invalidateQueries({ queryKey: ["conversations", userId] });

      // Invalidate and refetch messages for the thread
      queryClient.invalidateQueries({
        queryKey: ["thread-messages", data.threadId, userId]
      });
    }
  });
};
