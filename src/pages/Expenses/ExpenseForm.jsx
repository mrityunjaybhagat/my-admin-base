import React, { useState } from "react";
import FieldLabel from "../../components/forms/FieldLabel.jsx";

const PAYMENT_MODES = [
  "Cash",
  "Bank Transfer",
  "UPI",
  "Cheque",
  "Other",
];

export default function ExpenseForm({
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

    if (!formData.category?.trim()) {
      errors.category = "Category is required.";
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
        vendor_name: formData.vendor_name || null,
        description: formData.description || null,
      });
    } catch (error) {
      setFormError(
        error.message || "Couldn't save expense."
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
        <FieldLabel>Category</FieldLabel>

        <input
          type="text"
          name="category"
          className="text-input"
          value={formData.category || ""}
          onChange={handleChange}
          placeholder="Office, Travel, Electricity..."
        />

        {fieldErrors.category && (
          <div className="field-error">
            {fieldErrors.category}
          </div>
        )}
      </div>

      <div>
        <FieldLabel>Vendor Name</FieldLabel>

        <input
          type="text"
          name="vendor_name"
          className="text-input"
          value={formData.vendor_name || ""}
          onChange={handleChange}
          placeholder="Vendor / paid to"
        />
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>

        <textarea
          name="description"
          className="text-input"
          rows="3"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Expense details"
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
            : "Add Expense"}
        </button>

      </div>

    </form>
  );
}