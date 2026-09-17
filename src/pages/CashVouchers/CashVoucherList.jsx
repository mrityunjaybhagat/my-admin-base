import PaginatedTable from "../../components/crud/PaginatedList";

export default function CashVoucherList() {
  const columns = [
    {
      key: "voucher_number",
      label: "Voucher #",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "party_name",
      label: "Party",
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
      module="cash-vouchers"
      title="Cash Vouchers"
      columns={columns}
    />
  );
}