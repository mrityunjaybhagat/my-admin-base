import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Truck,
  Banknote,
  Landmark,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import { getData } from "../../api/apiAxios";
import SearchableSelect from "../../components/SearchableSelect.jsx";

export default function LedgersList() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  useEffect(() => {
    Promise.all([
      getData("customers?offset=0&limit=100"),
      getData("suppliers?offset=0&limit=100"),
    ])
      .then(([customerRes, supplierRes]) => {
        setCustomers(customerRes.data || []);
        setSuppliers(supplierRes.data || []);
      })
      .catch((error) => {
        console.error("Failed to load ledger data:", error);
      });
  }, []);

  return (
    <div>
      <h1 className="page-title">Ledgers</h1>

      <p className="page-sub">
        View customer, supplier, cash, bank and company activity ledgers.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
          marginTop: 22,
          alignItems: "start",
        }}
      >
        {/* Customer Ledger */}
        <div
          className="table-card"
          style={{
            padding: 22,
            overflow: "visible",
            position: "relative",
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Users size={20} />

            <div>
              <h3 style={{ margin: 0 }}>Customer Ledger</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View invoices and payments by customer.
              </p>
            </div>
          </div>

          <SearchableSelect
            options={customers}
            value={customerId}
            onChange={(value) => setCustomerId(value)}
            placeholder="Search customer..."
            getLabel={(customer) => customer.name}
            getValue={(customer) => customer.id}
          />

          <button
            className="btn btn-primary"
            style={{ marginTop: 14 }}
            disabled={!customerId}
            onClick={() =>
              navigate(`/admin/ledgers/customers/${customerId}`)
            }
          >
            View Ledger
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Supplier Ledger */}
        <div
          className="table-card"
          style={{
            padding: 22,
            overflow: "visible",
            position: "relative",
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Truck size={20} />

            <div>
              <h3 style={{ margin: 0 }}>Supplier Ledger</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View purchases and payments by supplier.
              </p>
            </div>
          </div>

          <SearchableSelect
            options={suppliers}
            value={supplierId}
            onChange={(value) => setSupplierId(value)}
            placeholder="Search supplier..."
            getLabel={(supplier) => supplier.name}
            getValue={(supplier) => supplier.id}
          />

          <button
            className="btn btn-primary"
            style={{ marginTop: 14 }}
            disabled={!supplierId}
            onClick={() =>
              navigate(`/admin/ledgers/suppliers/${supplierId}`)
            }
          >
            View Ledger
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Cash Ledger */}
        <div
          className="table-card"
          style={{
            padding: 22,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Banknote size={20} />

            <div>
              <h3 style={{ margin: 0 }}>Cash Ledger</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                Track all cash inflow and outflow.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/ledgers/cash")}
          >
            View Cash Ledger
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Bank Ledger */}
        <div
          className="table-card"
          style={{
            padding: 22,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Landmark size={20} />

            <div>
              <h3 style={{ margin: 0 }}>Bank Ledger</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                Track all non-cash bank transactions.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/ledgers/bank")}
          >
            View Bank Ledger
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Company Activity Ledger */}
        <div
          className="table-card"
          style={{
            padding: 22,
            gridColumn: "1 / -1",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <BookOpen size={20} />

            <div>
              <h3 style={{ margin: 0 }}>
                Company Activity Ledger
              </h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View invoices, purchases, payments, expenses and
                vouchers in one place.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/admin/ledgers/company")
            }
          >
            View Company Activity
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}