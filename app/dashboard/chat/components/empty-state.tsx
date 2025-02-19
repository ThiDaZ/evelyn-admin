import { Button } from "@/components/ui/button"

export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 15 15" fill="none">
            <path
              d="M12.5 3L2.5 3.00002C2.22386 3.00002 2 3.22388 2 3.50002V9.50003C2 9.77617 2.22386 10 2.5 10H7.50003C7.63264 10 7.75982 10.0527 7.85358 10.1465L10 12.2929V10.5C10 10.2239 10.2239 10 10.5 10H12.5C12.7761 10 13 9.77617 13 9.50003V3.5C13 3.22386 12.7761 3 12.5 3ZM2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.50003C14 10.3285 13.3284 11 12.5 11H11V13.5C11 13.7022 10.8782 13.8845 10.6913 13.9619C10.5045 14.0393 10.2894 13.9965 10.1464 13.8536L7.29292 11H2.5C1.67157 11 1 10.3285 1 9.50003V3.50002C1 2.67159 1.67157 2 2.5 2Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Your messages</h2>
        <p className="text-gray-400 text-sm mb-4">Send a message to start a chat.</p>
        <Button>Send message</Button>
      </div>
    </div>
  )
}

