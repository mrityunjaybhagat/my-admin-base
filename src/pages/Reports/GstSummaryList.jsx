import React, { useEffect, useState } from "react";
import { getData } from "../../api/apiAxios";

export default function GstSummaryList() {
  const [data, setData] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const query = params.toString();
      const response = await getData(
        `reports/gst-summary${query ? `?${query}` : ""}`
      );

      setData(response);
    } catch (err) {
      console.error(err);
      setError("Unable to load GST summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const rows = [];

  Object.entries(data?.output_gst || {}).forEach(([rate, values]) => {
    rows.push({
      type: "Output GST",
      rate,
      taxable: values.taxable_value,
      tax: values.tax_amount,
    });
  });

  Object.entries(data?.input_gst || {}).forEach(([rate, values]) => {
    rows.push({
      type: "Input GST",
      rate,
      taxable: values.taxable_value,
      tax: values.tax_amount,
    });
  });

  return (
    <div>
      <h1 className="page-title">GST Summary</h1>
      <p className="page-sub">
        Output GST collected from customers and input GST paid to suppliers.
      </p>

      <div className="table-card" style={{ padding: 20, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label>From</label>
            <input
              type="date"
              className="text-input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div>
            <label>To</label>
            <input
              type="date"
              className="text-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={loadReport}>
            Apply
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>GST Rate</th>
                  <th>Taxable Value</th>
                  <th>GST Amount</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="4">No GST data found.</td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr key={`${row.type}-${row.rate}-${index}`}>
                      <td>{row.type}</td>
                      <td>{Number(row.rate)}%</td>
                      <td>₹{Number(row.taxable || 0).toFixed(2)}</td>
                      <td>₹{Number(row.tax || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-card" style={{ padding: 20, marginTop: 20 }}>
            <strong>Net GST Payable</strong>
            <div style={{ fontSize: 24, marginTop: 8 }}>
              ₹{Number(data?.net_gst_payable || 0).toFixed(2)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}