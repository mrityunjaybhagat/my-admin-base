import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ReceiptText,
  Scale,
  TrendingUp,
  Landmark,
  ArrowRight,
} from "lucide-react";

export default function ReportsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title">Reports</h1>

      <p className="page-sub">
        View GST, balances, profit and loss, and balance sheet summaries.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
          marginTop: 22,
          alignItems: "start",
        }}
      >
        {/* GST Summary */}
        <div className="table-card" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <ReceiptText size={20} />

            <div>
              <h3 style={{ margin: 0 }}>GST Summary</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View output GST, input GST and net GST payable.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/admin/reports/gst-summary")
            }
          >
            View GST Summary
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Balances Summary */}
        <div className="table-card" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Scale size={20} />

            <div>
              <h3 style={{ margin: 0 }}>Balances Summary</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View receivables, payables, stock, cash and bank balances.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/admin/reports/balances-summary")
            }
          >
            View Balances
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Profit & Loss */}
        <div className="table-card" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <TrendingUp size={20} />

            <div>
              <h3 style={{ margin: 0 }}>Profit & Loss</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View revenue, costs, expenses and approximate profit.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/admin/reports/profit-and-loss")
            }
          >
            View Profit & Loss
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Balance Sheet */}
        <div className="table-card" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Landmark size={20} />

            <div>
              <h3 style={{ margin: 0 }}>Balance Sheet</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View assets, liabilities and approximate equity.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/admin/reports/balance-sheet")
            }
          >
            View Balance Sheet
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}