"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { z } from "zod";
import { chatSchema, messageMap } from "@/data/chat-list/schema";
import { db } from "@/lib/firebase/config";
import { doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";


const groupMessagesByDate = (messages: z.infer<typeof messageMap>[]) => {
  const groups: { [key: string]: z.infer<typeof messageMap>[] } = {};
  const seenMessageIds = new Set();

  messages.forEach((message) => {
    
    const timestamp = message.timestamp;

    if (seenMessageIds.has(message.messageId)) {
      return;
    }

    // Check if timestamp is a Timestamp object
    if (timestamp instanceof Timestamp) {
      if (!timestamp.seconds) return; // Ensure timestamp is valid
      const date = format(new Date(timestamp.seconds * 1000), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      seenMessageIds.add(message.messageId);
    } else {
      console.warn("Unexpected timestamp format:", timestamp);
    }
  });
  
  Object.keys(groups).forEach((date) => {
    groups[date].sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
  });

  return groups;
};

export default function ChatView({
  chat,
  onSendMessage,
}: {
  chat: z.infer<typeof chatSchema>;
  onSendMessage: (message: z.infer<typeof messageMap>) => void;
}) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const updateUnReadCount = async () => {
    try {
      const userRef = doc(db, "chat", chat.id);
      await updateDoc(userRef, 
        {unreadCount: 0}
      );
      console.log("unread count has updated");
    } catch (error) {
      console.error("Error updating count:", error);
    }
  };

  useEffect(()=>{
    updateUnReadCount();
  }, [chat.unreadCount]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: z.infer<typeof messageMap> = {
      chatId: chat.id,
      content: newMessage,
      sender: "supporter",
      timestamp: serverTimestamp(),
      type: "text",
    };

    onSendMessage(message);
    setNewMessage("");
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "image"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const message: z.infer<typeof messageMap> = {
          content: file.name,
          sender: "user",
          timestamp: {
            seconds: Math.floor(Date.now() / 1000),
            nanoseconds: (Date.now() % 1000) * 1000000,
          },
          type: type,
        };
        onSendMessage(message);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col h-full ">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={chat.userAvatar} alt={chat.userName} />
          <AvatarFallback>
            {chat.userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{chat.userName}</h2>
          <p className="text-sm text-gray-400">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="overflow-y-auto p-4 space-y-4 h-full">
      {Object.entries(groupMessagesByDate(chat.messages))
          .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
          .map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="mx-4 text-sm text-gray-500">
                  {format(new Date(date), "MMMM d, yyyy")}
                </span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>
              {msgs.map((message, index) => (
                <div
                  key={index}
                  className={`flex mb-2 ${
                    message.sender === "supporter" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[60%] rounded-lg p-3 ${
                      message.sender === "supporter"
                        ? "bg-blue-600 text-white text-end"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {message.type === "text" && <p>{message.content}</p>}
                    {message.type === "file" && (
                      <a
                        href={message.content}
                        download
                        className="flex items-center gap-2"
                      >
                        <Paperclip className="h-4 w-4" />
                        <span>{message.content}</span>
                      </a>
                    )}
                    {message.type === "image" && (
                      <img
                        src={message.content || "/placeholder.svg"}
                        alt={`Chat message image: ${message.content}`}
                        className="max-w-full rounded"
                      />
                    )}
                    <p className="text-xs mt-1 opacity-70">
                      {format(
                        new Date(message.timestamp.seconds * 1000),
                        "HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-800"
      >
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-md ">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-gray-400"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-gray-400"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="text-gray-400"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e, "file")}
          className="hidden"
        />
        <input
          type="file"
          ref={imageInputRef}
          onChange={(e) => handleFileUpload(e, "image")}
          accept="image/*"
          className="hidden"
        />
      </form>
    </div>
  );
}