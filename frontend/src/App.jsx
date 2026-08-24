import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { FileText, LockKeyhole, Sparkles } from "lucide-react";
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
      <section className="hero">
        <div>
          <p className="eyebrow">
            <Sparkles size={14} /> A sharper way to read
          </p>
          <h1>
            Read less.
            <br />
            <em>Understand more.</em>
          </h1>
          <p className="hero-copy">
            Turn dense papers into a conversation. Upload your research, then
            ask the questions that matter.
          </p>
        </div>
        <div className="hero-note">
          <span className="note-line" />
          <p>
            One paper at a time.
            <br />
            <strong>Infinite clarity.</strong>
          </p>
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
        <Auth />
      </header>
      <section className="landing-content">
        <p className="eyebrow">
          <Sparkles size={14} /> Your research, in focus
        </p>
        <h1>
          The paper is dense.
          <br />
          <em>Your questions don't have to be.</em>
        </h1>
        <p className="hero-copy">
          A private reading companion for turning academic papers into clear,
          useful conversations.
        </p>
        <Auth />
        <div className="landing-detail">
          <span>PDF → insight</span>
          <span>•</span>
          <span>Powered by retrieval</span>
        </div>
      </section>
    </main>
  );
}
