import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  FileCheck2,
  FileText,
  GraduationCap,
  LockKeyhole,
  Maximize,
  Menu,
  MessageCircle,
  Minimize,
  Search,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react";
import Auth from "./components/Auth";
import Upload from "./components/Upload";
import Chat from "./components/Chat";
import AIChat from "./components/AIChat";
import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import { deleteDocument, listDocuments } from "./lib/api";
import logo from "./assets/logo.jpg";

const brandName = "PaperReader | Know your Papers";

export default function App() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("paperreader-theme") || "light",
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSession, setChatSession] = useState(0);
  const [activeTab, setActiveTab] = useState("papers");
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    if (!isSignedIn) return;
    getToken()
      .then((token) => listDocuments(token))
      .then((result) => {
        setDocuments(result.documents || []);
        setSelected((current) => current || result.documents?.[0] || null);
      })
      .catch(() => setDocuments([]));
  }, [getToken, isSignedIn]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("paperreader-theme", theme);
  }, [theme]);
  useEffect(() => {
    const handleShortcut = (event) => {
      if (!event.ctrlKey) return;
      if (event.key === "1") setActiveTab("papers");
      if (event.key === "2") setActiveTab("ai");
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  if (!isLoaded)
    return (
      <div className="loading-screen">
        <img className="brand-image" src={logo} alt="" />
        <strong>{brandName}</strong>
      </div>
    );
  if (!isSignedIn) return <Landing />;
  const handleUploaded = (document) => {
    setDocuments((current) => [
      document,
      ...current.filter((item) => item.id !== document.id),
    ]);
    setSelected(document);
    setChatSession((current) => current + 1);
  };
  const handleDelete = async (document) => {
    if (!window.confirm(`Delete ${document.name}?`)) return;
    const token = await getToken();
    await deleteDocument(document, token);
    setDocuments((current) =>
      current.filter((item) => item.id !== document.id),
    );
    if (selected?.id === document.id) setSelected(null);
  };
  const toggleFullScreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  };
  return (
    <main className="reader-app">
      <header className="reader-topbar">
        <button
          className="menu-button"
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label="Toggle sidebar"
        >
          <Menu size={19} />
        </button>
        <a className="brand" href="/">
          <img className="brand-image" src={logo} alt="" />
          <span>{brandName}</span>
        </a>
        <div className="reader-top-actions">
          <ThemeToggle
            theme={theme}
            onToggle={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
          />
          <button
            className="fullscreen-button"
            type="button"
            onClick={toggleFullScreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </header>
      <div className="reader-body">
        <div className={`sidebar-wrap ${sidebarOpen ? "open" : ""}`}>
          <Sidebar
            documents={documents}
            selected={selected}
            onSelect={(document) => {
              setSelected(document);
              setChatSession((current) => current + 1);
              setSidebarOpen(false);
            }}
            onNewChat={() => {
              setSelected(null);
              setChatSession((current) => current + 1);
              setActiveTab("papers");
            }}
            onDelete={handleDelete}
          />
        </div>
        <section className="reader-main">
          <div className="tab-container" role="tablist" aria-label="Chat modes">
            <button
              className={`tab-button ${activeTab === "papers" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === "papers"}
              onClick={() => setActiveTab("papers")}
            >
              <FileText size={15} /> Papers
            </button>
            <button
              className={`tab-button ${activeTab === "ai" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === "ai"}
              onClick={() => setActiveTab("ai")}
            >
              <MessageCircle size={15} /> AI Chat
            </button>
          </div>
          {activeTab === "papers" && selected && (
            <div className="selected-paper">
              <FileText className="selected-paper-icon" size={14} />
              <strong>{selected.name}</strong>
            </div>
          )}
          <div className="workspace">
            <div
              className={
                activeTab === "papers"
                  ? "tab-panel-visible"
                  : "tab-panel-hidden"
              }
            >
              <Upload
                key={`upload-${chatSession}`}
                onUploaded={handleUploaded}
              />
              <Chat key={chatSession} document={selected} />
            </div>
            <div
              className={
                activeTab === "ai" ? "tab-panel-visible" : "tab-panel-hidden"
              }
            >
              <AIChat key={`ai-${chatSession}`} />
            </div>
          </div>
        </section>
      </div>
      <footer>
        <span>
          <FileText size={14} /> Built for curious minds
        </span>
        <span>Powered by Gemini + Qdrant</span>
      </footer>
    </main>
  );
}

function Landing() {
  return (
    <main className="landing">
      <header className="topbar">
        <div className="topbar-main">
          <a className="brand" href="/">
            <img className="brand-image" src={logo} alt="" />
            <span>{brandName}</span>
          </a>
          <Auth />
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#security">Security</a>
        </nav>
      </header>
      <section className="landing-hero">
        <div className="hero-content">
          <p className="eyebrow">
            <Sparkles size={14} /> Research, in focus
          </p>
          <h1>
            Meet the paper
            <br />
            <em>halfway.</em>
          </h1>
          <p className="hero-copy">
            {brandName} turns dense academic papers into clear, useful
            conversations, so you can spend less time searching and more time
            thinking.
          </p>
          <div className="hero-actions">
            <Auth />
          </div>
          <div className="trust-row">
            <ShieldCheck size={16} /> Private workspace <span /> No credit card
            required
          </div>
        </div>
        <div
          className="hero-visual"
          aria-label="PaperReader | Know your Papers document analysis preview"
        >
          <div className="visual-glow" />
          <div className="paper-sheet">
            <div className="sheet-kicker">PAPER / 001</div>
            <div className="sheet-title">
              The shape of
              <br />
              <strong>new ideas</strong>
            </div>
            <div className="sheet-lines">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="sheet-footer">
              RESEARCH NOTES <span>*</span>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">
              <BrainCircuit size={17} />
            </div>
            <div>
              <small>INSIGHT FOUND</small>
              <strong>Central argument</strong>
              <span>Ready to explore</span>
            </div>
            <ArrowRight size={17} />
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
        </div>
      </section>
      <section className="proof-strip" id="how-it-works">
        <div>
          <span className="proof-number">01</span>
          <FileCheck2 size={20} />
          <strong>Upload your paper</strong>
          <p>Bring in a PDF in seconds.</p>
        </div>
        <div>
          <span className="proof-number">02</span>
          <MessageCircle size={20} />
          <strong>Ask better questions</strong>
          <p>Follow the ideas wherever they go.</p>
        </div>
        <div>
          <span className="proof-number">03</span>
          <Waypoints size={20} />
          <strong>Find the thread</strong>
          <p>Get answers with context.</p>
        </div>
      </section>
      <section className="features-section" id="features">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A better reading ritual</p>
            <h2>
              Everything you need
              <br />
              <em>to go deeper.</em>
            </h2>
          </div>
          <p>
            From first skim to final insight, {brandName} keeps the important
            parts of your paper close at hand.
          </p>
        </div>
        <div className="feature-grid">
          <FeatureCard
            icon={<Search size={21} />}
            title="Search by meaning"
            copy="Skip keyword hunting. Ask about the ideas, methods, and evidence inside your paper."
          />
          <FeatureCard
            icon={<GraduationCap size={21} />}
            title="Learn in context"
            copy="Turn unfamiliar concepts into clear explanations without losing the author's thread."
          />
          <FeatureCard
            icon={<BookOpen size={21} />}
            title="Build a point of view"
            copy="Challenge assumptions, compare claims, and arrive at your own sharper reading."
          />
        </div>
      </section>
      <section className="security-section" id="security">
        <div className="security-content">
          <p className="eyebrow">
            <LockKeyhole size={14} /> Your work stays yours
          </p>
          <h2>
            Read with
            <br />
            <em>peace of mind.</em>
          </h2>
          <p>
            Your papers live in a private workspace. PaperReader keeps your
            research separate, protected, and ready whenever you return.
          </p>
        </div>
        <div className="security-badge" aria-hidden="true">
          <ShieldCheck size={31} />
          <strong>PRIVATE BY DESIGN</strong>
          <span>Protected workspace</span>
        </div>
      </section>
      <footer className="landing-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <img className="brand-image" src={logo} alt="" />
            <div>
              <strong>{brandName}</strong>
              <span>Thoughtful tools for curious readers.</span>
            </div>
          </div>
          <div className="footer-credit">
            <span className="footer-credit-label">CREATED WITH CARE</span>
            <span>Made by</span>
            <strong>Saurabh</strong>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-meta">
            Copyright 2026 PaperReader. Built for curious minds.
          </span>
          <span className="footer-status">
            <span /> Private workspace
          </span>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, copy }) {
  return (
    <button
      className="feature-card"
      type="button"
      onClick={() => document.querySelector(".auth-actions button")?.click()}
    >
      <span className="feature-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
      <span className="locked-label">
        <LockKeyhole size={14} /> Sign in to explore
      </span>
    </button>
  );
}
