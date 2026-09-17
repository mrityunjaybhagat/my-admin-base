import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import InvoiceForm from "./InvoiceForm.jsx";
import { fetchInvoice } from "../../../api/invoices.js";

export default function InvoiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchInvoice(id).then((result) => {
      if (cancelled) return;
      if (!result) setNotFound(true);
      else setInvoice(result);
      setLoading(false);
    }).catch(() => { if (!cancelled) { setNotFound(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="loading-state">Loading invoice…</div>;

  if (notFound) {
    return (
      <div>
        <button className="link-btn" onClick={() => navigate("/admin/invoices")}><ChevronLeft size={15} /> Back to Invoices</button>
        <p className="page-sub">That invoice couldn't be found.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <button className="link-btn" onClick={() => navigate(`/admin/invoices/${id}`)}><ChevronLeft size={15} /> Back to Invoice</button>
      <h1 className="page-title" style={{ marginBottom: 18 }}>Edit Invoice {invoice.invoice_number}</h1>
      <InvoiceForm
        initial={invoice}
        onCancel={() => navigate(`/admin/invoices/${id}`)}
        onSuccess={() => navigate(`/admin/invoices/${id}`)}
      />
    </div>
  );
}
