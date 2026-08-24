import { useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Check, FileText, LoaderCircle, UploadCloud } from "lucide-react";
import { uploadPDF } from "../lib/api";

export default function Upload({ onUploaded }) {
  const { getToken } = useAuth();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const chooseFile = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setMessage("Please choose a PDF file.");
      return;
    }
    setFile(selected);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Choose a PDF to get started.");
    setStatus("uploading");
    setMessage("Reading your paper and creating its index...");
    try {
      const token = await getToken();
      const result = await uploadPDF(file, token);
      setStatus("success");
      setMessage(result.message || "Your paper is ready for questions.");
      onUploaded?.(file.name);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <section className="panel upload-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">01 / Add a paper</p>
          <h2>Bring your research in.</h2>
        </div>
        <span className="icon-disc">
          <UploadCloud size={19} />
        </span>
      </div>
      <p className="panel-copy">
        Upload one PDF and PaperReader will map the ideas inside it for a
        thoughtful conversation.
      </p>
      <button
        className={`drop-zone ${file ? "has-file" : ""}`}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {file ? <FileText size={27} /> : <UploadCloud size={27} />}
        <strong>{file ? file.name : "Choose a PDF"}</strong>
        <span>
          {file
            ? `${(file.size / 1024 / 1024).toFixed(2)} MB · ready to index`
            : "Maximum file size 10 MB"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={chooseFile}
        hidden
      />
      <button
        className="button button-accent full-width"
        onClick={handleUpload}
        disabled={status === "uploading"}
      >
        {status === "uploading" ? (
          <>
            <LoaderCircle className="spin" size={17} /> Processing paper
          </>
        ) : status === "success" ? (
          <>
            <Check size={17} /> Paper indexed
          </>
        ) : (
          "Index this paper"
        )}
      </button>
      {message && <p className={`status-message ${status}`}>{message}</p>}
      <div className="format-note">
        <span className="dot" /> PDFs only <span className="divider" /> Private
        to your account
      </div>
    </section>
  );
}
