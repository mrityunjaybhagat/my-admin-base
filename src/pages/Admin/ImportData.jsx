import React, { useState } from "react";
import { postData } from "../../api/apiAxios.js";

export default function ImportData() {
  const [moduleName, setModuleName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!moduleName) {
      setError("Please select a module.");
      return;
    }

    if (!file) {
      setError("Please select an Excel file.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await postData(
        `import/${moduleName}`,
        formData
      );

      setMessage(
        response?.message || "Data imported successfully."
      );

      setFile(null);

      const fileInput = document.getElementById("import-file");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Import failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Import Data</h1>
          <p>Import ERP data from Excel files.</p>
        </div>
      </div>

      <div className="table-card">

        <div className="form-grid-2 form-grid-3" style={{padding:"20px"}}>

          {/* Module */}
          <div className="form-group">
            <label>Module</label>

            <select
              className="text-input"
              value={moduleName}
              onChange={(e) => {
                setModuleName(e.target.value);
                setMessage("");
                setError("");
              }}
            >
              <option value="">Select Module</option>

              <option value="customers">
                Customers
              </option>

              <option value="suppliers">
                Suppliers
              </option>

              <option value="products">
                Products
              </option>

              <option value="users">
                Users
              </option>

              <option value="expenses">
                Expenses
              </option>

              <option value="purchases">
                Purchases
              </option>

              <option value="invoices">
                Invoices
              </option>
            </select>
          </div>


          {/* File */}
          <div className="form-group">
            <label>Excel File</label>

            <input
              id="import-file"
              type="file"
              accept=".xlsx,.xls"
              className="form-control"
              onChange={(e) => {
                setFile(
                  e.target.files?.[0] || null
                );

                setMessage("");
                setError("");
              }}
            />
          </div>


          {/* Import Button */}
          <div className="form-group">
            <label>&nbsp;</label>

            <button
              type="button"
              className="btn btn-primary d-block"
              onClick={handleImport}
              style={{display:"block"}}
              disabled={
                loading ||
                !moduleName ||
                !file
              }
            >
              {loading
                ? "Importing..."
                : "Import"}
            </button>
          </div>

        </div>


        {/* Result Area */}

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px 15px",
              borderRadius: "6px",
              background: "#ecfdf3",
              color: "#067647",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}


        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px 15px",
              borderRadius: "6px",
              background: "#fef3f2",
              color: "#b42318",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

      </div>

    </div>
  );
}