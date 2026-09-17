import React, { useState } from "react";
import FieldLabel from "../../components/forms/FieldLabel.jsx";

const PAYMENT_MODES = [
  "Cash",
  "Bank Transfer",
  "UPI",
  "Cheque",
  "Other",
];

export default function CashVoucherForm({
  formData,
  setFormData,
  onSubmit,
  onClose,
}) {
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

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

  const validate = () => {
    const errors = {};

    if (!formData.type) {
      errors.type = "Voucher type is required.";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      errors.amount = "Enter a valid amount.";
    }

    if (!formData.payment_mode) {
      errors.payment_mode = "Payment mode is required.";
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
        amount: Number(formData.amount),
        party_name: formData.party_name || null,
        narration: formData.narration || null,
      });
    } catch (error) {
      setFormError(
        error.message || "Couldn't save cash voucher."
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

      <div className="form-grid-2">

        <div>
          <FieldLabel>Voucher Type</FieldLabel>

          <select
            name="type"
            className="select"
            value={formData.type || ""}
            onChange={handleChange}
          >
            <option value="">Select type</option>
            <option value="Receipt">Receipt</option>
            <option value="Payment">Payment</option>
          </select>

          {fieldErrors.type && (
            <div className="field-error">
              {fieldErrors.type}
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
        <FieldLabel>Party Name</FieldLabel>

        <input
          type="text"
          name="party_name"
          className="text-input"
          value={formData.party_name || ""}
          onChange={handleChange}
          placeholder="Received from / Paid to"
        />
      </div>

      <div className="form-grid-2">

        <div>
          <FieldLabel>Amount</FieldLabel>

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
          <FieldLabel>Payment Mode</FieldLabel>

          <select
            name="payment_mode"
            className="select"
            value={formData.payment_mode || ""}
            onChange={handleChange}
          >
            <option value="">Select payment mode</option>

            {PAYMENT_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>

          {fieldErrors.payment_mode && (
            <div className="field-error">
              {fieldErrors.payment_mode}
            </div>
          )}
        </div>

      </div>

      <div>
        <FieldLabel>Narration</FieldLabel>

        <textarea
          name="narration"
          className="text-input"
          rows="3"
          value={formData.narration || ""}
          onChange={handleChange}
          placeholder="Voucher details"
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
            : "Create Voucher"}
        </button>

      </div>

    </form>
  );
}