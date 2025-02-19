import {z} from "zod"

export const messageMap = z.object({
    messageId: z.string().optional(),
    chatId: z.string().optional(),
    content: z.string(),
    sender: z.enum(["user", "supporter"]),
    timestamp: z.object({
        seconds: z.number(),
        nanoseconds: z.number()
    }),
    type: z.string(),
})

export const chatSchema = z.object({
    id: z.string(),
    userName: z.string(),
    messages: z.array(messageMap),
    supporter: z.string(),
    unreadCount: z.number(),
    userId: z.string(),
    userAvatar: z.string(),
})

export type Chat = z.infer<typeof chatSchema>
export type MessageMap = z.infer<typeof messageMap>