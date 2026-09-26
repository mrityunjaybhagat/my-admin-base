import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  PackageSearch,
  FileText,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

export default function GstReturns() {
  const navigate = useNavigate();

  const now = new Date();

  const [month, setMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  const [filterType, setFilterType] = useState("month");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const getQueryString = () => {
    if (filterType === "date" && dateFrom && dateTo) {
      return `?from=${dateFrom}&to=${dateTo}`;
    }

    return `?month=${month}`;
  };

  const openReport = (path) => {
    navigate(`${path}${getQueryString()}`);
  };

  return (
    <div>
      <h1 className="page-title">GST Returns</h1>

      <p className="page-sub">
        View GSTR-1/IFF B2B, B2C, HSN-wise outward supplies and documents
        issued.
      </p>

      {/* FILTER */}
      <div
        className="table-card"
        style={{
          padding: 22,
          marginTop: 22,
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
          <CalendarDays size={20} />

          <div>
            <h3 style={{ margin: 0 }}>Return Period</h3>

            <p
              className="page-sub"
              style={{
                margin: "4px 0 0",
              }}
            >
              Select a month or custom date range for GST reports.
            </p>
          </div>
        </div>

        {/* FILTER TYPE */}
        <div
          style={{
            display: "flex",
            gap: 18,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="filterType"
              value="month"
              checked={filterType === "month"}
              onChange={() => setFilterType("month")}
            />

            Month
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="filterType"
              value="date"
              checked={filterType === "date"}
              onChange={() => setFilterType("date")}
            />

            Custom Date Range
          </label>
        </div>

        {/* MONTH FILTER */}
        {filterType === "month" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxWidth: 260,
            }}
          >
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Month
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="form-control"
            />
          </div>
        )}

        {/* DATE RANGE */}
        {filterType === "date" && (
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                From
              </label>

              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="form-control"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                To
              </label>

              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        )}
      </div>

      {/* REPORT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
          marginTop: 22,
          alignItems: "start",
        }}
      >
        {/* B2B */}
        <div className="table-card" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <Building2 size={20} />

            <div>
              <h3 style={{ margin: 0 }}>GSTR-1/IFF — B2B</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View taxable outward supplies made to registered persons.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              openReport("/admin/reports/gst-returns/b2b")
            }
          >
            View B2B
            <ArrowRight size={15} />
          </button>
        </div>

        {/* B2C */}
        <div className="table-card" style={{ padding: 22 }}>
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
              <h3 style={{ margin: 0 }}>GSTR-1/IFF — B2C</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View taxable outward supplies made to unregistered persons.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              openReport("/admin/reports/gst-returns/b2c")
            }
          >
            View B2C
            <ArrowRight size={15} />
          </button>
        </div>

        {/* HSN */}
        <div className="table-card" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <PackageSearch size={20} />

            <div>
              <h3 style={{ margin: 0 }}>
                HSN-wise Summary of Outward Supplies
              </h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View HSN-wise summary of B2B and B2C outward supplies.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              openReport("/admin/reports/gst-returns/hsn-summary")
            }
          >
            View HSN Summary
            <ArrowRight size={15} />
          </button>
        </div>

        {/* DOCUMENTS ISSUED */}
        <div className="table-card" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <FileText size={20} />

            <div>
              <h3 style={{ margin: 0 }}>Documents Issued</h3>

              <p
                className="page-sub"
                style={{ margin: "4px 0 0" }}
              >
                View invoice and document series issued during the selected
                return period.
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              openReport("/admin/reports/gst-returns/documents-issued")
            }
          >
            View Documents
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}