import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  ReceiptText,
} from "lucide-react";

export default function Gstr1B2B() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const month = searchParams.get("month");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Dummy data for UI/demo.
  // Later replace this with Laravel API response.
  const rows = [
    {
      id: 1,
      gstin: "19ABCDE1234F1Z5",
      customer: "ABC Enterprises",
      invoiceNo: "A000401",
      invoiceDate: "05-09-2026",
      invoiceValue: 11800,
      taxableValue: 10000,
      rate: 18,
      igst: 0,
      cgst: 900,
      sgst: 900,
    },
    {
      id: 2,
      gstin: "19XYZAB5678G1Z2",
      customer: "XYZ Traders",
      invoiceNo: "A000402",
      invoiceDate: "12-09-2026",
      invoiceValue: 5900,
      taxableValue: 5000,
      rate: 18,
      igst: 0,
      cgst: 450,
      sgst: 450,
    },
    {
      id: 3,
      gstin: "27PQRSX4321A1Z8",
      customer: "PQR Distributors",
      invoiceNo: "A000403",
      invoiceDate: "18-09-2026",
      invoiceValue: 23600,
      taxableValue: 20000,
      rate: 18,
      igst: 3600,
      cgst: 0,
      sgst: 0,
    },
  ];

  const totals = rows.reduce(
    (acc, row) => {
      acc.invoiceValue += Number(row.invoiceValue || 0);
      acc.taxableValue += Number(row.taxableValue || 0);
      acc.igst += Number(row.igst || 0);
      acc.cgst += Number(row.cgst || 0);
      acc.sgst += Number(row.sgst || 0);

      return acc;
    },
    {
      invoiceValue: 0,
      taxableValue: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
    }
  );

  const totalGst =
    totals.igst +
    totals.cgst +
    totals.sgst;

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const periodLabel = month
    ? new Date(`${month}-01T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          month: "long",
          year: "numeric",
        }
      )
    : from && to
      ? `${from} to ${to}`
      : "All";

  return (
    <div>
      {/* BACK */}
      <button
        className="btn"
        onClick={() =>
          navigate("/admin/reports/gst-returns")
        }
        style={{ marginBottom: 14 }}
      >
        <ArrowLeft size={15} />
        GST Returns
      </button>

      {/* PAGE HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="page-title">
            GSTR-1/IFF — B2B
          </h1>

          <p className="page-sub">
            Taxable outward supplies made to registered
            persons — {periodLabel}
          </p>
        </div>

        <button className="btn btn-primary">
          <Download size={15} />
          Export
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
          marginTop: 22,
        }}
      >
        <SummaryCard
          label="Total Invoices"
          value={rows.length}
        />

        <SummaryCard
          label="Invoice Value"
          value={`₹${formatAmount(
            totals.invoiceValue
          )}`}
        />

        <SummaryCard
          label="Taxable Value"
          value={`₹${formatAmount(
            totals.taxableValue
          )}`}
        />

        <SummaryCard
          label="Total GST"
          value={`₹${formatAmount(totalGst)}`}
        />
      </div>

      {/* TABLE */}
      <div
        className="table-card"
        style={{
          marginTop: 22,
          overflowX: "auto",
        }}
      >
        <div
          style={{
            padding: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ReceiptText size={20} />

          <div>
            <h3 style={{ margin: 0 }}>
              B2B Invoice Details
            </h3>

            <p
              className="page-sub"
              style={{ margin: "4px 0 0" }}
            >
              Registered customer invoices for the
              selected return period.
            </p>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>GSTIN</th>
              <th>Customer</th>
              <th>Invoice No.</th>
              <th>Invoice Date</th>
              <th>Invoice Value</th>
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
                <td>{row.gstin}</td>

                <td>{row.customer}</td>

                <td>{row.invoiceNo}</td>

                <td>{row.invoiceDate}</td>

                <td>
                  ₹{formatAmount(row.invoiceValue)}
                </td>

                <td>
                  ₹{formatAmount(row.taxableValue)}
                </td>

                <td>{row.rate}%</td>

                <td>
                  ₹{formatAmount(row.igst)}
                </td>

                <td>
                  ₹{formatAmount(row.cgst)}
                </td>

                <td>
                  ₹{formatAmount(row.sgst)}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th colSpan="4">Total</th>

              <th>
                ₹{formatAmount(
                  totals.invoiceValue
                )}
              </th>

              <th>
                ₹{formatAmount(
                  totals.taxableValue
                )}
              </th>

              <th></th>

              <th>
                ₹{formatAmount(totals.igst)}
              </th>

              <th>
                ₹{formatAmount(totals.cgst)}
              </th>

              <th>
                ₹{formatAmount(totals.sgst)}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      className="table-card"
      style={{ padding: 18 }}
    >
      <div
        className="page-sub"
        style={{
          marginBottom: 6,
          fontSize: 13,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 21,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}