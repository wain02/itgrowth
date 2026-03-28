import { useState } from "react";
import { ChatInput } from "./components/ChatInput";
import { ChatWindow } from "./components/ChatWindow";
import { consultarAgenteN8n } from "./api/client";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string | { error: string };
};

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "assistant",
      content:
        "Describe una idea de producto y te devolveré señales de marketing, sentimiento del subreddit, ángulo creativo y un borrador de copy.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend(ideaProducto: string) {
    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: ideaProducto,
    };

    // Flujo unidireccional: primero agregamos el mensaje del usuario al estado,
    // luego disparamos la promesa del webhook y, al resolverse, anexamos la respuesta.
    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    try {
      const response = await consultarAgenteN8n(ideaProducto);

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: response,
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al consultar el agente.";

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: { error: errorMessage },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
              Reddit Trend Analyzer
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Agente de Análisis de Tendencias de Reddit
            </h1>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
            Vite + React + Tailwind
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </main>
    </div>
  );
}
