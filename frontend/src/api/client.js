const API_BASE = "/api/v1";

const buildApiErrorMessage = (response, data, rawText) => {
  const validationErrors = [];

  if (data && data.errors && typeof data.errors === "object") {
    for (const [field, messages] of Object.entries(data.errors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        validationErrors.push(`${field}: ${messages.join(", ")}`);
      }
    }
  }

  const trimmedText = rawText?.trim() || "";
  const isHtmlResponse = trimmedText.startsWith("<") && trimmedText.includes("<html");

  const baseMessage =
    data?.message ||
    data?.error ||
    (isHtmlResponse
      ? `Server error (${response.status}). Check that backend is running correctly.`
      : trimmedText || `Request failed (${response.status})`);

  if (validationErrors.length === 0) {
    return baseMessage;
  }

  if (baseMessage.toLowerCase().includes("validation")) {
    return `${baseMessage}. ${validationErrors.join(" | ")}`;
  }

  return `${baseMessage} | ${validationErrors.join(" | ")}`;
};

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, token } = options;

  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot connect to backend. Start backend on port 4000 and try again.");
  }

  const rawText = await response.text();
  let data = {};

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    throw new Error(buildApiErrorMessage(response, data, rawText));
  }

  return data;
}
