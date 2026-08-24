import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <label className="theme-toggle">
      <Sun size={15} />
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={onToggle}
        aria-label="Toggle dark mode"
      />
      <Moon size={15} />
    </label>
  );
}
