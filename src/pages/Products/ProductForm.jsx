import React, { useState } from "react";
import FieldLabel from "../../components/forms/FieldLabel.jsx";

export default function ProductForm({
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
        gst_rate: formData.gst_rate || "0.00",
        reorder_level: formData.reorder_level || 0,
        description: formData.description || null,
      });
    } catch (err) {
      setFormError(
        err.message || "Couldn't save this product."
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
          placeholder="Product name"
        />

        {fieldErrors.name && (
          <div className="field-error">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <FieldLabel>HSN Code</FieldLabel>
        <input
          name="hsn_code"
          className="text-input"
          value={formData.hsn_code || ""}
          onChange={handleChange}
          placeholder="e.g. 96190010"
        />
      </div>

      <div className="form-grid-2">
        <div>
          <FieldLabel>GST Rate (%)</FieldLabel>
          <input
            name="gst_rate"
            className="text-input"
            type="number"
            step="0.01"
            value={formData.gst_rate || ""}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

        <div>
          <FieldLabel>Reorder Level</FieldLabel>
          <input
            name="reorder_level"
            className="text-input"
            type="number"
            value={formData.reorder_level || ""}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      <div className="form-grid-2">
        <div>
          <FieldLabel>MRP</FieldLabel>
          <input
            name="mrp"
            className="text-input"
            type="number"
            step="0.01"
            value={formData.mrp || ""}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

        <div>
          <FieldLabel>Rate</FieldLabel>
          <input
            name="rate"
            className="text-input"
            type="number"
            step="0.01"
            value={formData.rate || ""}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea
          name="description"
          className="textarea"
          rows={3}
          value={formData.description || ""}
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
          {saving ? "Saving…" : "Save Product"}
        </button>
      </div>
    </form>
  );
}