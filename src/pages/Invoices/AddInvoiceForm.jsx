import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import FieldLabel from "../../../components/FieldLabel.jsx";
import { fetchCustomers } from "../../../api/customers.js";
import { fetchProducts } from "../../../api/products.js";
import { createInvoice } from "../../../api/invoices.js";

/**
 * IMPORTANT ASSUMPTION — flagged per the user's own request to proceed
 * without waiting for confirmation:
 *
 * The confirmed /invoices response shows totals (total_amount, gst_amount,
 * grand_total, gst_summary) but never the line items that produced them.
 * There's no way to know the real POST payload shape without seeing it
 * fail or succeed against the live endpoint.
 *
 * This form assumes the backend accepts:
 *   {
 *     customer_id: number,
 *     date: "YYYY-MM-DD",
 *     items: [{ product_id, quantity, rate, gst_rate }]
 *   }
 * and computes totals itself server-side. If that's wrong, tell me the
 * actual error/response and this is a small, contained fix — only this
 * file's handleSubmit payload needs to change, nothing else in the app.
 */

function emptyLine() {
  return { product_id: "", quantity: 1, rate: "0.00", gst_rate: "0.00" };
}

export default function AddInvoiceForm({ onSuccess, onCancel }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState([emptyLine()]);

  const [loadingRefs, setLoadingRefs] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Reference data for the pickers — first 100 of each. Fine for now;
    // if either list grows past that, these should become searchable
    // selects instead of a plain <select> with everything loaded.
    Promise.all([
      fetchCustomers({ offset: 0, limit: 100 }),
      fetchProducts({ offset: 0, limit: 100 }),
    ]).then(([c, p]) => {
      setCustomers(c.data);
      setProducts(p.data);
      setLoadingRefs(false);
    }).catch(() => {
      setFormError("Couldn't load customers/products for this form.");
      setLoadingRefs(false);
    });
  }, []);

  const updateLine = (i, field, value) => {
    setLines((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      if (field === "product_id") {
        const product = products.find((p) => String(p.id) === String(value));
        if (product) {
          next[i].rate = product.rate;
          next[i].gst_rate = product.gst_rate;
        }
      }
      return next;
    });
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);
  const removeLine = (i) => setLines((prev) => prev.filter((_, idx) => idx !== i));

  const lineAmount = (line) => (Number(line.quantity) || 0) * (Number(line.rate) || 0);
  const lineGst = (line) => lineAmount(line) * ((Number(line.gst_rate) || 0) / 100);

  const totalAmount = lines.reduce((sum, l) => sum + lineAmount(l), 0);
  const gstAmount = lines.reduce((sum, l) => sum + lineGst(l), 0);
  const grandTotal = totalAmount + gstAmount;

  const validate = () => {
    const errors = {};
    if (!customerId) errors.customer_id = "Choose a customer.";
    if (!date) errors.date = "Choose a date.";
    if (lines.length === 0 || lines.every((l) => !l.product_id)) errors.items = "Add at least one line item.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setFormError("");
    setSaving(true);
    try {
      const created = await createInvoice({
        customer_id: customerId,
        date,
        items: lines
          .filter((l) => l.product_id)
          .map((l) => ({
            product_id: l.product_id,
            quantity: Number(l.quantity) || 1,
            rate: l.rate,
            gst_rate: l.gst_rate,
          })),
      });
      setSaving(false);
      onSuccess?.(created);
    } catch (err) {
      setFormError(err.message || "Couldn't save this invoice — the payload shape may not match what the backend expects (see the note in this form's code).");
      setSaving(false);
    }
  };

  if (loadingRefs) {
    return <div className="loading-state">Loading customers and products…</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      {formError && <div className="error-banner">{formError}</div>}

      <div className="form-grid-2">
        <div>
          <FieldLabel>Customer</FieldLabel>
          <select
            className="select"
            value={customerId}
            onChange={(e) => { setCustomerId(e.target.value); if (fieldErrors.customer_id) setFieldErrors({ ...fieldErrors, customer_id: null }); }}
          >
            <option value="">Select a customer…</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {fieldErrors.customer_id && <div className="field-error">{fieldErrors.customer_id}</div>}
        </div>
        <div>
          <FieldLabel>Date</FieldLabel>
          <input
            type="date"
            className="select"
            value={date}
            onChange={(e) => { setDate(e.target.value); if (fieldErrors.date) setFieldErrors({ ...fieldErrors, date: null }); }}
          />
          {fieldErrors.date && <div className="field-error">{fieldErrors.date}</div>}
        </div>
      </div>

      <div>
        <FieldLabel>Line Items</FieldLabel>
        {fieldErrors.items && <div className="field-error" style={{ marginBottom: 8 }}>{fieldErrors.items}</div>}
        <div className="invoice-lines">
          {lines.map((line, i) => (
            <div className="invoice-line-row" key={i}>
              <select
                className="select"
                value={line.product_id}
                onChange={(e) => updateLine(i, "product_id", e.target.value)}
              >
                <option value="">Select product…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input
                type="number"
                className="text-input"
                min="1"
                value={line.quantity}
                onChange={(e) => updateLine(i, "quantity", e.target.value)}
                title="Quantity"
              />
              <input
                type="number"
                step="0.01"
                className="text-input"
                value={line.rate}
                onChange={(e) => updateLine(i, "rate", e.target.value)}
                title="Rate"
              />
              <div className="invoice-line-amount">₹{lineAmount(line).toFixed(2)}</div>
              <button type="button" className="icon-btn danger" onClick={() => removeLine(i)} title="Remove line">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={addLine}>
          <Plus size={13} /> Add Line
        </button>
      </div>

      <div className="invoice-totals">
        <div><span>Subtotal</span><span>₹{totalAmount.toFixed(2)}</span></div>
        <div><span>GST</span><span>₹{gstAmount.toFixed(2)}</span></div>
        <div className="invoice-totals-grand"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
      </div>

      <div className="action-row">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Create Invoice"}</button>
      </div>
    </form>
  );
}
