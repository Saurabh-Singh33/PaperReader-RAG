import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";
import logo from "./assets/logo.jpg";

const brandName = "PaperReader | Know your Papers";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
const root = createRoot(document.getElementById("root"));

function MissingKey() {
  return (
    <main className="setup-screen">
      <img className="brand-image" src={logo} alt="" />
      <p className="eyebrow">{brandName} setup</p>
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
      <img className="brand-image" src={logo} alt="" />
      <p className="eyebrow">{brandName}</p>
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
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
        fallback={<ClerkLoading />}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </React.StrictMode>
  ) : (
    <MissingKey />
  ),
);
