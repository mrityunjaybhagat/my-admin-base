import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Package,
} from "lucide-react";

export default function ProductSalesReport() {
  const navigate = useNavigate();

  const rows = [
    {
      id: 1,
      product: "Product A",
      hsn: "30049099",
      quantity: 120,
      taxableValue: 24000,
      cgst: 1440,
      sgst: 1440,
      igst: 0,
      total: 26880,
    },
    {
      id: 2,
      product: "Product B",
      hsn: "90189099",
      quantity: 35,
      taxableValue: 42000,
      cgst: 3780,
      sgst: 3780,
      igst: 0,
      total: 49560,
    },
    {
      id: 3,
      product: "Product C",
      hsn: "39269099",
      quantity: 75,
      taxableValue: 15000,
      cgst: 0,
      sgst: 0,
      igst: 2700,
      total: 17700,
    },
  ];

  const totals = rows.reduce(
    (acc, row) => {
      acc.quantity += row.quantity;
      acc.taxable += row.taxableValue;
      acc.cgst += row.cgst;
      acc.sgst += row.sgst;
      acc.igst += row.igst;
      acc.total += row.total;
      return acc;
    },
    {
      quantity: 0,
      taxable: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0,
    }
  );

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div>
      <button
        className="btn"
        onClick={() => navigate("/admin/reports")}
        style={{ marginBottom: 14 }}
      >
        <ArrowLeft size={15} />
        Reports
      </button>

      <h1 className="page-title">Product Sales Report</h1>

      <p className="page-sub">
        Product-wise quantity, taxable sales and GST summary.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginTop: 22,
        }}
      >
        <input type="date" className="form-control" />

        <input type="date" className="form-control" />

        <button className="btn btn-primary">
          Generate Report
        </button>
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
            <Package size={20} />
            <h3 style={{ margin: 0 }}>Product Sales</h3>
          </div>

          <button className="btn btn-primary">
            <Download size={15} />
            Export
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>HSN</th>
              <th>Qty Sold</th>
              <th>Taxable Sales</th>
              <th>CGST</th>
              <th>SGST</th>
              <th>IGST</th>
              <th>Total Sales</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.product}</td>
                <td>{row.hsn}</td>
                <td>{row.quantity}</td>
                <td>₹{formatAmount(row.taxableValue)}</td>
                <td>₹{formatAmount(row.cgst)}</td>
                <td>₹{formatAmount(row.sgst)}</td>
                <td>₹{formatAmount(row.igst)}</td>
                <td>₹{formatAmount(row.total)}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th colSpan="2">Total</th>
              <th>{totals.quantity}</th>
              <th>₹{formatAmount(totals.taxable)}</th>
              <th>₹{formatAmount(totals.cgst)}</th>
              <th>₹{formatAmount(totals.sgst)}</th>
              <th>₹{formatAmount(totals.igst)}</th>
              <th>₹{formatAmount(totals.total)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}