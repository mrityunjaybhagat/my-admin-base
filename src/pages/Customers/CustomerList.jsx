import PaginatedTable from "../../components/crud/PaginatedList";

const CustomerList = () => {
  const module = "customers";

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" ,

       render: (item) => (
    <a
      href={`/${module}/${item.id}`}
      className="customers"
    >
      {item.name}
    </a>
  ),
    },
    { key: "gstin", label: "GSTIN" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    // { key: "address", label: "Address" },
    { key: "action", label: "Action" },
  ];

  return (
    <PaginatedTable
      module={module}
      title="Customers"
      columns={columns}
    />
  );
};

export default CustomerList;