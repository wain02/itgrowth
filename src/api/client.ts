export interface RedditAnalyzerResponse {
  subreddit_analizado: string;
  sentiment_index: number;
  marketing_signal: string;
  ad_copy_draft: string;
  angle_rationale: string;
}

type WebhookPayload = {
  product_idea: string;
};

function isRedditAnalyzerResponse(value: unknown): value is RedditAnalyzerResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.subreddit_analizado === "string" &&
    typeof candidate.sentiment_index === "number" &&
    typeof candidate.marketing_signal === "string" &&
    typeof candidate.ad_copy_draft === "string" &&
    typeof candidate.angle_rationale === "string"
  );
}

function normalizeWebhookText(text: string) {
  return text
    .trim()
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, "\t");
}

function unwrapKnownPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  if (typeof candidate.markdown === "string") {
    return normalizeWebhookText(candidate.markdown);
  }

  if (typeof candidate.output === "string") {
    return normalizeWebhookText(candidate.output);
  }

  if (typeof candidate.data === "string") {
    return normalizeWebhookText(candidate.data);
  }

  if (candidate.data && typeof candidate.data === "object") {
    const nested = candidate.data as Record<string, unknown>;

    if (typeof nested.markdown === "string") {
      return normalizeWebhookText(nested.markdown);
    }

    if (typeof nested.output === "string") {
      return normalizeWebhookText(nested.output);
    }

    if (typeof nested.data === "string") {
      return normalizeWebhookText(nested.data);
    }
  }

  if (typeof candidate.result === "string") {
    return normalizeWebhookText(candidate.result);
  }

  return null;
}

export async function consultarAgenteN8n(
  ideaProducto: string
): Promise<string> {
  const trimmedIdea = ideaProducto.trim();

  if (!trimmedIdea) {
    throw new Error("La idea de producto no puede estar vacía.");
  }

  const payload: WebhookPayload = {
    product_idea: trimmedIdea,
  };

  try {
    const response = await fetch(
      "https://k1000o.app.n8n.cloud/webhook/reddit-analyzer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      throw new Error("La respuesta del webhook llegó vacía.");
    }

    const looksLikeJson = rawBody.trim().startsWith("{") || rawBody.trim().startsWith("[");

    if (looksLikeJson) {
      try {
        const parsedBody: unknown = JSON.parse(rawBody) as unknown;
        const output = unwrapKnownPayload(parsedBody);

        if (output) {
          return output;
        }
      } catch {
        return normalizeWebhookText(rawBody);
      }
    }

    return normalizeWebhookText(rawBody);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al consultar n8n: ${error.message}`);
    }

    throw new Error("Error desconocido al consultar n8n.");
  }
}
