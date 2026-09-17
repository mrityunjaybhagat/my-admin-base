import React, { useState } from "react";
import FieldLabel from "../../components/forms/FieldLabel.jsx";

export default function SupplierForm({
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

    if (!formData.name?.trim()) {
      errors.name = "Name is required.";
    }

    if (!formData.phone?.trim()) {
      errors.phone = "Phone is required.";
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
      await onSubmit(formData);
    } catch (err) {
      setFormError(
        err.message || "Couldn't save this customer."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-stack">

      {formError && (
        <div className="error-banner">{formError}</div>
      )}

      <div>
        <FieldLabel>Name</FieldLabel>

        <input
          name="name"
          className="text-input"
          value={formData.name || ""}
          onChange={handleChange}
          placeholder="Customer or business name"
        />

        {fieldErrors.name && (
          <div className="field-error">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <FieldLabel>Email</FieldLabel>

        <input
          name="email"
          type="email"
          className="text-input"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="name@example.com"
        />
      </div>

      <div>
        <FieldLabel>Phone</FieldLabel>

        <input
          name="phone"
          className="text-input"
          value={formData.phone || ""}
          onChange={handleChange}
          placeholder="10-digit number"
        />

        {fieldErrors.phone && (
          <div className="field-error">
            {fieldErrors.phone}
          </div>
        )}
      </div>

      <div>
        <FieldLabel>Address</FieldLabel>

        <textarea
          name="address"
          className="textarea"
          rows={3}
          value={formData.address || ""}
          onChange={handleChange}
          placeholder="Delivery / billing address"
        />
      </div>

      <div>
        <FieldLabel>GSTIN</FieldLabel>

        <input
          name="gstin"
          className="text-input"
          value={formData.gstin || ""}
          onChange={handleChange}
          placeholder="Optional"
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
          {saving ? "Saving…" : "Save Customer"}
        </button>

      </div>

    </form>
  );
}