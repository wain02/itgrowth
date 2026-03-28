const WEBHOOK_URL = "https://k1000o.app.n8n.cloud/webhook/growth-analysis";

// Contexto embebido para que n8n actúe como Senior Growth Manager.
const SYSTEM_PROMPT = [
  "Actúa como un Senior Growth Manager.",
  "Analiza los datos del dashboard de ventas con foco en clicks, conversiones y ventas.",
  "Devuelve exactamente 3 acciones inmediatas, concretas y priorizadas para mejorar resultados.",
  "Usa un tono profesional, directo y orientado a negocio.",
  "Si faltan datos, indica supuestos mínimos y sigue proponiendo acciones accionables."
].join(" ");

const analyzeBtn = document.getElementById("analyzeBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const chatPanel = document.getElementById("chatPanel");
const chatTranscript = document.getElementById("chatTranscript");
const chatEmpty = document.getElementById("chatEmpty");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

let dashboardContext = null;
let analysisMarkdown = "";
let conversationHistory = [];

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function setResult(message) {
  resultEl.innerHTML = renderMarkdown(message);
}

function setChatEnabled(enabled) {
  chatPanel.classList.toggle("visible", enabled);
  chatInput.disabled = !enabled;
  sendBtn.disabled = !enabled;
  if (enabled) {
    chatInput.focus();
  }
}

function renderChatMessage(role, content) {
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;

  if (role === "assistant") {
    message.innerHTML = renderMarkdown(content);
  } else {
    message.innerHTML = `<p>${renderInlineMarkdown(content)}</p>`;
  }

  return message;
}

function appendChatMessage(role, content) {
  if (chatEmpty) {
    chatEmpty.remove();
  }

  const message = renderChatMessage(role, content);
  chatTranscript.appendChild(message);
  chatTranscript.scrollTop = chatTranscript.scrollHeight;
}

function resetChatTranscript() {
  chatTranscript.innerHTML = "";
  chatTranscript.appendChild(chatEmpty);
}

function pushConversation(role, content) {
  conversationHistory.push({ role, content });
}

function normalizeWebhookText(text) {
  return String(text)
    .trim()
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, "\t");
}

function formatResponse(payload) {
  if (payload == null) {
    return "Sin respuesta del webhook.";
  }

  if (typeof payload === "string") {
    const trimmed = normalizeWebhookText(payload);
    return trimmed || "Sin respuesta del webhook.";
  }

  if (typeof payload === "object") {
    if (typeof payload.markdown === "string") {
      return normalizeWebhookText(payload.markdown);
    }

    if (typeof payload.output === "string") {
      return normalizeWebhookText(payload.output);
    }

    if (typeof payload.data === "string") {
      return normalizeWebhookText(payload.data);
    }

    if (payload.data && typeof payload.data === "object") {
      if (typeof payload.data.markdown === "string") {
        return normalizeWebhookText(payload.data.markdown);
      }

      if (typeof payload.data.output === "string") {
        return normalizeWebhookText(payload.data.output);
      }

      if (typeof payload.data.data === "string") {
        return normalizeWebhookText(payload.data.data);
      }

      return JSON.stringify(payload.data, null, 2);
    }

    if (typeof payload.result === "string") {
      return normalizeWebhookText(payload.result);
    }

    return JSON.stringify(payload, null, 2);
  }

  return String(payload);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineMarkdown(text) {
  const safeText = escapeHtml(text);

  return safeText
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderMarkdown(markdown) {
  const text = String(markdown || "").trim();
  if (!text) {
    return "";
  }

  const lines = text.split(/\r?\n/);
  const blocks = [];
  let currentList = null;
  let inCodeBlock = false;
  let codeBuffer = [];

  const flushList = () => {
    if (!currentList) return;
    const tag = currentList.type === "ol" ? "ol" : "ul";
    blocks.push(`<${tag}>${currentList.items.join("")}</${tag}>`);
    currentList = null;
  };

  const flushCode = () => {
    if (!inCodeBlock) return;
    blocks.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
    codeBuffer = [];
    inCodeBlock = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushList();
        inCodeBlock = true;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      blocks.push(
        `<h${level}>${renderInlineMarkdown(headingMatch[2].trim())}</h${level}>`
      );
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(`<li>${renderInlineMarkdown(bulletMatch[1].trim())}</li>`);
      continue;
    }

    const numberedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (numberedMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(`<li>${renderInlineMarkdown(numberedMatch[1].trim())}</li>`);
      continue;
    }

    if (line.startsWith("> ")) {
      flushList();
      blocks.push(`<blockquote>${renderInlineMarkdown(line.slice(2).trim())}</blockquote>`);
      continue;
    }

    if (!line.trim()) {
      flushList();
      continue;
    }

    flushList();
    blocks.push(`<p>${renderInlineMarkdown(line.trim())}</p>`);
  }

  flushList();
  flushCode();

  return blocks.join("\n");
}

function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!tab || typeof tab.id !== "number") {
        reject(new Error("No se encontró una pestaña activa."));
        return;
      }
      resolve(tab);
    });
  });
}

