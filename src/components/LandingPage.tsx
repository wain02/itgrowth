import { ArrowRight, Sparkles, Wand2, LineChart, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

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

export function LandingPage({ onOpenAssistant }: LandingPageProps) {
  const [activeMode, setActiveMode] = useState<(typeof modes)[number]["key"]>("trends");
  const [showHowItWorks, setShowHowItWorks] = useState(false);

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
    <div className="relative flex h-full min-h-0 overflow-hidden bg-[#f8fbff] text-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute right-[-80px] top-32 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/3 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-full w-[48%] opacity-70">
          <div className="absolute right-6 top-10 h-64 w-64 rounded-full border border-cyan-200/70" />
          <div className="absolute right-24 top-24 h-44 w-44 rounded-full border border-cyan-200/50" />
          <div className="absolute right-14 top-16 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.8)]" />
          <div className="absolute right-36 top-40 h-2 w-2 rounded-full bg-sky-300" />
          <svg
            className="absolute inset-0 h-full w-full text-cyan-200/40"
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
        </div>
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f3d74] text-white shadow-lg shadow-cyan-200/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.38em] text-cyan-700/80">
                ITGrowth
              </p>
              <p className="text-xs text-slate-500">Trend-driven ads engine</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAssistant}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
          >
            Open AI Assistant
          </button>
        </header>

        <main className="grid flex-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/90 px-3 py-1.5 text-xs font-medium text-cyan-800 shadow-sm backdrop-blur">
              <Wand2 className="h-3.5 w-3.5" />
              AI-powered trend analysis and ad generation
            </div>

            <h1 className="max-w-xl text-5xl font-light leading-[0.95] tracking-[-0.06em] text-slate-900 sm:text-6xl lg:text-7xl">
              Trend-Driven Ads Engine
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-light leading-8 text-slate-600">
              AI-powered trend analysis and ad generation for modern brands.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              Transform trends into actionable campaigns. Discover what people want, validate
              opportunities, and launch better ideas with an AI assistant.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenAssistant}
                className="group inline-flex items-center gap-2 rounded-full bg-[#103f78] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200/50 transition hover:-translate-y-0.5 hover:bg-[#0c335f]"
              >
                Open AI Assistant
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowHowItWorks((current) => !current)}
                className="rounded-full border border-slate-200 bg-white/90 px-6 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
              >
                See how it works
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {modes.map((mode) => {
                const isActive = mode.key === activeMode;
                return (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={() => setActiveMode(mode.key)}
                    className={[
                      "rounded-3xl border p-4 text-left transition duration-300",
                      isActive
                        ? "border-cyan-200 bg-white shadow-lg shadow-cyan-100/60"
                        : "border-slate-200 bg-white/70 hover:-translate-y-1 hover:bg-white",
                    ].join(" ")}
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-700/70">
                      {mode.stat}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{mode.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{mode.subtitle}</p>
                  </button>
                );
              })}
            </div>

            <div
              className={[
                "mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-500",
                showHowItWorks
                  ? "max-h-72 opacity-100"
                  : "max-h-0 opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-700/70">
                    Step 01
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Detect trend signals and audience pain points.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-700/70">
                    Step 02
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Generate ad angles and publication variants.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-700/70">
                    Step 03
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Launch the assistant and iterate faster.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px]">
              <div className="absolute left-8 top-10 h-56 w-56 rounded-full bg-cyan-200/50 blur-3xl" />
              <div className="absolute right-0 top-32 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl" />

              <div className="relative mx-auto aspect-[4/5] w-full rounded-[2.5rem] border border-white/70 bg-white/70 p-5 shadow-[0_35px_100px_rgba(15,23,42,0.14)] backdrop-blur-xl">
                <div className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-200/80 bg-white/90 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-700/70">
                        Live Assistant
                      </p>
                      <h2 className="mt-2 text-2xl font-light tracking-[-0.05em] text-slate-900">
                        {currentMode.title}
                      </h2>
                    </div>

                    <div className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-800">
                      Premium Preview
                    </div>
                  </div>

                  <div className="relative mt-6 flex flex-1 items-center justify-center">
                    <div className="animate-float-slow relative">
                      <div className="absolute -right-8 top-20 h-24 w-24 rounded-2xl bg-slate-900/10 blur-xl" />
                      <div className="relative h-56 w-80 rounded-[1.8rem] bg-slate-900 shadow-[0_35px_70px_rgba(15,23,42,0.35)]">
                        <div className="absolute inset-3 rounded-[1.3rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
                        <div className="absolute left-0 top-[52%] h-2 w-full bg-slate-950/80" />
                        <div className="absolute -bottom-4 left-[12%] h-10 w-[76%] rounded-b-[1.8rem] rounded-t-lg bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg" />
                        <div className="absolute bottom-[-30px] left-[38%] h-5 w-24 rounded-full bg-slate-900/20 blur-xl" />
                      </div>
                    </div>

                    <div className="absolute left-2 top-14 w-40 rounded-3xl border border-cyan-100 bg-white/90 p-4 shadow-lg shadow-cyan-100/40">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-700/70">
                        Trend signals
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Extract what people are already asking for and where the opportunity is.
                      </p>
                    </div>

                    <div className="absolute -right-1 bottom-8 w-44 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-200/60">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-700/70">
                        {metrics[0].label}
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {metrics[0].value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {currentMode.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                          {metric.label}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 left-10 flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 shadow-sm">
                <LineChart className="h-4 w-4 text-cyan-700" />
                <span className="text-sm text-slate-600">Trend analysis</span>
              </div>

              <div className="absolute right-6 top-8 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-cyan-700" />
                <span className="text-sm text-slate-600">Validated campaigns</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
