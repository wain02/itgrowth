import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { ChatWindow } from "./ChatWindow";
import { consultarAgenteN8n } from "../api/client";
import type { Message } from "../types/chat";
import { motion } from "motion/react";
import appLogo from "../../logo.svg";

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

type ChatbotViewProps = {
  onBackToLanding: () => void;
};

export function ChatbotView({ onBackToLanding }: ChatbotViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: createId(),
      role: "assistant",
      content:
        "Describe una idea de producto y te devolveré señales, tendencias, una pieza de contenido y un análisis accionable.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => createId());

  async function handleSend(ideaProducto: string) {
    const userMessage: Message = {
      id: createId(),
      role: "user",
      content: ideaProducto,
    };

    // Flujo unidireccional: primero agregamos el mensaje del usuario al estado,
    // luego disparamos la promesa del webhook y, al resolverse, anexamos la respuesta.
    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    try {
      const response = await consultarAgenteN8n(ideaProducto, sessionId);
      const nextSessionId =
        typeof response.sessionId === "string" && response.sessionId.trim()
          ? response.sessionId
          : typeof response.session_id === "string" && response.session_id.trim()
            ? response.session_id
            : sessionId;
      setSessionId(nextSessionId);

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
    <div className="flex h-full flex-col overflow-hidden bg-[#04060a] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,0.1),rgba(0,0,0,0)_26%),radial-gradient(circle_at_70%_40%,rgba(59,130,246,0.08),rgba(0,0,0,0)_28%)]" />

      <header className="shrink-0 border-b border-white/10 bg-black/35 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src={appLogo}
              alt="ITGrowth"
              className="h-10 w-10 object-contain shadow-[0_0_28px_rgba(34,211,238,0.45)]"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-200/75">
                ITGrowth
              </p>
              <h1 className="mt-1 text-lg font-light tracking-[-0.03em] text-white sm:text-xl">
                Agente de Análisis de Tendencias de Reddit
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={onBackToLanding}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/75 backdrop-blur-md transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la portada
            </motion.button>

            <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
              Vite + React + Tailwind
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </main>
    </div>
  );
}
