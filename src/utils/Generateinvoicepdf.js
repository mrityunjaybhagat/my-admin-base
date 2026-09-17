import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Builds a PDF for one invoice and returns the jsPDF instance — caller
 * decides what to do with it (save to disk, or get a Blob for sharing).
 * No branding/logo baked in since this business's letterhead details
 * weren't specified — easy to add later (a company name/address block
 * at the top, before the "INVOICE" heading).
 */
export function buildInvoicePdf(invoice) {
  const doc = new jsPDF({ unit: "pt" });
  const marginX = 40;
  let y = 50;

  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("INVOICE", marginX, y);

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Invoice #: ${invoice.invoice_number}`, 420, y - 5);
  doc.text(`Date: ${invoice.date}`, 420, y + 10);
  doc.text(`Status: ${invoice.status}`, 420, y + 25);

  y += 40;
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Bill To", marginX, y);
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  y += 16;
  const c = invoice.customer || {};
  [c.name, c.address, `${c.phone || ""} ${c.email || ""}`.trim(), c.gstin && c.gstin !== "0" ? `GSTIN: ${c.gstin}` : null]
    .filter(Boolean)
    .forEach((line) => { doc.text(String(line), marginX, y); y += 14; });

  y += 10;

  const items = invoice.items || [];
  if (items.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [["Product", "HSN", "Qty", "Rate", "GST %", "Total"]],
      body: items.map((it) => [
        it.product?.name || String(it.product_id),
        it.product?.hsn_code || "",
        String(it.quantity),
        `Rs ${it.rate}`,
        `${it.gst_rate}%`,
        `Rs ${it.total}`,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [184, 71, 47] }, // matches --rust
    });
    y = doc.lastAutoTable.finalY + 20;
  } else {
    doc.setFont(undefined, "italic");
    doc.text("(Line items not available for this invoice)", marginX, y);
    y += 20;
  }

  const totalsX = 380;
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text("Subtotal:", totalsX, y);
  doc.text(`Rs ${invoice.total_amount}`, 520, y, { align: "right" });
  y += 16;
  doc.text("GST:", totalsX, y);
  doc.text(`Rs ${invoice.gst_amount}`, 520, y, { align: "right" });
  y += 16;
  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("Grand Total:", totalsX, y);
  doc.text(`Rs ${invoice.grand_total}`, 520, y, { align: "right" });

  return doc;
}

export function downloadInvoicePdf(invoice) {
  const doc = buildInvoicePdf(invoice);
  doc.save(`Invoice-${invoice.invoice_number}.pdf`);
}