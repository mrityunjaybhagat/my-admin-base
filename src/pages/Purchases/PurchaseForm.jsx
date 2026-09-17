import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import FieldLabel from "../../components/forms/FieldLabel.jsx";
import SearchableSelect from "../../components/SearchableSelect.jsx";

import { getData } from "../../api/apiAxios.js";

const STATUSES = ["Unpaid", "Paid"];

function emptyLine() {
  return {
    product_id: "",
    quantity: 1,
    rate: "0.00",
    gst_rate: "0.00",
  };
}

export default function PurchaseForm({
  formData,
  setFormData,
  onSubmit,
  onClose,
}) {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingRefs, setLoadingRefs] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getData("suppliers?offset=0&limit=100"),
      getData("products?offset=0&limit=200"),
    ])
      .then(([s, p]) => {
        setSuppliers(s.data || []);
        setProducts(p.data || []);
        setLoadingRefs(false);
      })
      .catch(() => {
        setFormError(
          "Couldn't load suppliers/products for this form."
        );
        setLoadingRefs(false);
      });
  }, []);

  const supplierId =
    formData.supplier_id ||
    formData.supplier?.id ||
    "";

  const date =
    formData.date ||
    new Date().toISOString().slice(0, 10);

  const status =
    formData.status || "Unpaid";

  const lines =
    formData.items ||
    formData.line_items ||
    [emptyLine()];

  const setField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateLine = (i, field, value) => {
    const next = [...lines];

    next[i] = {
      ...next[i],
      [field]: value,
    };

    if (field === "product_id") {
      const product = products.find(
        (p) =>
          String(p.id) === String(value)
      );

      if (product) {
        next[i].rate =
          product.rate || "0.00";

        next[i].gst_rate =
          product.gst_rate || "0.00";
      }
    }

    setFormData((prev) => ({
      ...prev,
      items: next,
    }));
  };

  const addLine = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items ||
          prev.line_items ||
          [emptyLine()]),
        emptyLine(),
      ],
    }));
  };

  const removeLine = (i) => {
    const next = lines.filter(
      (_, index) => index !== i
    );

    setFormData((prev) => ({
      ...prev,
      items:
        next.length > 0
          ? next
          : [emptyLine()],
    }));
  };

  const lineAmount = (line) =>
    (Number(line.quantity) || 0) *
    (Number(line.rate) || 0);

  const lineGst = (line) =>
    lineAmount(line) *
    ((Number(line.gst_rate) || 0) / 100);

  const totalAmount = lines.reduce(
    (sum, line) =>
      sum + lineAmount(line),
    0
  );

  const gstAmount = lines.reduce(
    (sum, line) =>
      sum + lineGst(line),
    0
  );

  const grandTotal =
    totalAmount + gstAmount;

  const validate = () => {
    const errors = {};

    if (!supplierId)
      errors.supplier_id =
        "Choose a supplier.";

    if (!date)
      errors.date =
        "Choose a date.";

    if (
      lines.length === 0 ||
      lines.every(
        (line) => !line.product_id
      )
    ) {
      errors.items =
        "Add at least one line item.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();

    if (
      Object.keys(errors).length > 0
    ) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setFormError("");
    setSaving(true);

    try {
      const payload = {
        ...formData,

        supplier_id: supplierId,
        date,
        status,

        items: lines
          .filter(
            (line) => line.product_id
          )
          .map((line) => ({
            product_id:
              line.product_id,

            quantity:
              Number(line.quantity) || 1,

            rate:
              line.rate,

            gst_rate:
              line.gst_rate,
          })),
      };

      await onSubmit(payload);

    } catch (err) {
      setFormError(
        err.message ||
          "Couldn't save this purchase."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingRefs) {
    return (
      <div className="loading-state">
        Loading suppliers and products…
      </div>
    );
  }

  const productOptions =
    products.map((p) => ({
      value: p.id,
      label: p.name,
    }));

  return (
    <form
      onSubmit={handleSubmit}
      className="form-stack"
    >
      {formError && (
        <div className="error-banner">
          {formError}
        </div>
      )}

      <div className="form-grid-2">

        <div>
          <FieldLabel>
            Supplier
          </FieldLabel>

          <SearchableSelect
            options={suppliers.map(
              (s) => ({
                value: s.id,
                label: s.name,
              })
            )}
            value={supplierId}
            onChange={(val) => {
              setField(
                "supplier_id",
                val
              );

              if (
                fieldErrors.supplier_id
              ) {
                setFieldErrors({
                  ...fieldErrors,
                  supplier_id: null,
                });
              }
            }}
            placeholder="Search suppliers…"
          />

          {fieldErrors.supplier_id && (
            <div className="field-error">
              {
                fieldErrors.supplier_id
              }
            </div>
          )}
        </div>

        <div>
          <FieldLabel>
            Date
          </FieldLabel>

          <input
            type="date"
            className="select"
            value={date}
            onChange={(e) => {
              setField(
                "date",
                e.target.value
              );

              if (
                fieldErrors.date
              ) {
                setFieldErrors({
                  ...fieldErrors,
                  date: null,
                });
              }
            }}
          />

          {fieldErrors.date && (
            <div className="field-error">
              {fieldErrors.date}
            </div>
          )}
        </div>

      </div>

      <div>
        <FieldLabel>
          Status
        </FieldLabel>

        <select
          className="select"
          value={status}
          onChange={(e) =>
            setField(
              "status",
              e.target.value
            )
          }
        >
          {STATUSES.map((s) => (
            <option
              key={s}
              value={s}
            >
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>
          Line Items
        </FieldLabel>

        {fieldErrors.items && (
          <div
            className="field-error"
            style={{
              marginBottom: 8,
            }}
          >
            {fieldErrors.items}
          </div>
        )}

        <div className="invoice-lines">

          {lines.map(
            (line, i) => (

              <div
                className="invoice-line-row"
                key={i}
              >

                <SearchableSelect
                  options={
                    productOptions
                  }
                  value={
                    line.product_id
                  }
                  onChange={(val) =>
                    updateLine(
                      i,
                      "product_id",
                      val
                    )
                  }
                  placeholder="Search products…"
                />

                <input
                  type="number"
                  className="text-input"
                  min="1"
                  value={line.quantity}
                  onChange={(e) =>
                    updateLine(
                      i,
                      "quantity",
                      e.target.value
                    )
                  }
                  title="Quantity"
                />

                <input
                  type="number"
                  step="0.01"
                  className="text-input"
                  value={line.rate}
                  onChange={(e) =>
                    updateLine(
                      i,
                      "rate",
                      e.target.value
                    )
                  }
                  title="Rate"
                />

                <div
                  className="invoice-line-amount"
                  title={`GST ${line.gst_rate}%`}
                >
                  ₹
                  {lineAmount(
                    line
                  ).toFixed(2)}
                </div>

                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() =>
                    removeLine(i)
                  }
                  title="Remove line"
                >
                  <Trash2 size={14} />
                </button>

              </div>

            )
          )}

        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{
            marginTop: 10,
          }}
          onClick={addLine}
        >
          <Plus size={13} />
          Add Line
        </button>
      </div>

      <div className="invoice-totals">

        <div>
          <span>
            Subtotal
          </span>

          <span>
            ₹
            {totalAmount.toFixed(
              2
            )}
          </span>
        </div>

        <div>
          <span>
            GST
          </span>

          <span>
            ₹
            {gstAmount.toFixed(
              2
            )}
          </span>
        </div>

        <div className="invoice-totals-grand">

          <span>
            Grand Total
          </span>

          <span>
            ₹
            {grandTotal.toFixed(
              2
            )}
          </span>

        </div>

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
            : "Create Purchase"}
        </button>

      </div>
    </form>
  );
}