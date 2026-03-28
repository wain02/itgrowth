export type GoogleTrendItem = {
  term?: string;
  keyword?: string;
  label?: string;
  value?: number;
  score?: number;
  trend?: number;
  region?: string;
  growth?: string;
  [key: string]: unknown;
};

export type PublicationStyleItem = {
  id?: string;
  key?: string;
  name?: string;
  title?: string;
  label?: string;
  content?: string;
  text?: string;
  markdown?: string;
  [key: string]: unknown;
};

export type N8nChatResponse = {
  output?: string;
  googleTrends?: GoogleTrendItem[];
  google_trends?: GoogleTrendItem[];
  imageUrl?: string;
  image_url?: string;
  publicationStyles?: PublicationStyleItem[];
  publication_styles?: PublicationStyleItem[];
  sessionId?: string;
  session_id?: string;
  [key: string]: unknown;
};

type ChatRequestPayload = {
  chatInput: string;
  sessionId?: string;
};

function normalizeWebhookText(text: string) {
  return text
    .trim()
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, "\t");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function unwrapStructuredPayload(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value)) {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const nestedKeys = ["data", "body", "result"];

  for (const key of nestedKeys) {
    const nested = candidate[key];
    if (isRecord(nested)) {
      const unwrapped = unwrapStructuredPayload(nested);
      if (unwrapped) {
        return unwrapped;
      }
      return nested;
    }
  }

  return candidate;
}

function normalizeResponseShape(value: unknown): N8nChatResponse {
  if (typeof value === "string") {
    return {
      output: normalizeWebhookText(value),
    };
  }

  const record = unwrapStructuredPayload(value);
  if (!record) {
    return {
      output: "",
    };
  }

  const outputCandidate =
    typeof record.output === "string"
      ? record.output
      : typeof record.markdown === "string"
        ? record.markdown
        : typeof record.text === "string"
          ? record.text
          : typeof record.content === "string"
            ? record.content
            : typeof record.result === "string"
              ? record.result
              : "";

  const googleTrendsCandidate =
    Array.isArray(record.googleTrends) && record.googleTrends.length
      ? record.googleTrends
      : Array.isArray(record.google_trends) && record.google_trends.length
        ? record.google_trends
        : undefined;

  const publicationStylesCandidate =
    Array.isArray(record.publicationStyles) && record.publicationStyles.length
      ? record.publicationStyles
      : Array.isArray(record.publication_styles) && record.publication_styles.length
        ? record.publication_styles
        : undefined;

  const imageUrlCandidate =
    typeof record.imageUrl === "string"
      ? record.imageUrl
      : typeof record.image_url === "string"
        ? record.image_url
        : typeof record.generatedImageUrl === "string"
          ? record.generatedImageUrl
          : typeof record.generated_image_url === "string"
            ? record.generated_image_url
            : undefined;

  const sessionIdCandidate =
    typeof record.sessionId === "string"
      ? record.sessionId
      : typeof record.session_id === "string"
        ? record.session_id
        : undefined;

  return {
    ...record,
    output: normalizeWebhookText(outputCandidate),
    googleTrends: googleTrendsCandidate,
    publicationStyles: publicationStylesCandidate,
    imageUrl: imageUrlCandidate,
    sessionId: sessionIdCandidate,
  };
}

export async function consultarAgenteN8n(
  chatInput: string,
  sessionId?: string
): Promise<N8nChatResponse> {
  const trimmedInput = chatInput.trim();

  if (!trimmedInput) {
    throw new Error("El prompt no puede estar vacío.");
  }

  const payload: ChatRequestPayload = {
    chatInput: trimmedInput,
  };

  if (sessionId) {
    payload.sessionId = sessionId;
  }

  try {
    const response = await fetch(
      "https://martinwain.app.n8n.cloud/webhook/4d741b12-cbbe-4657-ac92-a98d4c277eee/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `El webhook respondió con error HTTP ${response.status}. ${errorText}`.trim()
      );
    }

    const rawBody = await response.text();

    if (!rawBody.trim()) {
      return { output: "" };
    }

    const looksLikeJson = rawBody.trim().startsWith("{") || rawBody.trim().startsWith("[");

    if (looksLikeJson) {
      try {
        const parsed = JSON.parse(rawBody) as unknown;
        return normalizeResponseShape(parsed);
      } catch {
        return normalizeResponseShape(rawBody);
      }
    }

    return normalizeResponseShape(rawBody);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al consultar n8n: ${error.message}`);
    }

    throw new Error("Error desconocido al consultar n8n.");
  }
}
