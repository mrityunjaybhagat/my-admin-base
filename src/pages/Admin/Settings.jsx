import React, { useState } from "react";
import { postData } from "../../api/apiAxios.js";

export default function Settings() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      //const response = await postData("import/customers", formData);
      //const response = await postData("import/suppliers", formData);
     //const response = await postData("import/users", formData);
     //const response = await postData("import/expenses", formData);
     const response = await postData("import/purchases", formData);
      setMessage(
        response?.message || "Customers imported successfully."
      );

      setFile(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Customer import failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage application settings and data imports.</p>
        </div>
      </div>

      <div className="card">
        <h2>Data Import</h2>

        <p>
          Import customer data using an Excel or CSV file.
        </p>

        <div style={{ marginTop: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Customers
          </label>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setMessage("");
              setError("");
            }}
          />

          <button
            type="button"
            onClick={handleImport}
            disabled={loading || !file}
            style={{ marginLeft: "12px" }}
          >
            {loading ? "Importing..." : "Import"}
          </button>
        </div>

        {message && (
          <p style={{ marginTop: "15px", color: "green" }}>
            {message}
          </p>
        )}

        {error && (
          <p style={{ marginTop: "15px", color: "red" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}