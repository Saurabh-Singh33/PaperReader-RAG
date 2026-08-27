import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  ArrowUp,
  BookOpen,
  Download,
  FileText,
  LoaderCircle,
  Share2,
  Trash2,
} from "lucide-react";
import { askQuestionForDocument } from "../lib/api";
import logo from "../assets/logo.jpg";

const suggestions = [
  "What is the central argument?",
  "Summarize the methodology",
  "What are the limitations?",
];

function cleanResponse(text) {
  return String(text || "")
    .replace(/\*{1,3}/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export default function Chat({ document }) {
  const { getToken } = useAuth();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatCopied, setChatCopied] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const shareChat = async () => {
    if (!messages.length) return;
    const chatText = [
      "PaperReader | Know your Papers Chat",
      document?.name ? `Paper: ${document.name}` : "",
      new Date().toLocaleString(),
      "=".repeat(50),
      ...messages.map(
        (message) =>
          `${message.type === "user" ? "You" : "PaperReader (PDF)"}:\n${message.content}`,
      ),
      "=".repeat(50),
    ]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard?.writeText(chatText);
    setChatCopied(true);
    window.setTimeout(() => setChatCopied(false), 1600);
  };

  const exportChat = (format) => {
    if (!messages.length) return;
    const date = new Date().toISOString().slice(0, 10);
    const content =
      format === "json"
        ? JSON.stringify(
            {
              title: "PaperReader | Know your Papers Chat",
              paper: document?.name || null,
              date: new Date().toISOString(),
              messages,
            },
            null,
            2,
          )
        : [
            "# PaperReader | Know your Papers Chat",
            document?.name ? `Paper: ${document.name}` : "",
            `Date: ${new Date().toLocaleString()}`,
            "",
            ...messages.map(
              (message) =>
                `${message.type === "user" ? "You" : "PaperReader (PDF)"}:\n\n${message.content}`,
            ),
          ]
            .filter(Boolean)
            .join("\n\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([content], {
        type: format === "json" ? "application/json" : "text/markdown",
      }),
    );
    link.download = `PaperReader-Chat-${date}.${format === "json" ? "json" : "md"}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const clearChat = () => {
    if (!messages.length || !window.confirm("Clear this conversation?")) return;
    setMessages([]);
  };

  const submit = async (event) => {
    event.preventDefault();
    const text = question.trim();
    if (!text || loading) return;
    if (!document) {
      setMessages((current) => [
        ...current,
        {
          type: "ai",
          content: "Select a PDF from the sidebar before asking a question.",
        },
      ]);
      return;
    }
    setQuestion("");
    setMessages((current) => [
      ...current,
      { type: "user", content: text, createdAt: Date.now() },
    ]);
    setLoading(true);
    try {
      const result = await askQuestionForDocument(
        text,
        await getToken(),
        document,
      );
      setMessages((current) => [
        ...current,
        {
          type: "ai",
          content: cleanResponse(result.answer || result.message),
          sources: result.sources || [],
          createdAt: Date.now(),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          type: "ai",
          content:
            "I'm having trouble connecting to your paper. Please try again.",
          sources: [],
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel chat-panel conversation-panel">
      <div className="message-list" aria-live="polite">
        {!messages.length && !loading ? (
          <EmptyState onSelect={setQuestion} />
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={`${message.type}-${index}`} message={message} />
          ))
        )}
        {loading && <LoadingMessage />}
        <div ref={endRef} />
      </div>
      <div className="chat-input-area">
        <div className="chat-actions">
          <button type="button" onClick={shareChat} disabled={!messages.length}>
            <Share2 size={14} /> {chatCopied ? "Copied" : "Share chat"}
          </button>
          <button
            type="button"
            onClick={() => exportChat("json")}
            disabled={!messages.length}
          >
            <Download size={14} /> JSON
          </button>
          <button
            type="button"
            onClick={() => exportChat("md")}
            disabled={!messages.length}
          >
            <Download size={14} /> Markdown
          </button>
          <button type="button" onClick={clearChat} disabled={!messages.length}>
            <Trash2 size={14} /> Clear
          </button>
        </div>
        <div className="suggestion-pills">
          {suggestions.map((item) => (
            <button key={item} type="button" onClick={() => setQuestion(item)}>
              {item}
            </button>
          ))}
        </div>
        <form className="question-form" onSubmit={submit}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={
              document ? "Ask a question..." : "Select a PDF to start asking"
            }
            aria-label="Question"
            disabled={loading || !document}
          />
          <button
            className="send-button"
            type="submit"
            disabled={loading || !question.trim() || !document}
            aria-label="Send question"
          >
            {loading ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <ArrowUp size={18} />
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function EmptyState({ onSelect }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <BookOpen size={24} />
      </span>
      <h3>No messages yet</h3>
      <div className="empty-suggestions">
        {suggestions.map((item) => (
          <button key={item} type="button" onClick={() => onSelect(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.type === "user";
  return (
    <article className={`message ${isUser ? "user-message" : "ai-message"}`}>
      <div className="message-avatar">
        {isUser ? (
          <span>You</span>
        ) : (
          <img src={logo} alt="" className="assistant-logo" />
        )}
      </div>
      <div className="message-content">
        <div className="message-sender">
          {isUser ? "You" : "PaperReader (PDF)"}
        </div>
        <div className="message-text">{message.content}</div>
        {!isUser && message.sources?.length > 0 && (
          <div className="message-sources">
            <h4>
              <BookOpen size={13} /> Sources
            </h4>
            {message.sources.map((source, index) => (
              <div className="source-item" key={`${source}-${index}`}>
                {source}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function LoadingMessage() {
  return (
    <article className="message ai-message loading-message">
      <div className="message-avatar">
        <img src={logo} alt="" className="assistant-logo" />
      </div>
      <div className="message-content">
        <div className="message-sender">PaperReader (PDF)</div>
        <div className="loading-status">
          <strong>Finding the best answer...</strong>
          <span>Reading your paper and analyzing context</span>
        </div>
        <div className="loading-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
    </article>
  );
}
