import React, { useEffect, useState } from "react";
import { AlertTriangle, History, Plus } from "lucide-react";

import { getData, postData } from "../../api/apiAxios";
import SearchableSelect from "../../components/SearchableSelect.jsx";
import FieldLabel from "../../components/forms/FieldLabel.jsx";
import CrudModal from "../../components/crud/CrudModal.jsx";

const TYPE_LABEL = {
  purchase: "Purchase",
  sale: "Sale",
  adjustment: "Adjustment",
  return_in: "Return In",
  return_out: "Return Out",
};

export default function StockList() {
  const [stock, setStock] = useState([]);
  const [movements, setMovements] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingMovements, setLoadingMovements] = useState(false);

  const [showAdjustment, setShowAdjustment] = useState(false);

  const [adjustment, setAdjustment] = useState({
    product_id: "",
    quantity_change: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  const loadStock = async () => {
    try {
      const response = await getData("stock?limit=100");

      setStock(response.data || []);
    } catch (error) {
      console.error("Failed to load stock:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const loadMovements = async (product) => {
    setSelectedProduct(product);
    setLoadingMovements(true);

    try {
      const response = await getData(
        `stock/${product.id}/movements`
      );

      setMovements(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load stock movements:",
        error
      );

      setMovements([]);
    } finally {
      setLoadingMovements(false);
    }
  };

  const handleAdjustment = async (e) => {
    e.preventDefault();

    if (
      !adjustment.product_id ||
      !adjustment.quantity_change
    ) {
      return;
    }

    setSaving(true);

    try {
      await postData("stock/adjustments", {
        product_id: Number(
          adjustment.product_id
        ),
        quantity_change: Number(
          adjustment.quantity_change
        ),
        notes: adjustment.notes || null,
      });

      setAdjustment({
        product_id: "",
        quantity_change: "",
        notes: "",
      });

      setShowAdjustment(false);

      await loadStock();

      if (
        selectedProduct &&
        Number(selectedProduct.id) ===
          Number(adjustment.product_id)
      ) {
        await loadMovements(selectedProduct);
      }
    } catch (error) {
      console.error(
        "Failed to save stock adjustment:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading stock…
      </div>
    );
  }

  const productOptions = stock.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <div>
      <div className="page-head-row">
        <div>
          <h1 className="page-title">
            Stock
          </h1>

          <p className="page-sub">
            Current stock levels and movement
            history.
          </p>
        </div>

        {/* <button
          className="btn btn-primary"
          onClick={() =>
            setShowAdjustment((prev) => !prev)
          }
        >
          <Plus size={14} />
          Stock Adjustment
        </button> */}
        <CrudModal module="stock-adjustments" action="add" />
        <CrudModal
  module="stock-adjustments"
  action="add"
  onSuccess={loadStock}
/>
      </div>

      {showAdjustment && (
        <form
          className="form-stack"
          onSubmit={handleAdjustment}
          style={{ marginBottom: 30 }}
        >
          <div className="form-grid-2">
            <div>
              <FieldLabel>
                Product
              </FieldLabel>

              <SearchableSelect
                options={productOptions}
                value={
                  adjustment.product_id
                }
                onChange={(value) =>
                  setAdjustment((prev) => ({
                    ...prev,
                    product_id: value,
                  }))
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
                  adjustment.quantity_change
                }
                onChange={(e) =>
                  setAdjustment((prev) => ({
                    ...prev,
                    quantity_change:
                      e.target.value,
                  }))
                }
                placeholder="+10 or -5"
              />
            </div>
          </div>

          <div>
            <FieldLabel>
              Notes
            </FieldLabel>

            <input
              type="text"
              className="text-input"
              value={adjustment.notes}
              onChange={(e) =>
                setAdjustment((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Reason for adjustment"
            />
          </div>

          <div className="action-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setShowAdjustment(false)
              }
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
      )}

      <div className="section-label">
        Current Levels
      </div>

      <div
        className="table-card"
        style={{ marginBottom: 30 }}
      >
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>HSN</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Movement</th>
            </tr>
          </thead>

          <tbody>
            {stock.map((product) => {
              const low =
                Number(product.current_stock) <=
                Number(product.reorder_level);

              return (
                <tr key={product.id}>
                  <td>{product.name}</td>

                  <td>
                    {product.hsn_code || "—"}
                  </td>

                  <td>
                    {product.current_stock}
                  </td>

                  <td>
                    {product.reorder_level}
                  </td>

                  <td>
                    {low ? (
                      <span className="status-pill unpaid">
                        <AlertTriangle
                          size={11}
                        />
                        Reorder
                      </span>
                    ) : (
                      <span className="status-pill paid">
                        In Stock
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="icon-btn"
                      title="View movements"
                      onClick={() =>
                        loadMovements(product)
                      }
                    >
                      <History size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <>
          <div className="section-label">
            {selectedProduct.name} — Stock
            Movements
          </div>

          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Change</th>
                  <th>Balance After</th>
                  <th>Reference</th>
                  <th>Notes</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {loadingMovements ? (
                  <tr>
                    <td colSpan="6">
                      Loading movements…
                    </td>
                  </tr>
                ) : movements.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      No stock movements found.
                    </td>
                  </tr>
                ) : (
                  movements.map((movement) => (
                    <tr key={movement.id}>
                      <td>
                        {TYPE_LABEL[
                          movement.type
                        ] || movement.type}
                      </td>

                      <td
                        style={{
                          color:
                            Number(
                              movement.quantity_change
                            ) < 0
                              ? "var(--rust-dark)"
                              : "var(--green)",
                        }}
                      >
                        {Number(
                          movement.quantity_change
                        ) > 0
                          ? "+"
                          : ""}

                        {
                          movement.quantity_change
                        }
                      </td>

                      <td>
                        {
                          movement.balance_after
                        }
                      </td>

                      <td>
                        {movement.reference_type
                          ? `${movement.reference_type} #${movement.reference_id}`
                          : "—"}
                      </td>

                      <td>
                        {movement.notes ||
                          movement.note ||
                          "—"}
                      </td>

                      <td>
                        {(
                          movement.created_at ||
                          ""
                        ).slice(0, 10)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}