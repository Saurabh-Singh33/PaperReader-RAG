import { useMemo, useState } from "react";
import { FileText, LogOut, Plus, Search, Trash2 } from "lucide-react";
import { useAuth, useUser, UserButton } from "@clerk/clerk-react";

function dateGroup(date) {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days < 1) return "Today";
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return "Older";
}

export default function Sidebar({
  documents,
  selected,
  onSelect,
  onNewChat,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const { signOut } = useAuth();
  const { user } = useUser();
  const filtered = useMemo(
    () =>
      documents.filter((document) =>
        document.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [documents, search],
  );
  const groups = filtered.reduce((result, document) => {
    const group = dateGroup(document.uploadedAt);
    (result[group] ||= []).push(document);
    return result;
  }, {});

  return (
    <aside className="sidebar">
      <button className="new-chat-button" type="button" onClick={onNewChat}>
        <Plus size={17} /> New chat
      </button>
      <label className="sidebar-search">
        <Search size={15} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search PDFs"
        />
      </label>
      <div className="pdf-history">
        {Object.entries(groups).map(([group, items]) => (
          <section key={group}>
            <h3>{group}</h3>
            {items.map((document) => (
              <div
                className={`pdf-item ${selected?.id === document.id ? "selected" : ""}`}
                key={document.id}
              >
                <button type="button" onClick={() => onSelect(document)}>
                  <FileText size={16} />
                  <span>{document.name}</span>
                </button>
                <button
                  className="delete-document"
                  type="button"
                  onClick={() => onDelete(document)}
                  aria-label={`Delete ${document.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </section>
        ))}
        {!filtered.length && <p className="sidebar-empty">No PDFs found.</p>}
      </div>
      <div className="sidebar-footer">
        <div className="user-summary">
          <UserButton afterSignOutUrl="/" />
          <span>
            <strong>{user?.firstName || "Reader"}</strong>
            <small>{user?.primaryEmailAddress?.emailAddress}</small>
          </span>
        </div>
        <button
          className="signout-button"
          type="button"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}
