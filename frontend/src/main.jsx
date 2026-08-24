import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./App.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
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

root.render(
  publishableKey ? (
    <React.StrictMode>
      <ClerkProvider
        publishableKey={publishableKey}
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
      >
        <App />
      </ClerkProvider>
    </React.StrictMode>
  ) : (
    <MissingKey />
  ),
);
