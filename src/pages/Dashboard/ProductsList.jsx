import PaginatedTable from "../../components/crud/PaginatedList";

const ProductsList = () => {
  const module = "products";

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "hsn_code", label: "HSN Code" },
    { key: "gst_rate", label: "Gst %" },
    { key: "mrp", label: "Price" },
    //{ key: "rate", label: "Rate" },
    { key: "reorder_level", label: "Reorder Level" },
    { key: "action", label: "Action" },
  ];

  return (
    <PaginatedTable
      module={module}
      title="Products"
      columns={columns}
    />
  );
};

export default ProductsList;