import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText } from "lucide-react";

export default function DocumentsIssued() {
  const navigate = useNavigate();

  const rows = [
    {
      id: 1,
      type: "Invoices for outward supply",
      from: "A000001",
      to: "A000125",
      total: 125,
      cancelled: 3,
    },
    {
      id: 2,
      type: "Credit Notes",
      from: "CN00001",
      to: "CN00008",
      total: 8,
      cancelled: 0,
    },
    {
      id: 3,
      type: "Debit Notes",
      from: "DN00001",
      to: "DN00004",
      total: 4,
      cancelled: 1,
    },
  ];

  const totals = rows.reduce(
    (acc, row) => {
      acc.total += row.total;
      acc.cancelled += row.cancelled;
      return acc;
    },
    { total: 0, cancelled: 0 }
  );

  return (
    <div>
      <button
        className="btn"
        onClick={() => navigate("/admin/reports/gst-returns")}
        style={{ marginBottom: 14 }}
      >
        <ArrowLeft size={15} />
        GST Returns
      </button>

      <h1 className="page-title">Documents Issued</h1>

      <p className="page-sub">
        Document series issued during the selected GST return period.
      </p>

      <div className="table-card" style={{ marginTop: 22 }}>
        <div
          style={{
            padding: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <FileText size={20} />
            <h3 style={{ margin: 0 }}>Document Summary</h3>
          </div>

          <button className="btn btn-primary">
            <Download size={15} />
            Export
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Nature of Document</th>
              <th>Sr. No. From</th>
              <th>Sr. No. To</th>
              <th>Total Number</th>
              <th>Cancelled</th>
              <th>Net Issued</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.type}</td>
                <td>{row.from}</td>
                <td>{row.to}</td>
                <td>{row.total}</td>
                <td>{row.cancelled}</td>
                <td>{row.total - row.cancelled}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th colSpan="3">Total</th>
              <th>{totals.total}</th>
              <th>{totals.cancelled}</th>
              <th>{totals.total - totals.cancelled}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}