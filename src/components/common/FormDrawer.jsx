import React, { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { getFormComponent } from "../formMap";

const ANIMATION_MS = 220;

export default function FormDrawer({
  id,
  open,
  onClose,
  title,
  children,
  width = 440,
}) {
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      setClosing(false);
      return;
    }

    if (rendered) {
      setClosing(true);

      const timer = setTimeout(() => {
        setRendered(false);
        setClosing(false);
      }, ANIMATION_MS);

      return () => clearTimeout(timer);
    }
  }, [open, rendered]);

  useEffect(() => {
    if (!rendered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [rendered]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!rendered) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [rendered, handleClose]);

  if (!rendered) return null;

  return (
    <>
      <div
        className={`drawer-overlay${closing ? " closing" : ""}`}
        onClick={handleClose}
      />

      <div
        className={`drawer-panel${closing ? " closing" : ""}`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title">
            {title}
          </div>

          <button
            type="button"
            className="drawer-close"
            onClick={handleClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="drawer-body">
          {children}
        </div>
      </div>
    </>
  );
}