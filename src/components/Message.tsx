import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { RedditAnalyzerResponse } from "../api/client";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string | RedditAnalyzerResponse | { error: string };
};

type MessageProps = {
  message: ChatMessage;
};

function formatSentimentColor(sentimentIndex: number) {
  if (sentimentIndex >= 70) {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-400/20";
  }

  if (sentimentIndex >= 40) {
    return "bg-amber-500/15 text-amber-300 border-amber-400/20";
  }

  return "bg-rose-500/15 text-rose-300 border-rose-400/20";
}

function isRedditAnalyzerResponse(content: unknown): content is RedditAnalyzerResponse {
  if (!content || typeof content !== "object") {
    return false;
  }

  const candidate = content as Record<string, unknown>;

  return (
    typeof candidate.subreddit_analizado === "string" &&
    typeof candidate.sentiment_index === "number" &&
    typeof candidate.marketing_signal === "string" &&
    typeof candidate.ad_copy_draft === "string" &&
    typeof candidate.angle_rationale === "string"
  );
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-3xl rounded-tr-md border border-cyan-400/15 bg-cyan-500/10 px-4 py-3 text-sm leading-6 text-slate-100 shadow-lg shadow-cyan-950/10">
          {String(message.content)}
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
        <div className="max-w-[85%] rounded-3xl rounded-tl-md border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
          <p className="text-xs uppercase tracking-[0.18em] text-rose-300">
            Error del webhook
          </p>
          <p className="mt-2">{String((message.content as { error: unknown }).error)}</p>
        </div>
      </div>
    );
  }

  if (typeof message.content === "string") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-3xl rounded-tl-md border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => (
                <h1 className="mb-3 text-xl font-semibold text-white" {...props} />
              ),
              h2: (props) => (
                <h2 className="mb-2 mt-4 text-lg font-semibold text-white" {...props} />
              ),
              h3: (props) => (
                <h3 className="mb-2 mt-3 text-base font-semibold text-white" {...props} />
              ),
              p: (props) => <p className="mb-3 last:mb-0" {...props} />,
              ul: (props) => (
                <ul className="mb-3 list-disc space-y-2 pl-5 last:mb-0" {...props} />
              ),
              ol: (props) => (
                <ol className="mb-3 list-decimal space-y-2 pl-5 last:mb-0" {...props} />
              ),
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
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  if (!isRedditAnalyzerResponse(message.content)) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-3xl rounded-tl-md border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200">
          {typeof message.content === "string"
            ? message.content
            : JSON.stringify(message.content, null, 2)}
        </div>
      </div>
    );
  }

  const analysis = message.content;
  const sentimentClass = formatSentimentColor(analysis.sentiment_index);

  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[90%] rounded-3xl rounded-tl-md border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-slate-950/20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Análisis de Reddit
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              {analysis.subreddit_analizado}
            </h3>
          </div>

          <div
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${sentimentClass}`}
          >
            Sentiment index: {analysis.sentiment_index}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Marketing signal
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {analysis.marketing_signal}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 md:col-span-1">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Angle rationale
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {analysis.angle_rationale}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
              Ad copy draft
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-cyan-50">
              {analysis.ad_copy_draft}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
