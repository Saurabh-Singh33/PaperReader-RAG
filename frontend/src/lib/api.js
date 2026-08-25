const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options, token) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "I'm having trouble connecting. Please check your internet and try again.",
    );
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.error || data.message || "Something went wrong");
  return data;
}

export function uploadPDF(file, token) {
  const body = new FormData();
  for (const item of Array.isArray(file) ? file : [file])
    body.append("files", item);
  return request("/upload", { method: "POST", body }, token);
}

export function askQuestion(question, token) {
  return askQuestionForDocument(question, token, {});
}

export function askQuestionForDocument(question, token, document) {
  return request(
    "/query",
    {
      method: "POST",
      body: JSON.stringify({
        question,
        documentId: document.documentId || undefined,
        documentSource: document.documentId ? undefined : document.source,
      }),
    },
    token,
  );
}

export function listDocuments(token) {
  return request("/documents", { method: "GET" }, token);
}

export function deleteDocument(document, token) {
  return request(
    `/documents/${encodeURIComponent(document.id)}?documentId=${encodeURIComponent(document.documentId || "")}&source=${encodeURIComponent(document.source || "")}`,
    { method: "DELETE" },
    token,
  );
}

export function askAI(question, token, messages, webSearch) {
  return request(
    "/ai",
    {
      method: "POST",
      body: JSON.stringify({ question, messages, webSearch }),
    },
    token,
  );
}
