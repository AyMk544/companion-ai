"use client";

import ChatHeader from "@/components/ChatHeader";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompletion } from "ai/react";
import ChatForm from "@/components/ChatForm";
import ChatMessages from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";
interface ChatCilentProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

const ChatCilent = ({ companion }: ChatCilentProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  );

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      onFinish(prompt, completion) {
        // AI Message Object
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };

        // Add message of system/AI to the array of messages
        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    // Add message of user to the array of messages
    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatCilent;
