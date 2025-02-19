"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ChatView from "../../components/chat-view"
import { subDays } from "date-fns"
import { chatSchema, messageMap } from "@/data/chat-list/schema"
import { z } from "zod"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase/config"


export default function ChatPage() {
  const params = useParams()
  const chatId = params.id as string
  const [chat, setChat] = useState<z.infer<typeof chatSchema> | undefined>(undefined)

  // useEffect(() => {
  //   const foundChat = sampleChats.find((c) => c.id === chatId)
  //   if (foundChat) {
  //     setChat({ ...foundChat, messages: [...foundChat.messages] })
  //   }
  // }, [chatId])

  const handleSendMessage = async (newMessage: z.infer<typeof messageMap>) => {
    if (chat) {
      // const updatedChat = { ...chat, messages: [...chat.messages, newMessage] }
      // setChat(updatedChat)

  
        await addDoc(collection(db, "chats", chatId, "messages"), {
          sender: newMessage.sender,
          type: newMessage.type,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
        })
      };

    }
  

  if (!chat) {
    return <div className="flex h-screen items-center justify-center bg-[#0B1120] text-white">Loading...</div>
  }

  return (
    <div className="flex h-screen  text-white">
      <ChatView chat={chat} onSendMessage={handleSendMessage} />
    </div>
  )
}

