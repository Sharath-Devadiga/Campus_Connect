import ChatContainer from "@/components/ChatContainer"
import ChatSidebar from "@/components/ChatSidebar"
import NoChatSelected from "@/components/NoChatSelected"
import { useChatStore } from "@/stores/chatStore/useChatStore"


export const Messages = () => {
  const { selectedUser } = useChatStore()

  return (
    <div className="flex items-center justify-center pt-24 px-4 pb-6 h-screen">
        <div className="rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden border shadow-xl dark:border-neutral-800 dark:shadow-neutral-700 dark:shadow-md">
            <ChatSidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
  )
}
