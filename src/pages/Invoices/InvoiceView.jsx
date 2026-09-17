import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Pencil, Download, Mail, MessageCircle } from "lucide-react";
import FormDrawer from "../../components/common/FormDrawer.jsx";
import InvoiceForm from "./InvoiceForm.jsx";
// import { fetchInvoice } from "../../../api/invoices.js";
import { getData } from "../../api/apiAxios.js";

import { downloadInvoicePdf } from "../../utils/generateInvoicePdf.js";

function statusClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "paid") return "paid";
  if (s === "unpaid") return "unpaid";
  return "draft";
}

export default function InvoiceView({id}) {
  //const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getData(`invoices/${id}`)
      .then((data) => { if (!cancelled) setInvoice(data); })
      .catch(() => { if (!cancelled) setError("Couldn't load this invoice."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="loading-state">Loading invoice…</div>;

  if (error || !invoice) {
    return (
      <div>
        <button className="link-btn" onClick={() => navigate("/admin/invoices")}><ChevronLeft size={15} /> Back to Invoices</button>
        <div className="error-banner">{error || "Invoice not found."}</div>
      </div>
    );
  }

  // Confirmed shape from GET /invoices/{id}: items is a real array, each
  // with its own nested `product`. gst_summary is keyed by rate string
  // (e.g. "5.00") with { total_items, subtotal, total_tax_amount }.
  const items = invoice.items || null;
  const gstRows = invoice.gst_summary
    ? Object.entries(invoice.gst_summary).filter(([, v]) => v.total_items > 0)
    : [];

  // Browsers can't attach a generated file to a WhatsApp/email link without
  // a backend to host it — these send a text summary, not the PDF itself.
  // The PDF has to be downloaded and attached manually for now.
  const shareText = `Invoice ${invoice.invoice_number} for ${invoice.customer?.name || "customer"} — Grand Total ₹${invoice.grand_total}. Status: ${invoice.status}.`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(`Invoice ${invoice.invoice_number}`)}&body=${encodeURIComponent(shareText)}`;

  return (
    <div style={{ maxWidth: 780 }}>
      <button className="link-btn" onClick={() => navigate("/admin/invoices")}><ChevronLeft size={15} /> Back to Invoices</button>

      <div className="page-head-row">
        <div>
          <h1 className="page-title">{invoice.invoice_number}</h1>
          <p className="page-sub">{invoice.date}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className={`status-pill ${statusClass(invoice.status)}`}><span className="status-dot" />{invoice.status}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => downloadInvoicePdf(invoice)} title="Download PDF">
            <Download size={13} /> Download
          </button>
          <a className="btn btn-secondary btn-sm" href={whatsappUrl} target="_blank" rel="noreferrer" title="Share summary via WhatsApp (text only — see note below)">
            <MessageCircle size={13} /> WhatsApp
          </a>
          <a className="btn btn-secondary btn-sm" href={mailtoUrl} title="Share summary via Email (text only — see note below)">
            <Mail size={13} /> Email
          </a>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditOpen(true)}><Pencil size={13} /> Edit</button>
        </div>
      </div>

      <p className="page-sub" style={{ marginTop: -10, marginBottom: 20 }}>
        WhatsApp/Email share a text summary of this invoice — attaching the PDF automatically isn't possible from the browser without a backend to host it. Download it and attach manually for now.
      </p>

      <div className="box" style={{ marginBottom: 20 }}>
        <div className="box-header">Customer</div>
        <div className="box-body">
          <div className="list-title" style={{ marginBottom: 4 }}>{invoice.customer?.name}</div>
          <div className="list-meta">{invoice.customer?.email} · {invoice.customer?.phone}</div>
          <div className="list-meta" style={{ marginTop: 4 }}>{invoice.customer?.address}</div>
          {invoice.customer?.gstin && invoice.customer.gstin !== "0" && (
            <div className="list-meta" style={{ marginTop: 4 }}>GSTIN: {invoice.customer.gstin}</div>
          )}
        </div>
      </div>

      {items ? (
        <div className="table-card" style={{ marginBottom: 20 }}>
          <table className="data-table">
            <thead>
              <tr><th>Product</th><th>HSN</th><th>Qty</th><th>MRP</th><th>Rate</th><th>Discount</th><th>GST %</th><th>Total</th></tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.product?.name || it.product_id}</td>
                  <td>{it.product?.hsn_code}</td>
                  <td>{it.quantity}</td>
                  <td>₹{it.mrp}</td>
                  <td>₹{it.rate}</td>
                  <td>{it.discount}%</td>
                  <td>{it.gst_rate}</td>
                  <td>₹{it.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="box" style={{ marginBottom: 20 }}>
          <div className="box-header">GST Breakdown</div>
          <div className="box-body">
            {gstRows.length > 0 ? (
              <table className="data-table">
                <thead><tr><th>GST Rate</th><th>Items</th><th>Subtotal</th><th>Tax</th></tr></thead>
                <tbody>
                  {gstRows.map(([rate, v]) => (
                    <tr key={rate}><td>{rate}%</td><td>{v.total_items}</td><td>₹{v.subtotal}</td><td>₹{v.total_tax_amount}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="page-sub" style={{ margin: 0 }}>No line-item breakdown available for this invoice.</p>
            )}
          </div>
        </div>
      )}

      <div className="invoice-totals">
        <div><span>Subtotal</span><span>₹{invoice.total_amount}</span></div>
        <div><span>GST</span><span>₹{invoice.gst_amount}</span></div>
        <div className="invoice-totals-grand"><span>Grand Total</span><span>₹{invoice.grand_total}</span></div>
      </div>

      <FormDrawer open={editOpen} onClose={() => setEditOpen(false)} title="Edit Invoice" width={560}>
        <InvoiceForm
          initial={invoice}
          onCancel={() => setEditOpen(false)}
          onSuccess={(updated) => { setEditOpen(false); setInvoice(updated); }}
        />
      </FormDrawer>
    </div>
  );
}