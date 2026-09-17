import PaginatedTable from "../../components/crud/PaginatedList";

export default function InvoicesList() {
  const module = "invoices";

  const columns = [
    { key: "id", label: "ID" },
    { key: "invoice_number", label: "Invoice Number" },
    {
      key: "customer.name",
      label: "Customer",
      render: (item) => item.customer?.name || "N/A",
    },
    {
      key: "customer.gstin",
      label: "Customer GSTIN",
      render: (item) => item.customer?.gstin || "N/A",
    },
    
//     {
//   key: "gst_summary",
//   label: "GST Summary",
//   render: (item) =>
//     item.gst_summary?.length
//       ? item.gst_summary.join(", ")
//       : "—",
// },
    { key: "action", label: "Action" },
  ];

  return (
    <PaginatedTable
      module={module}
      title="Invoices"
      columns={columns}
    />
  );
};