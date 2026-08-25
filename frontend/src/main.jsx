import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./App.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
const root = createRoot(document.getElementById("root"));

function MissingKey() {
  return (
    <main className="setup-screen">
      <span className="brand-mark">P</span>
      <p className="eyebrow">PaperReader setup</p>
      <h1>Add your Clerk publishable key.</h1>
      <p>
        Copy <code>frontend/.env.example</code> to <code>frontend/.env</code>,
        add your <code>pk_</code> key, and restart Vite.
      </p>
    </main>
  );
}

function ClerkLoading() {
  return (
    <main className="loading-screen">
      <span className="brand-mark">P</span>
      <p className="eyebrow">PaperReader</p>
      <p>Connecting to your secure workspace...</p>
    </main>
  );
}

const hasValidKey = publishableKey?.startsWith("pk_");

root.render(
  hasValidKey ? (
    <React.StrictMode>
      <ClerkProvider
        publishableKey={publishableKey}
        fallbackRedirectUrl="/dashboard"
        fallback={<ClerkLoading />}
      >
        <App />
      </ClerkProvider>
    </React.StrictMode>
  ) : (
    <MissingKey />
  ),
);
