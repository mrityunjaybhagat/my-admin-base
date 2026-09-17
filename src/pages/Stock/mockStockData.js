// UI-only prototype — no backend exists for this yet (see
// stock_migration.php for the proposed schema this mock data mirrors).
// Once /rest-api/stock-movements and a current_stock field on products
// are real, swap this file's exports for real fetch() calls — the shape
// is designed to match exactly, so nothing else needs to change.

export const MOCK_STOCK_SUMMARY = [
  { product_id: 17, product_name: "MamyPoko Pants Standard S1", current_stock: 480, reorder_level: 480 },
  { product_id: 201, product_name: "Mamypoko Pants Extra Absorb S4", current_stock: 35, reorder_level: 45 },
  { product_id: 19, product_name: "MamyPoko Pants Standard M4", current_stock: 230, reorder_level: 240 },
  { product_id: 155, product_name: "Mamy Poko Wipes Komal Care", current_stock: 12, reorder_level: 24 },
  { product_id: 184, product_name: "SOFY BODYFIT NIGHTSXXL 6P", current_stock: 48, reorder_level: 48 },
];

export const MOCK_STOCK_MOVEMENTS = [
  { id: 501, product_id: 17, product_name: "MamyPoko Pants Standard S1", type: "purchase", quantity_change: 240, balance_after: 480, reference_type: "purchase", reference_id: 88, created_at: "2026-08-21T07:32:18.000000Z" },
  { id: 500, product_id: 155, product_name: "Mamy Poko Wipes Komal Care", type: "sale", quantity_change: -24, balance_after: 12, reference_type: "invoice", reference_id: 432, created_at: "2026-08-20T11:28:25.000000Z" },
  { id: 499, product_id: 201, product_name: "Mamypoko Pants Extra Absorb S4", type: "sale", quantity_change: -10, balance_after: 35, reference_type: "invoice", reference_id: 431, created_at: "2026-08-19T09:12:00.000000Z" },
  { id: 498, product_id: 184, product_name: "SOFY BODYFIT NIGHTSXXL 6P", type: "adjustment", quantity_change: 6, balance_after: 48, reference_type: null, reference_id: null, note: "Stock count correction", created_at: "2026-08-18T15:40:00.000000Z" },
];
