import PaginatedTable from "../../components/crud/PaginatedList";

export default function ExpenseList() {
  const columns = [
    {
      key: "date",
      label: "Date",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "vendor_name",
      label: "Vendor",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "payment_mode",
      label: "Payment Mode",
    },
    {
      key: "amount",
      label: "Amount",
      render: (item) => `₹${Number(item.amount || 0).toFixed(2)}`,
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  return (
    <PaginatedTable
      module="expenses"
      title="Expenses"
      columns={columns}
    />
  );
}