import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { ArrowRight, BookOpen, BrainCircuit, FileCheck2, FileText, GraduationCap, LockKeyhole, MessageCircle, Search, ShieldCheck, Sparkles, Waypoints } from "lucide-react";
import Auth from "./components/Auth";
import Upload from "./components/Upload";
import Chat from "./components/Chat";

export default function App() {
  const { isSignedIn, isLoaded } = useUser();
  const [documentName, setDocumentName] = useState("");
  if (!isLoaded)
    return (
      <div className="loading-screen">
        <span className="brand-mark">P</span>
      </div>
    );
  if (!isSignedIn) return <Landing />;
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">P</span>
          <span>PaperReader</span>
        </a>
        <div className="topbar-meta">
          <span className="secure-label">
            <LockKeyhole size={13} /> Your private reading room
          </span>
          <Auth compact />
        </div>
      </header>
      <section className="dashboard-intro">
        <div>
          <p className="eyebrow">
            <Sparkles size={14} /> Your research workspace
          </p>
          <h1>Turn reading time into thinking time.</h1>
          <p className="hero-copy">
            Upload a paper, then explore its ideas with answers grounded in the text.
          </p>
        </div>
        <div className="dashboard-stat">
          <ShieldCheck size={19} />
          <span><strong>Private by design</strong><br />Your papers stay yours.</span>
        </div>
      </section>
      <div className="workspace">
        <Upload onUploaded={setDocumentName} />
        <Chat documentName={documentName} />
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
        <a className="brand" href="/">
          <span className="brand-mark">P</span>
          <span>PaperReader</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#security">Security</a>
        </nav>
        <Auth />
      </header>
      <section className="landing-hero">
        <div className="hero-content">
          <p className="eyebrow"><Sparkles size={14} /> Research, in focus</p>
          <h1>Meet the paper<br /><em>halfway.</em></h1>
          <p className="hero-copy">PaperReader turns dense academic papers into clear, useful conversations, so you can spend less time searching and more time thinking.</p>
          <div className="hero-actions"><Auth /></div>
          <div className="trust-row" id="security"><ShieldCheck size={16} /> Private workspace <span /> No credit card required</div>
        </div>
        <div className="hero-visual" aria-label="PaperReader document analysis preview">
          <div className="visual-glow" />
          <div className="paper-sheet"><div className="sheet-kicker">PAPER / 001</div><div className="sheet-title">The shape of<br /><strong>new ideas</strong></div><div className="sheet-lines"><i /><i /><i /><i /></div><div className="sheet-footer">RESEARCH NOTES <span>*</span></div></div>
          <div className="insight-card"><div className="insight-icon"><BrainCircuit size={17} /></div><div><small>INSIGHT FOUND</small><strong>Central argument</strong><span>Ready to explore</span></div><ArrowRight size={17} /></div>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        </div>
      </section>
      <section className="proof-strip" id="how-it-works">
        <div><span className="proof-number">01</span><FileCheck2 size={20} /><strong>Upload your paper</strong><p>Bring in a PDF in seconds.</p></div>
        <div><span className="proof-number">02</span><MessageCircle size={20} /><strong>Ask better questions</strong><p>Follow the ideas wherever they go.</p></div>
        <div><span className="proof-number">03</span><Waypoints size={20} /><strong>Find the thread</strong><p>Get answers with context.</p></div>
      </section>
      <section className="features-section" id="features">
        <div className="section-heading"><div><p className="eyebrow">A better reading ritual</p><h2>Everything you need<br /><em>to go deeper.</em></h2></div><p>From first skim to final insight, PaperReader keeps the important parts of your paper close at hand.</p></div>
        <div className="feature-grid">
          <FeatureCard icon={<Search size={21} />} title="Search by meaning" copy="Skip keyword hunting. Ask about the ideas, methods, and evidence inside your paper." />
          <FeatureCard icon={<GraduationCap size={21} />} title="Learn in context" copy="Turn unfamiliar concepts into clear explanations without losing the author's thread." />
          <FeatureCard icon={<BookOpen size={21} />} title="Build a point of view" copy="Challenge assumptions, compare claims, and arrive at your own sharper reading." />
        </div>
      </section>
      <footer className="landing-footer"><span className="brand"><span className="brand-mark">P</span><span>PaperReader</span></span><span>Copyright 2026 PaperReader | Built for curious minds</span></footer>
    </main>
  );
}

function FeatureCard({ icon, title, copy }) {
  return <button className="feature-card" type="button" onClick={() => document.querySelector(".auth-actions button")?.click()}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{copy}</p><span className="locked-label"><LockKeyhole size={14} /> Sign in to explore</span></button>;
}
