import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

/**
 * Generic searchable dropdown. Not tied to any module — pass options with
 * a label/value shape (or custom getLabel/getValue), get onChange(value).
 * `footer` lets a caller inject something at the bottom of the panel
 * (e.g. an "Add New…" button) without this component knowing what it is.
 */
export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  getLabel = (o) => o.label,
  getValue = (o) => o.value,
  footer,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selected = options.find((o) => String(getValue(o)) === String(value));
  const filtered = query
    ? options.filter((o) => getLabel(o).toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div className="searchable-select" ref={ref}>
      <button type="button" className="searchable-select-trigger" onClick={() => setOpen((o) => !o)}>
        <span className={selected ? "" : "searchable-select-placeholder"}>
          {selected ? getLabel(selected) : placeholder}
        </span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="searchable-select-panel">
          <div className="searchable-select-search">
            <Search size={13} color="var(--muted)" />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type to search…" />
          </div>
          <div className="searchable-select-list">
            {filtered.length === 0 && <div className="searchable-select-empty">No matches.</div>}
            {filtered.map((o) => (
              <button
                type="button"
                key={getValue(o)}
                className={`searchable-select-option${String(getValue(o)) === String(value) ? " selected" : ""}`}
                onClick={() => { onChange(getValue(o)); setOpen(false); setQuery(""); }}
              >
                {getLabel(o)}
              </button>
            ))}
          </div>
          {footer && <div className="searchable-select-footer">{footer}</div>}
        </div>
      )}
    </div>
  );
}
