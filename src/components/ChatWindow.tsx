import { Message } from "./Message";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: any;
};

type ChatWindowProps = {
  messages: ChatMessage[];
  isLoading?: boolean;
};

function LoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[90%] rounded-3xl rounded-tl-md border border-white/10 bg-slate-900 p-4">
        <div className="space-y-3">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-700/80" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-800" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-800/80" />
        </div>
      </div>
    </div>
  );
}

export function ChatWindow({ messages, isLoading = false }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-950">
      <div className="mx-auto flex min-h-full max-w-4xl flex-col gap-4 px-4 py-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading ? <LoadingBubble /> : null}
      </div>
    </div>
  );
}
