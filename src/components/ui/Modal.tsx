import { useEffect } from "react";
import { Icon } from "./Icon";

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/55 backdrop-blur-sm animate-fade-in-fast" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} animate-scale-in`}>
        <div className="m-3 rounded-3xl bg-white shadow-card ring-1 ring-ink-100 sm:m-0">
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <div className="text-base font-bold text-ink-900">{title}</div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-700" aria-label="Close">
              <Icon name="X" className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
