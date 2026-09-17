import React from "react";
import { Check } from "lucide-react";

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast">
      <Check size={14} color="var(--tram)" /> {message}
    </div>
  );
}
