import React from "react";

export default function DownloadModal() {
  return (
    <div className="modal">
      <h2>Download Options</h2>
      <p>Select the format you want to download:</p>
      <ul>
        <li>PDF</li>
        <li>Word</li>
        <li>Excel</li>
      </ul>
    </div>
  );
}
