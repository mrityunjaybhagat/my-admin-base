export default function FilterForm() {  
    return (
        <>
        <div className="filter-row">
        <div className="search-box" style={{ marginBottom: 0 }}>
          <Search size={14} color="var(--muted)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts…" />
        </div>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {POST_STATUSES.map((s) => <option key={s} value={s}>{s === "published" ? "Published" : "Draft"}</option>)}
        </select>
        <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="date-filter">
          <label className="date-filter-label">From</label>
          <input type="date" className="select" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} max={dateTo || undefined} />
        </div>
        <div className="date-filter">
          <label className="date-filter-label">To</label>
          <input type="date" className="select" value={dateTo} onChange={(e) => setDateTo(e.target.value)} min={dateFrom || undefined} />
        </div>
        {hasActiveFilters && (
          <button className="btn btn-secondary btn-sm" onClick={clearFilters}><X size={13} /> Clear</button>
        )}
      </div>
        </>
    )
}