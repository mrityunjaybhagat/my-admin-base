import React, { useState } from "react";

function FieldLabel({ children }) {
  return <div className="field-label">{children}</div>;
}

export default function DefaultForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
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

  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = "Name is required";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone must be 10 digits";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    if (!validateForm()) return;

    try {
      setSaving(true);

      await onSubmit(formData);
    } catch (error) {
      setFormError("Unable to save customer.");
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
        <FieldLabel>Name</FieldLabel>

        <input
          type="text"
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
          type="email"
          name="email"
          className="text-input"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="name@example.com"
        />
      </div>

      <div>
        <FieldLabel>Phone</FieldLabel>

        <input
          type="text"
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
          type="text"
          name="gstin"
          className="text-input"
          value={formData.gstin || ""}
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>

      <div className="action-row">

        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>

      </div>

    </form>
  );
}