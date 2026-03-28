import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { GoogleTrendItem, N8nChatResponse, PublicationStyleItem } from "../api/client";
import type { Message as ChatMessage } from "../types/chat";

type MessageProps = {
  message: ChatMessage;
};

function isAssistantPayload(content: unknown): content is N8nChatResponse {
  return Boolean(content) && typeof content === "object";
}

function getTextValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getAssistantOutput(payload: N8nChatResponse | Record<string, unknown>) {
  return (
    getTextValue(payload.output) ||
    getTextValue(payload.markdown) ||
    getTextValue(payload.text) ||
    getTextValue(payload.content) ||
    getTextValue(payload.result) ||
    ""
  );
}

function getImageUrl(payload: N8nChatResponse | Record<string, unknown>) {
  return (
    getTextValue(payload.imageUrl) ||
    getTextValue(payload.image_url) ||
    getTextValue(payload.generatedImageUrl) ||
    getTextValue(payload.generated_image_url) ||
    ""
  );
}

function getGoogleTrends(payload: N8nChatResponse | Record<string, unknown>) {
  const trends = payload.googleTrends ?? payload.google_trends;
  return Array.isArray(trends) ? trends : [];
}

function getPublicationStyles(payload: N8nChatResponse | Record<string, unknown>) {
  const styles = payload.publicationStyles ?? payload.publication_styles;
  return Array.isArray(styles) ? styles : [];
}

function formatTrendLabel(item: GoogleTrendItem) {
  return (
    getTextValue(item.term) ||
    getTextValue(item.keyword) ||
    getTextValue(item.label) ||
    "Tendencia"
  );
}

function formatTrendValue(item: GoogleTrendItem) {
  const candidates = [item.value, item.score, item.trend];
  const numeric = candidates.find((candidate) => typeof candidate === "number");
  if (typeof numeric === "number") {
    return String(numeric);
  }

  return getTextValue(item.growth) || "N/D";
}

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => <h1 className="mb-3 text-xl font-semibold text-white" {...props} />,
        h2: (props) => <h2 className="mb-2 mt-4 text-lg font-semibold text-white" {...props} />,
        h3: (props) => <h3 className="mb-2 mt-3 text-base font-semibold text-white" {...props} />,
        p: (props) => <p className="mb-3 last:mb-0" {...props} />,
        ul: (props) => <ul className="mb-3 list-disc space-y-2 pl-5 last:mb-0" {...props} />,
        ol: (props) => <ol className="mb-3 list-decimal space-y-2 pl-5 last:mb-0" {...props} />,
        li: (props) => <li className="leading-6" {...props} />,
        strong: (props) => <strong className="font-semibold text-white" {...props} />,
        blockquote: (props) => (
          <blockquote
            className="mb-3 border-l-2 border-cyan-400/40 pl-4 italic text-cyan-100 last:mb-0"
            {...props}
          />
        ),
        code: (props) => (
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-cyan-200" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function Tabs({ styles }: { styles: PublicationStyleItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!styles.length) {
    return null;
  }

  const activeStyle = styles[activeIndex] ?? styles[0];
  const title =
    getTextValue(activeStyle.title) ||
    getTextValue(activeStyle.name) ||
    getTextValue(activeStyle.label) ||
    `Estilo ${activeIndex + 1}`;
  const body =
    getTextValue(activeStyle.markdown) ||
    getTextValue(activeStyle.content) ||
    getTextValue(activeStyle.text) ||
    "";

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {styles.slice(0, 3).map((style, index) => {
            const tabTitle =
              getTextValue(style.title) ||
              getTextValue(style.name) ||
              getTextValue(style.label) ||
              `Estilo ${index + 1}`;
            const isActive = index === activeIndex;

            return (
              <button
                key={`${tabTitle}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  isActive
                    ? "border-cyan-400/30 bg-cyan-500/15 text-cyan-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
                ].join(" ")}
              >
                {tabTitle}
              </button>
            );
          })}
        </div>

        {styles.length > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current - 1 + styles.length) % styles.length)
              }
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
              aria-label="Estilo anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % styles.length)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
              aria-label="Estilo siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-500">
          {title}
        </p>
        <div className="text-sm leading-6 text-slate-200">
          {body ? <MarkdownRenderer content={body} /> : <p>Sin contenido para este estilo.</p>}
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({ payload }: { payload: N8nChatResponse | Record<string, unknown> }) {
  const output = getAssistantOutput(payload);
  const trends = getGoogleTrends(payload);
  const imageUrl = getImageUrl(payload);
  const styles = getPublicationStyles(payload);

  return (
    <div className="w-full rounded-3xl rounded-tl-md border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-slate-950/20">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-semibold text-white">IA</span>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-200">
          Analysis
        </span>
      </div>

      {output ? (
        <div className="mb-5 text-sm leading-6 text-slate-200">
          <MarkdownRenderer content={output} />
        </div>
      ) : null}

      {trends.length ? (
        <div className="mb-5 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-300" />
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Google Trends
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trends.slice(0, 6).map((item, index) => (
              <div
                key={`${formatTrendLabel(item)}-${index}`}
                className="rounded-2xl border border-white/10 bg-slate-900 px-3 py-3"
              >
                <p className="text-sm font-semibold text-white">
                  {formatTrendLabel(item)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-200">
                  {formatTrendValue(item)}
                </p>
                {getTextValue(item.region) ? (
                  <p className="mt-2 text-xs text-slate-500">{getTextValue(item.region)}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {imageUrl ? (
        <div className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <ImageIcon className="h-4 w-4 text-cyan-300" />
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Imagen generada
            </p>
          </div>
          <img
            src={imageUrl}
            alt="Imagen generada por n8n"
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null}

      {styles.length ? <Tabs styles={styles.slice(0, 3)} /> : null}
    </div>
  );
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[85%] items-start gap-3">
          <div className="rounded-3xl rounded-tr-md border border-cyan-400/15 bg-cyan-500/10 px-4 py-3 text-sm leading-6 text-slate-100 shadow-lg shadow-cyan-950/10">
            {String(message.content)}
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
            <UserRound className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }

  if (
    message.content &&
    typeof message.content === "object" &&
    "error" in message.content
  ) {
    return (
      <div className="flex justify-start">
        <div className="flex max-w-[92%] items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-400/20 bg-rose-500/10 text-rose-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="rounded-3xl rounded-tl-md border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
            <p className="text-xs uppercase tracking-[0.18em] text-rose-300">
              Error del webhook
            </p>
            <p className="mt-2">{String((message.content as { error: unknown }).error)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (typeof message.content === "string") {
    return (
      <div className="flex justify-start">
        <div className="flex max-w-[92%] items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="w-full rounded-3xl rounded-tl-md border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-200">
            <MarkdownRenderer content={message.content} />
          </div>
        </div>
      </div>
    );
  }

  if (isAssistantPayload(message.content)) {
    return (
      <div className="flex justify-start">
        <div className="flex w-full max-w-[92%] items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <AssistantMessage payload={message.content} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] rounded-3xl rounded-tl-md border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200">
        {JSON.stringify(message.content, null, 2)}
      </div>
    </div>
  );
}
