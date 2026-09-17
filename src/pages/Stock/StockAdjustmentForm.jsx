import React, { useEffect, useState } from "react";

import FieldLabel from "../../components/forms/FieldLabel.jsx";
import SearchableSelect from "../../components/SearchableSelect.jsx";

import { getData } from "../../api/apiAxios";


export default function StockAdjustmentForm({
  formData,
  setFormData,
  onSubmit,
  onClose,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getData("products?offset=0&limit=500")
      .then((res) => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setFormError("Couldn't load products.");
        setLoading(false);
      });
  }, []);

  const setField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.product_id ||
      !formData.quantity_change
    ) {
      setFormError(
        "Product and quantity change are required."
      );
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      await onSubmit({
        product_id: Number(formData.product_id),
        quantity_change: Number(
          formData.quantity_change
        ),
        notes: formData.notes || null,
      });
    } catch (err) {
      setFormError(
        err.message ||
          "Couldn't save stock adjustment."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading products…
      </div>
    );
  }

  return (
    <form
      className="form-stack"
      onSubmit={handleSubmit}
    >
      {formError && (
        <div className="error-banner">
          {formError}
        </div>
      )}

      <div>
        <FieldLabel>Product</FieldLabel>

        <SearchableSelect
          options={products.map((p) => ({
            value: p.id,
            label: p.name,
          }))}
          value={formData.product_id || ""}
          onChange={(value) =>
            setField("product_id", value)
          }
          placeholder="Search products…"
        />
      </div>

      <div>
        <FieldLabel>
          Quantity Change
        </FieldLabel>

        <input
          type="number"
          className="text-input"
          value={
            formData.quantity_change || ""
          }
          onChange={(e) =>
            setField(
              "quantity_change",
              e.target.value
            )
          }
          placeholder="Example: 10 or -5"
        />
      </div>

      <div>
        <FieldLabel>Notes</FieldLabel>

        <textarea
          className="text-input"
          rows="3"
          value={formData.notes || ""}
          onChange={(e) =>
            setField("notes", e.target.value)
          }
          placeholder="Reason for adjustment"
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
            : "Save Adjustment"}
        </button>
      </div>
    </form>
  );
}