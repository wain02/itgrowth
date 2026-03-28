import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { ChatbotView } from "./components/ChatbotView";

export default function App() {
  const [activeView, setActiveView] = useState<"landing" | "chat">("landing");

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className={[
          "absolute inset-0 transition-all duration-700 ease-out",
          activeView === "landing"
            ? "z-20 opacity-100 translate-y-0 scale-100 blur-0"
            : "pointer-events-none z-10 opacity-0 -translate-y-3 scale-[0.985] blur-sm",
        ].join(" ")}
        aria-hidden={activeView !== "landing"}
      >
        <LandingPage onOpenAssistant={() => setActiveView("chat")} />
      </div>

      <div
        className={[
          "absolute inset-0 transition-all duration-700 ease-out",
          activeView === "chat"
            ? "z-30 opacity-100 translate-y-0 scale-100 blur-0"
            : "pointer-events-none z-10 opacity-0 translate-y-3 scale-[0.99] blur-sm",
        ].join(" ")}
        aria-hidden={activeView !== "chat"}
      >
        <ChatbotView />
      </div>
    </div>
  );
}
