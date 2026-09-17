import React, { useEffect, useState } from "react";
import { getData } from "../../utils/apiAxios";
import SearchableSelect from "../../components/SearchableSelect.jsx";

export default function PaymentReceivedForm({ formData, setFormData }) {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await getData("invoices?offset=0&limit=100");
        setInvoices(response.data || []);
      } catch (error) {
        console.error("Failed to load invoices", error);
      }
    };

    loadInvoices();
  }, []);

  return (
    <>
      <div className="form-group">
        <label>Invoice</label>

        <SearchableSelect
          options={invoices}
          value={formData.invoice_id}
          onChange={(value) =>
            setFormData({
              ...formData,
              invoice_id: value,
            })
          }
          placeholder="Select Invoice"
          getLabel={(item) =>
            `${item.invoice_number} - ${item.customer?.name || ""}`
          }
          getValue={(item) => item.id}
        />
      </div>

      <div className="form-group">
        <label>Amount</label>

        <input
          type="number"
          step="0.01"
          value={formData.amount || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount: e.target.value,
            })
          }
        />
      </div>

      <div className="form-group">
        <label>Payment Mode</label>

        <select
          value={formData.method || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              method: e.target.value,
            })
          }
        >
          <option value="">Select Payment Mode</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>

      <div className="form-group">
        <label>Date</label>

        <input
          type="date"
          value={formData.date || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              date: e.target.value,
            })
          }
        />
      </div>

      <div className="form-group">
        <label>Reference / Note</label>

        <input
          type="text"
          value={formData.reference_note || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              reference_note: e.target.value,
            })
          }
        />
      </div>
    </>
  );
}