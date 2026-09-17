import React, { useState, useEffect, useCallback } from "react";
import { getFormComponent } from "../../components/formMap";

import { Search, X, List, LayoutGrid } from "lucide-react";

import FilterForm from "../forms/FilterFrom";
import CrudModal from "./CrudModal";

import { getData } from "../../api/apiAxios";
import FormDrawer from "../common/FormDrawer";
import CrudDrawer from "./CrudDrawer";


const LIMIT = 15;

function PaginatedTable({ module, columns, title }) {
  // --------------------------------------------------
  // DATA
  // --------------------------------------------------
  const [viewMode, setViewMode] = useState("list");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  


  // Pagination
  const [offset, setOffset] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const FormComponent = getFormComponent(module);
  // --------------------------------------------------
  // DISPLAY NAME
  // customers → Customers
  // plans     → Plans
  // --------------------------------------------------

  const displayTitle =
    title || module.charAt(0).toUpperCase() + module.slice(1);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      params.set("offset", offset);
      params.set("limit", LIMIT);

      if (search) {
        params.set("search", search);
      }

      if (dateFrom) {
        params.set("from", dateFrom);
      }

      if (dateTo) {
        params.set("to", dateTo);
      }

      // Example:
      //
      // customers?offset=0&limit=15
      //
      // plans?offset=0&limit=15
      //
      // categories?offset=0&limit=15

      const response = await getData(`${module}?${params.toString()}`);

      // Expected API response:
      //
      // {
      //    data: [...],
      //    total: 100
      // }

      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error(`Failed to load ${module}:`, error);

      setError(`Couldn't load ${displayTitle}.`);
    } finally {
      setLoading(false);
    }
  }, [module, offset, search, dateFrom, dateTo, displayTitle]);

  // --------------------------------------------------
  // LOAD WHEN SOMETHING CHANGES
  // --------------------------------------------------

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --------------------------------------------------
  // RESET TO PAGE 1 WHEN FILTER CHANGES
  // --------------------------------------------------

  useEffect(() => {
    setOffset(0);
  }, [search, dateFrom, dateTo]);

  // --------------------------------------------------
  // FILTER HELPERS
  // --------------------------------------------------

  const hasActiveFilters = search || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
  };

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const currentPage = Math.floor(offset / LIMIT) + 1;

  const lastPage = Math.max(1, Math.ceil(total / LIMIT));

  const hasPrev = offset > 0;

  const hasNext = offset + LIMIT < total;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div>
      {/* ---------------------------------------------
          PAGE HEADER
      --------------------------------------------- */}

      <div className="page-head-row">
        <div>
          <h1 className="page-title">{displayTitle}</h1>

          <p className="page-sub">Manage {displayTitle.toLowerCase()}.</p>
        </div>
        <div className="row-actions">
          {/* <button
            type="button"
            className={`icon-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List View"
          >
            <List size={17} />
          </button>

          <button
            type="button"
            className={`icon-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => setViewMode("card")}
            title="Card View"
          >
            <LayoutGrid size={17} />
          </button> */}
<button
  type="button"
  className="icon-btn"
  onClick={() =>
    setViewMode(viewMode === "list" ? "card" : "list")
  }
  title={viewMode === "list" ? "Card View" : "List View"}
>
  {viewMode === "list" ? (
    <LayoutGrid size={20} />
  ) : (
    <List size={20} />
  )}
</button>

