import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  ArrowUp,
  Check,
  Copy,
  Download,
  Globe2,
  LoaderCircle,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { askAI } from "../lib/api";
import logo from "../assets/logo.jpg";

const suggestions = [
  "Explain a difficult concept",
  "Help me brainstorm ideas",
  "Write a concise summary",
];

function cleanResponse(text) {
  return String(text || "")
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ""))
    .replace(/\*{1,3}/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export default function AIChat() {
  const { getToken } = useAuth();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [liked, setLiked] = useState({});
  const [copied, setCopied] = useState(null);
  const [chatCopied, setChatCopied] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  const copy = async (text, index) => {
    await navigator.clipboard?.writeText(text);
    setCopied(index);
    window.setTimeout(() => setCopied(null), 1500);
  };
  const share = async (text, index) => {
    if (navigator.share)
      await navigator
        .share({ title: "PaperReader | Know your Papers", text })
        .catch(() => {});
    else await copy(text, index);
  };
  const shareChat = async () => {
    if (!messages.length) return;
    const chatText = [
      "PaperReader | Know your Papers Chat",
      new Date().toLocaleString(),
      "=".repeat(50),
      ...messages.map(
        (message) =>
          `${message.type === "user" ? "You" : "PaperReader Assistant"} (${new Date(message.createdAt || Date.now()).toLocaleString()}):\n${message.content}`,
      ),
      "=".repeat(50),
    ].join("\n\n");
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
              date: new Date().toISOString(),
              messages,
            },
            null,
            2,
          )
        : [
            "# PaperReader | Know your Papers Chat",
            `Date: ${new Date().toLocaleString()}`,
            "",
            ...messages.map(
              (message) =>
                `${message.type === "user" ? "You" : "PaperReader Assistant"} (${new Date(message.createdAt || Date.now()).toLocaleString()}):\n\n${message.content}`,
            ),
          ].join("\n\n");
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
    setLiked({});
  };
  const submit = async (event) => {
    event.preventDefault();
    const text = question.trim();
    if (!text || loading) return;
    setQuestion("");
    setMessages((current) => [
      ...current,
      { type: "user", content: text, createdAt: Date.now() },
    ]);
    setLoading(true);
    try {
      const history = messages.map((message) => ({
        role: message.type === "user" ? "user" : "assistant",
        content: message.content,
      }));
      const result = await askAI(text, await getToken(), history, webSearch);
      setMessages((current) => [
        ...current,
        {
          type: "ai",
          content: cleanResponse(result.answer),
          createdAt: Date.now(),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          type: "ai",
          content: error.message || "Something went wrong. Please try again.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="panel chat-panel conversation-panel ai-chat-panel">
      <div className="message-list" aria-live="polite">
        {!messages.length && !loading ? (
          <div className="empty-state">
            <span className="empty-icon">
              <img src={logo} alt="" className="empty-logo" />
            </span>
            <h3>No messages yet</h3>
            <div className="empty-suggestions">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuestion(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <article
              className={`message ${message.type === "user" ? "user-message" : "ai-message"}`}
              key={`${message.type}-${index}`}
            >
              <div className="message-avatar">
                {message.type === "user" ? (
                  "You"
                ) : (
                  <img src={logo} alt="" className="assistant-logo" />
                )}
              </div>
              <div className="message-content">
                <div className="message-sender">
                  {message.type === "user" ? "You" : "PaperReader Assistant"}
                </div>
                <div className="message-text">{message.content}</div>
                {message.type === "ai" && (
                  <div className="message-actions">
                    <button
                      type="button"
                      onClick={() => copy(message.content, index)}
                    >
                      {copied === index ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )}{" "}
                      {copied === index ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={() => share(message.content, index)}
                    >
                      <Share2 size={13} /> Share
                    </button>
                    <button
                      className={liked[index] ? "active" : ""}
                      type="button"
                      onClick={() =>
                        setLiked((current) => ({
                          ...current,
                          [index]: !current[index],
                        }))
                      }
                    >
                      <ThumbsUp size={13} /> Like
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
        {loading && (
          <article className="message ai-message loading-message">
            <div className="message-avatar">
              <img src={logo} alt="" className="assistant-logo" />
            </div>
            <div className="message-content">
              <div className="message-sender">PaperReader Assistant</div>
              <div className="loading-dots">
                <i />
                <i />
                <i />
              </div>
            </div>
          </article>
        )}
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
            placeholder="Message AI..."
            aria-label="AI question"
            disabled={loading}
          />
          <button
            className="send-button"
            type="submit"
            disabled={loading || !question.trim()}
            aria-label="Send AI question"
          >
            {loading ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <ArrowUp size={18} />
            )}
          </button>
        </form>
        <div className="ai-controls">
          <label>
            <input
              type="checkbox"
              checked={webSearch}
              onChange={(event) => setWebSearch(event.target.checked)}
            />{" "}
            <Globe2 size={13} /> Web search {webSearch ? "on" : "off"}
          </label>
        </div>
      </div>
    </section>
  );
}
