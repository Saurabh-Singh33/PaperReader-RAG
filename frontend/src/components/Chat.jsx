import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  ArrowUp,
  BookOpen,
  Check,
  Copy,
  FileText,
  LoaderCircle,
  MessageCircle,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { askQuestionForDocument } from "../lib/api";

const suggestions = [
  "What is the central argument?",
  "Summarize the methodology",
  "What are the limitations?",
];

export default function Chat({ document }) {
  const { getToken } = useAuth();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(`paperreader-likes-${document?.id || "new"}`),
        ) || {}
      );
    } catch {
      return {};
    }
  });
  const [copied, setCopied] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const copyAnswer = async (content, id) => {
    await navigator.clipboard?.writeText(content);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1600);
  };

  useEffect(() => {
    localStorage.setItem(
      `paperreader-likes-${document?.id || "new"}`,
      JSON.stringify(liked),
    );
  }, [document?.id, liked]);
  const shareAnswer = async (content, id) => {
    if (navigator.share)
      await navigator
        .share({ title: "PaperReader answer", text: content })
        .catch(() => {});
    else await copyAnswer(content, id);
  };
  const submit = async (event) => {
    event?.preventDefault();
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
    setMessages((current) => [...current, { type: "user", content: text }]);
    setLoading(true);
    try {
      const token = await getToken();
      const result = await askQuestionForDocument(text, token, document);
      setMessages((current) => [
        ...current,
        {
          type: "ai",
          content: result.answer || result.message,
          sources: result.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          type: "ai",
          content:
            "I'm having trouble connecting to your paper. Please try again.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel chat-panel conversation-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">02 / Ask anything</p>
          <h2>Make the paper talk.</h2>
        </div>
        <span className="icon-disc icon-disc-light">
          <MessageCircle size={19} />
        </span>
      </div>
      <p className="panel-copy">
        Ask for a summary, challenge an argument, or find the exact thread you
        need.
      </p>
      <div className="message-list" aria-live="polite">
        {!messages.length && !loading ? (
          <EmptyState onSelect={setQuestion} />
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={`${message.type}-${index}`}
              message={message}
              index={index}
              liked={liked[index]}
              copied={copied === index}
              onCopy={copyAnswer}
              onShare={shareAnswer}
              onLike={() =>
                setLiked((current) => ({
                  ...current,
                  [index]: !current[index],
                }))
              }
            />
          ))
        )}
        {loading && <LoadingMessage />}
        <div ref={endRef} />
      </div>
      <div className="chat-input-area">
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
              document
                ? "Ask your paper a question..."
                : "Select a PDF to start asking"
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
        <p className="input-disclaimer">
          PaperReader can make mistakes. Check important information.
        </p>
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
      <h3>Conversation starts here</h3>
      <p>
        Ask for a summary, challenge an argument, or find the exact thread you
        need.
      </p>
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
function MessageBubble({
  message,
  index,
  liked,
  copied,
  onCopy,
  onShare,
  onLike,
}) {
  const isUser = message.type === "user";
  return (
    <article className={`message ${isUser ? "user-message" : "ai-message"}`}>
      <div className="message-avatar">
        {isUser ? <span>You</span> : <FileText size={16} />}
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
            {message.sources.map((source, sourceIndex) => (
              <div className="source-item" key={`${source}-${sourceIndex}`}>
                {source}
              </div>
            ))}
          </div>
        )}
        {!isUser && (
          <div className="message-actions">
            <button
              type="button"
              onClick={() => onCopy(message.content, index)}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}{" "}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => onShare(message.content, index)}
            >
              <Share2 size={13} /> Share
            </button>
            <button
              className={liked ? "active" : ""}
              type="button"
              onClick={onLike}
            >
              <ThumbsUp size={13} /> Like
            </button>
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
        <FileText size={16} />
      </div>
      <div className="message-content">
        <div className="message-sender">PaperReader (PDF)</div>
        <div className="loading-dots">
          <i />
          <i />
          <i />
        </div>
      </div>
    </article>
  );
}
