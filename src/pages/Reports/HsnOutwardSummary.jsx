import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, PackageSearch } from "lucide-react";

export default function HsnOutwardSummary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const month = searchParams.get("month");

  const rows = [
    {
      id: 1,
      hsn: "30049099",
      description: "Pharmaceutical Products",
      uqc: "NOS",
      quantity: 120,
      taxableValue: 24500,
      rate: 12,
      igst: 0,
      cgst: 1470,
      sgst: 1470,
    },
    {
      id: 2,
      hsn: "90189099",
      description: "Medical Equipment",
      uqc: "NOS",
      quantity: 35,
      taxableValue: 42000,
      rate: 18,
      igst: 0,
      cgst: 3780,
      sgst: 3780,
    },
    {
      id: 3,
      hsn: "39269099",
      description: "Plastic Articles",
      uqc: "NOS",
      quantity: 75,
      taxableValue: 15000,
      rate: 18,
      igst: 2700,
      cgst: 0,
      sgst: 0,
    },
  ];

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totals = rows.reduce(
    (acc, row) => {
      acc.quantity += row.quantity;
      acc.taxable += row.taxableValue;
      acc.igst += row.igst;
      acc.cgst += row.cgst;
      acc.sgst += row.sgst;
      return acc;
    },
    {
      quantity: 0,
      taxable: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
    }
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

      <h1 className="page-title">
        HSN-wise Summary of Outward Supplies
      </h1>

      <p className="page-sub">
        B2B & B2C HSN summary
        {month ? ` — ${month}` : ""}
      </p>

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
            <PackageSearch size={20} />
            <h3 style={{ margin: 0 }}>HSN Summary</h3>
          </div>

          <button className="btn btn-primary">
            <Download size={15} />
            Export
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>HSN</th>
              <th>Description</th>
              <th>UQC</th>
              <th>Quantity</th>
              <th>Taxable Value</th>
              <th>Rate</th>
              <th>IGST</th>
              <th>CGST</th>
              <th>SGST</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.hsn}</td>
                <td>{row.description}</td>
                <td>{row.uqc}</td>
                <td>{row.quantity}</td>
                <td>₹{formatAmount(row.taxableValue)}</td>
                <td>{row.rate}%</td>
                <td>₹{formatAmount(row.igst)}</td>
                <td>₹{formatAmount(row.cgst)}</td>
                <td>₹{formatAmount(row.sgst)}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th colSpan="3">Total</th>
              <th>{totals.quantity}</th>
              <th>₹{formatAmount(totals.taxable)}</th>
              <th></th>
              <th>₹{formatAmount(totals.igst)}</th>
              <th>₹{formatAmount(totals.cgst)}</th>
              <th>₹{formatAmount(totals.sgst)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}