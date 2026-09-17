import React, { useEffect, useState } from "react";
import { getData } from "../../api/apiAxios";

export default function ProfitLossList() {
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
        `reports/profit-and-loss${query ? `?${query}` : ""}`
      );

      setData(response);
    } catch (err) {
      console.error(err);
      setError("Unable to load Profit & Loss.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const rows = [
    ["Revenue", data?.revenue],
    ["COGS (Approx.)", data?.cogs_approx],
    ["Gross Profit (Approx.)", data?.gross_profit_approx],
    ["Operating Expenses", data?.operating_expenses],
    ["Net Profit (Approx.)", data?.net_profit_approx],
  ];

  return (
    <div>
      <h1 className="page-title">Profit & Loss</h1>
      <p className="page-sub">
        Revenue, approximate cost of goods sold, expenses and profit.
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
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Particular</th>
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