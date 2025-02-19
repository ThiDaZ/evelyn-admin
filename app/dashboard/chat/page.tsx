"use client";

import { useState, useEffect } from "react";
import ChatList from "./components/chat-list";
import ChatView from "./components/chat-view";
import EmptyState from "./components/empty-state";
import { db } from "@/lib/firebase/config";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { chatSchema, messageMap } from "@/data/chat-list/schema";
import { z } from "zod";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  message: string;
  isYou: boolean;
  messages?: Message[];
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: Date;
  type: "text" | "file" | "image";
  fileUrl?: string;
}

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatData, setChatData] = useState<z.TypeOf<typeof chatSchema>[]>([])


  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    const unsubscribe = onSnapshot(collection(db, "chat"), async(chatSnapshot) =>{
      const chatData = [];

      for(const chatDoc of chatSnapshot.docs){
        const chat = chatDoc.data();
        const id = chatDoc.id;
        const userId = chat.userId;

        const messagesRef = collection(db, "chat", id, "messages");
        const messages: z.TypeOf<typeof messageMap>[] = [];
        
        const unsubscribeMessages = onSnapshot(messagesRef, (messagesSnapshot) => {
          messagesSnapshot.docs.forEach((msgDoc) => {
            const messageData = msgDoc.data();
            messages.push({
              messageId: msgDoc.id,
              type: messageData.type,
              content: messageData.content,
              sender: messageData.sender,
              timestamp: messageData.timestamp
            });
          });

          setChatData((prevChats) =>
            prevChats.map((c) => (c.id === id ? { ...c, messages } : c))
          );
        })
        
        unsubscribers.push(unsubscribeMessages);
  
        const userIdRef = doc(db, "users", userId);
        const userDoc = await getDoc(userIdRef);
        
        let userName = "";
        let userAvatar = "";
        if(userDoc.exists()){
          userName = userDoc.data().firstName + " " + userDoc.data().lastName;
            userAvatar = userDoc.data().avatar;
        }
  
        chatData.push({
          id, ...chat, userName, userAvatar, messages
        })
      }

      const chatTypeSchema = z.array(chatSchema).parse(chatData);
      console.log(chatTypeSchema)
      setChatData(chatTypeSchema);
    });

    unsubscribers.push(unsubscribe);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

 const handleSendMessage = async (newMessage: z.infer<typeof messageMap>) => {
    if (selectedChat) {
  
        await addDoc(collection(db, "chat", selectedChat, "messages"), {
          sender: newMessage.sender,
          type: newMessage.type,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
        })
      };

    }

  const selectedChatData = chatData.find((chat) => chat.id === selectedChat);

  return (
    <div className="flex h-[92vh]">
      <ChatList
        chats={chatData}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      <div className="w-full">
        {selectedChatData ? (
          <ChatView chat={selectedChatData} onSendMessage={handleSendMessage} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
