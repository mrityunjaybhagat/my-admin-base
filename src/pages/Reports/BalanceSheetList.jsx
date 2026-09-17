import React, { useEffect, useState } from "react";
import { getData } from "../../api/apiAxios";

export default function BalanceSheetList() {
  const [data, setData] = useState(null);
  const [asOf, setAsOf] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const query = asOf ? `?as_of=${asOf}` : "";
      const response = await getData(`reports/balance-sheet${query}`);

      setData(response);
    } catch (err) {
      console.error(err);
      setError("Unable to load Balance Sheet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const rows = [
    ["Receivables", "Assets", data?.assets?.receivables],
    ["Stock Value", "Assets", data?.assets?.stock_value],
    ["Cash Balance", "Assets", data?.assets?.cash_balance],
    ["Bank Balance", "Assets", data?.assets?.bank_balance],
    ["Total Assets", "Assets", data?.assets?.total],

    ["Payables", "Liabilities", data?.liabilities?.payables],
    ["Total Liabilities", "Liabilities", data?.liabilities?.total],

    ["Equity (Approx.)", "Equity", data?.equity_approx],
  ];

  return (
    <div>
      <h1 className="page-title">Balance Sheet</h1>
      <p className="page-sub">
        ERP summary of assets, liabilities and approximate equity.
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
                <th>Particular</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {rows.map(([label, category, amount]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{category}</td>
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