<CrudModal module={module} action="add" />
<CrudDrawer module={module} action="add" />
        </div>
      </div>

      {/* ---------------------------------------------
          FILTERS
      --------------------------------------------- */}

      <div className="filter-row">
        {/* SEARCH */}

        <div className="search-box" style={{ marginBottom: 0 }}>
          <Search size={14} color="var(--muted)" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${displayTitle.toLowerCase()}…`}
          />
        </div>

        {/* FROM DATE */}

        <div className="date-filter">
          <label className="date-filter-label">From</label>

          <input
            type="date"
            className="select"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            max={dateTo || undefined}
          />
        </div>

        {/* TO DATE */}

        <div className="date-filter">
          <label className="date-filter-label">To</label>

          <input
            type="date"
            className="select"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom || undefined}
          />
        </div>

        {/* CLEAR FILTER */}

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={clearFilters}
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      {/* ---------------------------------------------
          ERROR
      --------------------------------------------- */}

      {error && <div className="error-banner">{error}</div>}

      {/* ---------------------------------------------
          TABLE
      --------------------------------------------- */}
      {viewMode === "list" ? <><div className="table-card">
        {/* LOADING */}

        {loading && (
          <div className="loading-state">
            Loading {displayTitle.toLowerCase()}…
          </div>
        )}

        {/* EMPTY */}

        {!loading && !error && data.length === 0 && (
          <div className="empty-state">
            {hasActiveFilters
              ? `No ${displayTitle.toLowerCase()} match these filters.`
              : `No ${displayTitle.toLowerCase()} yet.`}
          </div>
        )}

        {/* DATA */}

        {!loading && data.length > 0 && (
          <table className="data-table">
            {/* TABLE HEADER */}

            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            {/* TABLE BODY */}
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {/* ACTION COLUMN */}
                      {column.key === "action" ? (
                        <div className="row-actions">
                          {/* <CrudModal
                            module={module}
                            id={row.id}
                            action="view"
                          /> */}
                          <CrudDrawer
                            module={module}
                            id={row.id}
                            action="view"
                          />
                          {/* <CrudModal
                            module={module}
                            id={row.id}
                            action="edit"
                          /> */}
                          <CrudDrawer
                            module={module}
                            id={row.id}
                            action="edit"
                          />
                          <CrudModal
                            module={module}
                            id={row.id}
                            action="delete"
                          />
                        </div>
                      ) : column.render ? (
                        column.render(row)
                      ) : (
                        row[column.key] ?? "—"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></> 
      : <>
{/* ---------------------------------------------
    DATA LIST
--------------------------------------------- */}

<div className="list-card">

  {loading && (
    <div className="loading-state">
      Loading {displayTitle.toLowerCase()}…
    </div>
  )}


  {!loading &&
    !error &&
    data.length === 0 && (

      <div className="empty-state">

        {hasActiveFilters
          ? `No ${displayTitle.toLowerCase()} match these filters.`
          : `No ${displayTitle.toLowerCase()} yet.`}

      </div>

    )}


  {!loading &&
    data.length > 0 &&
    data.map((row) => {

      // Main field
      const primaryColumn =
        columns.find((column) => column.primary) ||
        columns.find(
          (column) =>
            column.key !== "id" &&
            column.key !== "action"
        );

      // Everything except main field + action
      const metaColumns = columns.filter(
        (column) =>
          column.key !== primaryColumn?.key &&
         column.key !== "id" &&
          column.key !== "action"
      );

      return (

        <div
          className="list-row"
          key={row.id}
        >

          {/* ID / THUMB AREA */}

          <div className="list-thumb">

            {row.id}

          </div>


          {/* MAIN CONTENT */}

          <div className="list-body">

            <div className="list-title">

              {primaryColumn?.render
                ? primaryColumn.render(row)
                : row[primaryColumn?.key] ?? "—"}

            </div>
            <div className="list-meta">
              {metaColumns.map((column) => {
                const value = column.render
                  ? column.render(row)
                  : row[column.key];

                if (
                  value === null ||
                  value === undefined ||
                  value === ""
                ) {
                  return null;
                }

                return (

                  <span
                    className="list-meta-item"
                    key={column.key}
                  >

                    <span className="list-meta-label">
                      {column.value}
                    </span>
                    {" "}

                    {value}

                  </span>

                );

              })} 

            </div>

          </div>


          {/* ACTIONS */}

          <div className="row-actions">

            <CrudModal
              module={module}
              id={row.id}
              action="view"
            />

            <CrudModal
              module={module}
              id={row.id}
              action="edit"
            />

            <CrudModal
              module={module}
              id={row.id}
              action="delete"
            />

          </div>

        </div>

      );

    })}

</div>
</>}
      

      {/* ---------------------------------------------
          PAGINATION
      --------------------------------------------- */}

      {!loading && (
        <div className="pagination-row">
          {/* PREVIOUS */}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={!hasPrev}
            onClick={() => setOffset((current) => Math.max(0, current - LIMIT))}
          >
            Previous
          </button>

          {/* PAGE INFORMATION */}

          <span className="page-info">
            Page {currentPage} of {lastPage}
            {" · "}
            {total} {displayTitle.toLowerCase()}
          </span>

          {/* NEXT */}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={!hasNext}
            onClick={() => setOffset((current) => current + LIMIT)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PaginatedTable;
