// src/components/Loader.jsx
export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <span>{text}</span>
    </div>
  );
}