"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { chatSchema } from "@/data/chat-list/schema"
import { z } from "zod"

interface ChatListProps {
  chats: z.TypeOf<typeof chatSchema>[],
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
}

export default function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredChats, setFilteredChats] = useState(chats)

  useEffect(() => {
    const filtered = chats.filter(
      (chat) =>
        chat.userName.toLowerCase().includes(searchTerm.toLowerCase()) 
    //   ||
    //     chat.message[1].toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredChats(filtered)
  }, [searchTerm, chats])

  return (
    <div className="w-80 border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Inbox</h1>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-9 "
            placeholder="Search chat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-auto h-[calc(100vh-185px)]">
        {filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-900/50 transition-colors ${
              selectedChat === chat.id ? "bg-gray-900/50" : ""
            }`}
          >
            <img
              src={chat.userAvatar || "/placeholder.svg"}
              alt={chat.userName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="text-left flex-grow">
              <div className="font-medium flex justify-between items-center">
                <span>{chat.userName}</span>
                {chat.unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 line-clamp-1">{chat.messages[0].content}</p>
              {/* <p className="text-sm text-gray-400 line-clamp-1">hi, how's the wether </p> */}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

