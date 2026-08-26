import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Check, FileText, LoaderCircle, UploadCloud } from "lucide-react";
import { uploadPDF } from "../lib/api";

export default function Upload({ compact = false, selectedName, onUploaded }) {
  const { getToken } = useAuth();
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [indexedFiles, setIndexedFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!compact) {
      setStatus("idle");
      setIndexedFiles([]);
    }
  }, [compact]);

  const chooseFile = (event) => {
    const selected = [...(event.target.files || [])];
    if (!selected.length) return;
    if (
      selected.some(
        (file) =>
          file.type !== "application/pdf" &&
          !file.name.toLowerCase().endsWith(".pdf"),
      )
    ) {
      setMessage("Please choose PDF files only.");
      return;
    }
    if (selected.some((file) => file.size > 10 * 1024 * 1024)) {
      setMessage("Each PDF must be 10 MB or smaller.");
      return;
    }
    setFiles(selected);
    setStatus("idle");
    setMessage("");
  };

  const handleUpload = async () => {
    if (!files.length)
      return setMessage("Choose one or more PDFs to get started.");
    setStatus("uploading");
    setMessage("Reading your paper and creating its index...");
    try {
      const token = await getToken();
      const result = await uploadPDF(files, token);
      setStatus("success");
      setMessage(result.message || "Your paper is ready for questions.");
      setIndexedFiles(
        result.documents?.map((document) => document.name) ||
          files.map((file) => file.name),
      );
      result.documents?.forEach((document) => onUploaded?.(document));
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const isCompact = (status === "success" || compact) && !files.length;

  return (
    <section
      className={`panel upload-panel ${isCompact ? "upload-panel-compact" : ""}`}
    >
      {isCompact ? (
        <div className="indexed-paper-strip">
          <div className="indexed-paper-info">
            <FileText size={17} />
            <div>
              <strong>
                {indexedFiles.join(", ") || selectedName || "Paper indexed"}
              </strong>
              <span>Active and ready for questions</span>
            </div>
          </div>
          <button
            className="add-paper-button"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud size={15} /> Add PDF
          </button>
        </div>
      ) : (
        <>
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
            Upload one or more PDFs and PaperReader | Know Your Papers will map
            the ideas inside them for thoughtful conversations.
          </p>
          <button
            className={`drop-zone ${files.length ? "has-file" : ""}`}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {files.length ? <FileText size={27} /> : <UploadCloud size={27} />}
            <strong>
              {files.length
                ? `${files.length} PDF${files.length === 1 ? "" : "s"} selected`
                : "Choose PDF files"}
            </strong>
            <span>
              {files.length
                ? files.map((file) => file.name).join(", ")
                : "Maximum 10 MB per file"}
            </span>
          </button>
          <button
            className="button button-accent full-width"
            onClick={handleUpload}
            disabled={status === "uploading"}
          >
            {status === "uploading" ? (
              <>
                <LoaderCircle className="spin" size={17} /> Processing paper
              </>
            ) : (
              "Click to Start reading with AI"
            )}
          </button>
          {message && <p className={`status-message ${status}`}>{message}</p>}
          <div className="format-note">
            <span className="dot" /> PDFs only <span className="divider" />{" "}
            Private to your account
          </div>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={chooseFile}
        hidden
      />
    </section>
  );
}
