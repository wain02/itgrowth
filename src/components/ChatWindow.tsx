import { Message } from "./Message";
import type { Message as ChatMessage } from "../types/chat";

type ChatWindowProps = {
  messages: ChatMessage[];
  isLoading?: boolean;
};

function LoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[90%] border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 border border-cyan-400/20 bg-cyan-500/10" />
          <div className="flex items-center gap-3">
            <span className="h-3.5 w-3.5 animate-spin border-2 border-cyan-300 border-t-transparent" />
            <span className="text-sm text-white/80">
              Analizando tendencias en Google y generando contenido...
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-4 w-52 animate-pulse bg-white/10" />
          <div className="h-4 w-full animate-pulse bg-white/5" />
          <div className="h-4 w-5/6 animate-pulse bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export function ChatWindow({ messages, isLoading = false }: ChatWindowProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-transparent pb-36">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-4 px-4 py-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading ? <LoadingBubble /> : null}
      </div>
    </div>
  );
}
