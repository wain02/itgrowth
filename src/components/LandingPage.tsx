import {
  ArrowRight,
  CreditCard,
  LineChart,
  MessagesSquare,
  ShieldCheck,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import appLogo from "../../logo.svg";

type LandingPageProps = {
  onOpenAssistant: () => void;
};

const modes = [
  {
    key: "trends",
    title: "Trend analysis",
    subtitle: "Spot demand before competitors do.",
    stat: "Realtime signals",
  },
  {
    key: "ads",
    title: "Ad generation",
    subtitle: "Turn insight into copy that feels native.",
    stat: "Campaign-ready copy",
  },
  {
    key: "testing",
    title: "A/B testing",
    subtitle: "Validate angles with lower risk.",
    stat: "Faster iteration",
  },
] as const;

const plans = [
  {
    name: "Basic",
    price: "US$19/mes",
    description: "Para validar la propuesta y probar señales de tendencia sin fricción.",
    badge: "Starter",
  },
  {
    name: "Pro",
    price: "US$49/mes o US$470/año",
    description: "Para equipos que quieren análisis continuo, copies y optimización.",
    badge: "Recommended",
  },
  {
    name: "Pro+",
    price: "US$890/año solamente",
    description: "Para uso intensivo, priorización y escalado con foco en performance.",
    badge: "Annual only",
  },
] as const;

export function LandingPage({ onOpenAssistant }: LandingPageProps) {
  const [activeMode, setActiveMode] =
    useState<(typeof modes)[number]["key"]>("trends");
  const [showBilling, setShowBilling] = useState(false);

  const currentMode = useMemo(
    () => modes.find((mode) => mode.key === activeMode) ?? modes[0],
    [activeMode]
  );

  const metrics = useMemo(
    () => [
      { label: "Signal quality", value: activeMode === "trends" ? "High" : "Adaptive" },
      { label: "Creative output", value: activeMode === "ads" ? "Ready" : "Dynamic" },
      { label: "Optimization loop", value: activeMode === "testing" ? "Fast" : "Smart" },
    ],
    [activeMode]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04060a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.18),rgba(0,0,0,0)_22%),radial-gradient(circle_at_57%_52%,rgba(59,130,246,0.16),rgba(0,0,0,0)_34%),radial-gradient(circle_at_center,rgba(0,0,0,0.15),rgba(0,0,0,0.96)_74%)]" />
      <div className="absolute inset-3 border border-white/10" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-full w-[32vw] max-w-[560px] opacity-55">
          <svg
            className="absolute inset-0 h-full w-full text-cyan-200/35"
            viewBox="0 0 800 900"
            fill="none"
            aria-hidden="true"
          >
            <g stroke="currentColor" strokeWidth="1">
              <path d="M60 100 L180 180 L260 110 L360 200 L460 140 L620 250 L740 180" />
              <path d="M120 240 L240 320 L340 260 L450 360 L560 300 L690 420" />
              <path d="M30 420 L160 520 L260 450 L340 540 L470 470 L620 560 L760 510" />
              <path d="M80 650 L180 600 L300 700 L410 620 L540 740 L680 660" />
              <circle cx="180" cy="180" r="3" fill="currentColor" />
              <circle cx="260" cy="110" r="3" fill="currentColor" />
              <circle cx="360" cy="200" r="3" fill="currentColor" />
              <circle cx="460" cy="140" r="3" fill="currentColor" />
              <circle cx="620" cy="250" r="3" fill="currentColor" />
              <circle cx="260" cy="320" r="3" fill="currentColor" />
              <circle cx="450" cy="360" r="3" fill="currentColor" />
              <circle cx="690" cy="420" r="3" fill="currentColor" />
              <circle cx="300" cy="700" r="3" fill="currentColor" />
              <circle cx="540" cy="740" r="3" fill="currentColor" />
            </g>
          </svg>
          <div className="absolute right-10 top-14 h-72 w-72 rounded-full bg-cyan-400/16 blur-[110px]" />
          <div className="absolute right-24 top-[24%] h-48 w-48 rounded-full bg-blue-500/16 blur-[100px]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <img
              src={appLogo}
              alt="ITGrowth"
              className="h-11 w-11 object-contain shadow-[0_0_28px_rgba(34,211,238,0.55)]"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.38em] text-cyan-200/75">
                ITGrowth
              </p>
              <p className="text-xs text-white/45">Trend-driven ads engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => setShowBilling(true)}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white"
            >
              <CreditCard className="h-4 w-4" />
              Billing
            </motion.button>

            <motion.button
              type="button"
              onClick={onOpenAssistant}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-cyan-50 backdrop-blur-md transition hover:border-cyan-200/60 hover:bg-cyan-400/15 hover:text-white"
            >
              <MessagesSquare className="h-4 w-4" />
              Chat with AI
            </motion.button>
          </div>
        </header>

        <main className="grid flex-1 items-center gap-10 pt-4 lg:grid-cols-[1.02fr_0.98fr] lg:pt-6">
          <section className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md"
            >
              <Wand2 className="h-3.5 w-3.5 text-cyan-300" />
              AI-powered trend analysis and ad generation
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            >
              <h1 className="max-w-[760px] text-[clamp(3rem,6.3vw,6.7rem)] font-light uppercase leading-[0.92] tracking-[-0.08em] text-white">
                Trend-Driven Ads Engine
                <span className="mt-2 block">AI-Powered Trend Analysis</span>
                <span className="mt-2 block">&amp; Ad Generation</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
              className="mt-5 max-w-2xl text-[15px] leading-7 text-white/72 sm:text-[16px]"
            >
              Transform trends into actionable campaigns. Discover what people want,
              validate opportunities, and launch better ideas with an AI assistant.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.16 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <motion.button
                type="button"
                onClick={onOpenAssistant}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2 border border-cyan-300/30 bg-cyan-400/12 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(34,211,238,0.16)] transition hover:border-cyan-200/60 hover:bg-cyan-400/16"
              >
                Open AI Assistant
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setShowBilling(true)}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10"
              >
                <CreditCard className="h-4 w-4" />
                Billing
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {modes.map((mode) => {
                const isActive = mode.key === activeMode;
                return (
                  <motion.button
                    key={mode.key}
                    type="button"
                    onClick={() => setActiveMode(mode.key)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={[
                      "border p-4 text-left transition duration-300",
                      isActive
                        ? "border-cyan-300/40 bg-white/10 shadow-[0_0_40px_rgba(34,211,238,0.12)]"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-200/65">
                      {mode.stat}
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">{mode.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/62">{mode.subtitle}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          </section>

          <section className="relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.08 }}
              className="relative w-full max-w-[560px]"
            >
              <div className="absolute left-6 top-10 h-56 w-56 rounded-full bg-cyan-400/16 blur-[90px]" />
              <div className="absolute right-0 top-32 h-64 w-64 rounded-full bg-blue-500/16 blur-[100px]" />

              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                className="relative mx-auto aspect-[4/5] w-full border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              >
                <div className="flex h-full flex-col justify-between border border-white/8 bg-[linear-gradient(180deg,rgba(10,14,22,0.92),rgba(6,10,16,0.84))] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">
                        Live Assistant
                      </p>
                      <h2 className="mt-2 text-2xl font-light tracking-[-0.05em] text-white">
                        {currentMode.title}
                      </h2>
                    </div>

                    <div className="border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-50">
                      Premium Preview
                    </div>
                  </div>

                  <div className="relative mt-6 flex flex-1 items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <div className="absolute -right-10 top-20 h-24 w-24 rounded-2xl bg-white/10 blur-xl" />
                      <div className="relative h-56 w-80 rounded-[1.8rem] bg-slate-950 shadow-[0_35px_70px_rgba(0,0,0,0.5)]">
                        <div className="absolute inset-3 rounded-[1.3rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
                        <div className="absolute left-0 top-[52%] h-2 w-full bg-slate-900/80" />
                        <div className="absolute -bottom-4 left-[12%] h-10 w-[76%] rounded-b-[1.8rem] rounded-t-lg bg-gradient-to-r from-slate-700 via-slate-900 to-slate-800 shadow-lg" />
                        <div className="absolute bottom-[-30px] left-[38%] h-5 w-24 rounded-full bg-black/25 blur-xl" />
                      </div>
                    </motion.div>

                    <div className="absolute left-2 top-14 w-40 border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-200/65">
                        Trend signals
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        Extract what people are already asking for and where the opportunity is.
                      </p>
                    </div>

                    <div className="absolute -right-1 bottom-8 w-44 border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-200/65">
                        {metrics[0].label}
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {metrics[0].value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/62">
                        {currentMode.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="border border-white/8 bg-white/5 p-4">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                          {metric.label}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.28 }}
                className="absolute -bottom-5 left-10 flex items-center gap-2 border border-cyan-300/20 bg-white/5 px-4 py-2 text-white/75 backdrop-blur-md"
              >
                <LineChart className="h-4 w-4 text-cyan-300" />
                <span className="text-sm">Trend analysis</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.32 }}
                className="absolute right-6 top-8 flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/75 backdrop-blur-md"
              >
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <span className="text-sm">Validated campaigns</span>
              </motion.div>
            </motion.div>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {showBilling ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md"
            onClick={() => setShowBilling(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative w-full max-w-6xl border border-white/10 bg-[#050913]/95 p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),rgba(0,0,0,0)_32%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.1),rgba(0,0,0,0)_28%)]" />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/65">
                      Billing
                    </p>
                    <h3 className="mt-3 text-3xl font-light tracking-[-0.05em] text-white">
                      Choose the plan that fits your team
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                      Compare the plans in a focused pricing view, without leaving the landing page.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBilling(false)}
                    className="text-sm uppercase tracking-[0.24em] text-white/45 transition hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {plans.map((plan, index) => {
                    const highlight = index === 1;
                    return (
                      <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.06 * index }}
                        whileHover={{ y: -6 }}
                        className={[
                          "relative border p-5",
                          highlight
                            ? "border-cyan-300/30 bg-cyan-400/10 shadow-[0_0_50px_rgba(34,211,238,0.08)]"
                            : "border-white/10 bg-white/5",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/65">
                            {plan.badge}
                          </p>
                          {highlight ? (
                            <span className="border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-50">
                              Best value
                            </span>
                          ) : null}
                        </div>

                        <h4 className="mt-4 text-2xl font-light tracking-[-0.04em] text-white">
                          {plan.name}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                          {plan.description}
                        </p>

                        <div className="mt-6 border-t border-white/10 pt-5">
                          <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                            Price
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-white">
                            {plan.price}
                          </p>
                        </div>

                        <div className="mt-6 space-y-2 text-sm text-white/65">
                          <p>Trend analysis and signal review</p>
                          <p>AI-generated ad angles and copy</p>
                          <p>Interactive workflow with the assistant</p>
                        </div>

                        <motion.button
                          type="button"
                          whileHover={{ y: -1, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className={[
                            "mt-6 w-full border px-4 py-3 text-sm uppercase tracking-[0.24em] transition",
                            highlight
                              ? "border-cyan-300/40 bg-cyan-400/15 text-white"
                              : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {index === 0 ? "Start now" : "Select plan"}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm text-white/55">
                  <p>All plans include the same assistant flow already integrated in the app.</p>
                  <motion.button
                    type="button"
                    onClick={onOpenAssistant}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-white"
                  >
                    Chat with AI
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
