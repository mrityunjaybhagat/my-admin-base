import React, { useEffect, useState } from "react";
import FieldLabel from "../../components/forms/FieldLabel.jsx";
import SearchableSelect from "../../components/SearchableSelect.jsx";


const PAYMENT_MODES = [
  "Cash",
  "Bank Transfer",
  "UPI",
  "Cheque",
  "Other",
];

export default function PaymentForm({
  formData,
  setFormData,
  onSubmit,
  onClose,
}) {
  const [invoices, setInvoices] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await getData("invoices?offset=0&limit=100");
        setInvoices(response.data || []);
      } catch (error) {
        console.error("Failed to load invoices:", error);
      }
    };

    loadInvoices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleInvoiceChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      invoice_id: value,
    }));

    if (fieldErrors.invoice_id) {
      setFieldErrors((prev) => ({
        ...prev,
        invoice_id: null,
      }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.invoice_id) {
      errors.invoice_id = "Invoice is required.";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      errors.amount = "Enter a valid amount.";
    }

    if (!formData.method) {
      errors.method = "Payment mode is required.";
    }

    if (!formData.date) {
      errors.date = "Date is required.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setFormError("");
    setSaving(true);

    try {
      await onSubmit({
        ...formData,
        invoice_id: Number(formData.invoice_id),
        amount: Number(formData.amount),
        reference_note: formData.reference_note || null,
      });
    } catch (error) {
      setFormError(
        error.message || "Couldn't save payment."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-stack">

      {formError && (
        <div className="error-banner">
          {formError}
        </div>
      )}

      <div>
        <FieldLabel>Invoice</FieldLabel>

        <SearchableSelect
          options={invoices}
          value={formData.invoice_id || ""}
          onChange={handleInvoiceChange}
          placeholder="Select invoice"
          getValue={(item) => item.id}
          getLabel={(item) =>
            `${item.invoice_number} — ₹${Number(
              item.grand_total || 0
            ).toFixed(2)}`
          }
        />

        {fieldErrors.invoice_id && (
          <div className="field-error">
            {fieldErrors.invoice_id}
          </div>
        )}
      </div>

      <div className="form-grid-2">

        <div>
          <FieldLabel>Amount Received</FieldLabel>

          <input
            type="number"
            step="0.01"
            min="0.01"
            name="amount"
            className="text-input"
            value={formData.amount || ""}
            onChange={handleChange}
          />

          {fieldErrors.amount && (
            <div className="field-error">
              {fieldErrors.amount}
            </div>
          )}
        </div>

        <div>
          <FieldLabel>Date</FieldLabel>

          <input
            type="date"
            name="date"
            className="text-input"
            value={formData.date || ""}
            onChange={handleChange}
          />

          {fieldErrors.date && (
            <div className="field-error">
              {fieldErrors.date}
            </div>
          )}
        </div>

      </div>

      <div>
        <FieldLabel>Payment Mode</FieldLabel>

        <select
          name="method"
          className="select"
          value={formData.method || ""}
          onChange={handleChange}
        >
          <option value="">Select payment mode</option>

          {PAYMENT_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>

        {fieldErrors.method && (
          <div className="field-error">
            {fieldErrors.method}
          </div>
        )}
      </div>

      <div>
        <FieldLabel>Reference / Note</FieldLabel>

        <input
          type="text"
          name="reference_note"
          className="text-input"
          value={formData.reference_note || ""}
          onChange={handleChange}
          placeholder="UPI ref, cheque number, note..."
        />
      </div>

      <div className="action-row">

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving
            ? "Saving…"
            : formData.id
            ? "Save Changes"
            : "Add Payment"}
        </button>

      </div>

    </form>
  );
}