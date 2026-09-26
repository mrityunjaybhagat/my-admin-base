import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Users } from "lucide-react";

export default function Gstr1B2C() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const month = searchParams.get("month");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const rows = [
    {
      id: 1,
      rate: 5,
      taxableValue: 18500,
      igst: 0,
      cgst: 462.5,
      sgst: 462.5,
      totalTax: 925,
    },
    {
      id: 2,
      rate: 12,
      taxableValue: 12400,
      igst: 0,
      cgst: 744,
      sgst: 744,
      totalTax: 1488,
    },
    {
      id: 3,
      rate: 18,
      taxableValue: 28600,
      igst: 0,
      cgst: 2574,
      sgst: 2574,
      totalTax: 5148,
    },
  ];

  const totals = rows.reduce(
    (acc, row) => {
      acc.taxableValue += row.taxableValue;
      acc.igst += row.igst;
      acc.cgst += row.cgst;
      acc.sgst += row.sgst;
      acc.totalTax += row.totalTax;
      return acc;
    },
    {
      taxableValue: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      totalTax: 0,
    }
  );

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const periodLabel = month
    ? new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : from && to
      ? `${from} to ${to}`
      : "All";

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

      <h1 className="page-title">GSTR-1/IFF — B2C</h1>

      <p className="page-sub">
        Outward supplies to unregistered customers — {periodLabel}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
          marginTop: 22,
        }}
      >
        <SummaryCard
          label="Taxable Value"
          value={`₹${formatAmount(totals.taxableValue)}`}
        />

        <SummaryCard
          label="CGST"
          value={`₹${formatAmount(totals.cgst)}`}
        />

        <SummaryCard
          label="SGST"
          value={`₹${formatAmount(totals.sgst)}`}
        />

        <SummaryCard
          label="Total GST"
          value={`₹${formatAmount(totals.totalTax)}`}
        />
      </div>

      <div className="table-card" style={{ marginTop: 22, overflowX: "auto" }}>
        <div
          style={{
            padding: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Users size={20} />
            <h3 style={{ margin: 0 }}>B2C Summary</h3>
          </div>

          <button className="btn btn-primary">
            <Download size={15} />
            Export
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>GST Rate</th>
              <th>Taxable Value</th>
              <th>IGST</th>
              <th>CGST</th>
              <th>SGST</th>
              <th>Total GST</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.rate}%</td>
                <td>₹{formatAmount(row.taxableValue)}</td>
                <td>₹{formatAmount(row.igst)}</td>
                <td>₹{formatAmount(row.cgst)}</td>
                <td>₹{formatAmount(row.sgst)}</td>
                <td>₹{formatAmount(row.totalTax)}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th>Total</th>
              <th>₹{formatAmount(totals.taxableValue)}</th>
              <th>₹{formatAmount(totals.igst)}</th>
              <th>₹{formatAmount(totals.cgst)}</th>
              <th>₹{formatAmount(totals.sgst)}</th>
              <th>₹{formatAmount(totals.totalTax)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="table-card" style={{ padding: 18 }}>
      <div className="page-sub" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 21, fontWeight: 700 }}>{value}</div>
    </div>
  );
}