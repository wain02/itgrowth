// Extrae el texto principal del dashboard priorizando tablas y bloques de métricas.
function normalizeText(text) {
  return String(text || "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n[ \t]+/g, "\n")
    .trim();
}

function extractTableText(table) {
  const rows = Array.from(table.querySelectorAll("tr"));
  const lines = rows
    .map((row) => {
      const cells = Array.from(row.querySelectorAll("th, td"))
        .map((cell) => normalizeText(cell.textContent))
        .filter(Boolean);
      return cells.join(" | ");
    })
    .filter(Boolean);

  return lines.join("\n");
}

function getCandidateText(element) {
  if (!element) return "";

  if (element.tagName === "TABLE") {
    return extractTableText(element);
  }

  return normalizeText(element.textContent);
}

function scoreCandidate(element) {
  const className = (element.className || "").toString().toLowerCase();
  let score = 0;

  if (element.tagName === "TABLE") score += 100;
  if (className.includes("dashboard")) score += 80;
  if (className.includes("metric")) score += 60;
  if (className.includes("value")) score += 50;
  if (element.querySelector("table")) score += 20;

  const textLength = getCandidateText(element).length;
  score += Math.min(textLength, 500) / 10;

  return score;
}

function extractMainDashboardText() {
  const selectors = [
    "table",
    ".metric",
    ".value",
    ".dashboard",
    "[class*='metric']",
    "[class*='value']",
    "[class*='dashboard']"
  ];

  const uniqueCandidates = new Set();
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => uniqueCandidates.add(node));
  });

  const orderedCandidates = Array.from(uniqueCandidates)
    .map((node) => ({
      node,
      score: scoreCandidate(node)
    }))
    .sort((a, b) => b.score - a.score);

  const bestCandidate = orderedCandidates.find(({ node }) => getCandidateText(node));
  const bestText = bestCandidate ? getCandidateText(bestCandidate.node) : "";

  const fallbackText = normalizeText(
    document.body ? document.body.innerText || document.body.textContent : ""
  );

  const extractedText = normalizeText(bestText || fallbackText);

  return {
    pageTitle: normalizeText(document.title),
    pageUrl: window.location.href,
    extractedText
  };
}

// Se expone en window para que popup.js pueda invocarla después de inyectar este archivo.
window.__growthManagerExtractDashboard = extractMainDashboardText;