function injectDashboardExtractor(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["content.js"]
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve();
      }
    );
  });
}

function runDashboardExtractor(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          if (typeof window.__growthManagerExtractDashboard === "function") {
            return window.__growthManagerExtractDashboard();
          }

          return {
            pageTitle: document.title || "",
            pageUrl: window.location.href,
            extractedText: (document.body && document.body.innerText) || ""
          };
        }
      },
      (results) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        const extracted = results && results[0] ? results[0].result : null;
        if (!extracted || !extracted.extractedText) {
          reject(new Error("No fue posible extraer datos del dashboard."));
          return;
        }

        resolve(extracted);
      }
    );
  });
}

async function sendToWebhook(dashboardData) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/plain, */*"
    },
    body: JSON.stringify({
      systemPrompt: SYSTEM_PROMPT,
      source: "growth-manager-connector",
      mode: "analysis",
      dashboard: dashboardData,
      conversationHistory: []
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `El webhook respondió con error HTTP ${response.status}. ${errorText}`.trim()
    );
  }

  const rawBody = await response.text();
  if (!rawBody.trim()) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const looksLikeJson =
    contentType.includes("application/json") ||
    rawBody.trim().startsWith("{") ||
    rawBody.trim().startsWith("[");

  if (looksLikeJson) {
    try {
      return JSON.parse(rawBody);
    } catch (error) {
      // Si n8n marca JSON pero devuelve un cuerpo inválido, mostramos el texto crudo.
      return rawBody;
    }
  }

  return rawBody;
}

async function sendChatToWebhook(message) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/plain, */*"
    },
    body: JSON.stringify({
      systemPrompt: SYSTEM_PROMPT,
      source: "growth-manager-connector",
      mode: "chat",
      dashboard: dashboardContext,
      analysisMarkdown,
      message,
      conversationHistory
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `El webhook respondió con error HTTP ${response.status}. ${errorText}`.trim()
    );
  }

  const rawBody = await response.text();
  if (!rawBody.trim()) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const looksLikeJson =
    contentType.includes("application/json") ||
    rawBody.trim().startsWith("{") ||
    rawBody.trim().startsWith("[");

  if (looksLikeJson) {
    try {
      return JSON.parse(rawBody);
    } catch (error) {
      return rawBody;
    }
  }

  return rawBody;
}

analyzeBtn.addEventListener("click", async () => {
  analyzeBtn.disabled = true;
  setStatus("Analizando...");
  setResult("");
  resetChatTranscript();
  setChatEnabled(false);
  conversationHistory = [];
  dashboardContext = null;
  analysisMarkdown = "";

  try {
    const tab = await getActiveTab();
    await injectDashboardExtractor(tab.id);
    const dashboardData = await runDashboardExtractor(tab.id);
    dashboardContext = dashboardData;

    setStatus("Enviando datos al Growth Manager...");
    const webhookResponse = await sendToWebhook(dashboardData);
    analysisMarkdown = formatResponse(webhookResponse);
    conversationHistory.push({ role: "assistant", content: analysisMarkdown });

    setStatus("Análisis completado.");
    setResult(analysisMarkdown);
    appendChatMessage("assistant", analysisMarkdown);
    setChatEnabled(true);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    setStatus(`Error: ${message}`, true);
    setChatEnabled(false);
    setResult(
      [
        "# Error",
        "",
        "No se pudo completar el análisis.",
        "",
        `- ${message}`
      ].join("\n")
    );
  } finally {
    analyzeBtn.disabled = false;
  }
});

async function handleChatSend() {
  const userMessage = chatInput.value.trim();
  if (!userMessage || !dashboardContext) {
    return;
  }

  chatInput.value = "";
  sendBtn.disabled = true;
  chatInput.disabled = true;
  setStatus("Pensando respuesta...");
  appendChatMessage("user", userMessage);
  pushConversation("user", userMessage);

  try {
    const webhookResponse = await sendChatToWebhook(userMessage);
    const assistantMessage = formatResponse(webhookResponse);
    pushConversation("assistant", assistantMessage);
    appendChatMessage("assistant", assistantMessage);
    setStatus("Listo.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    setStatus(`Error: ${message}`, true);
    appendChatMessage(
      "assistant",
      `# Error\n\nNo pude responder en este turno.\n\n- ${message}`
    );
    pushConversation(
      "assistant",
      `# Error\n\nNo pude responder en este turno.\n\n- ${message}`
    );
  } finally {
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }
}

sendBtn.addEventListener("click", handleChatSend);

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleChatSend();
  }
});
