import React, { useEffect, useState } from "react";
import { getData } from "../../api/apiAxios";

export default function BalancesSummaryList() {
  const [data, setData] = useState(null);
  const [asOf, setAsOf] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const query = asOf ? `?as_of=${asOf}` : "";
      const response = await getData(`reports/balances-summary${query}`);

      setData(response);
    } catch (err) {
      console.error(err);
      setError("Unable to load balances summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const rows = [
    ["Receivables", data?.receivables],
    ["Payables", data?.payables],
    ["Stock Value", data?.stock_value],
    ["Cash Balance", data?.cash_balance],
    ["Bank Balance", data?.bank_balance],
  ];

  return (
    <div>
      <h1 className="page-title">Balances Summary</h1>
      <p className="page-sub">
        Current receivables, payables, stock, cash and bank position.
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
            <label>As of</label>
            <input
              type="date"
              className="text-input"
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
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
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Balance</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {rows.map(([label, amount]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>₹{Number(amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}