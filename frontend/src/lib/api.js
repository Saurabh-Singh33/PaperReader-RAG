const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options, token) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.error || data.message || "Something went wrong");
  return data;
}

export function uploadPDF(file, token) {
  const body = new FormData();
  body.append("file", file);
  return request("/upload", { method: "POST", body }, token);
}

export function askQuestion(question, token) {
  return request(
    "/query",
    { method: "POST", body: JSON.stringify({ question }) },
    token,
  );
}
