import { KeyRound } from "lucide-react";
import PaginatedTable from "../../components/crud/PaginatedList";
import { useState } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import { updateData } from "../../api/apiAxios";

const UserList = () => {
  const module = "users";
  const [passwordUser, setPasswordUser] = useState(null);
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" ,

       render: (item) => (
    <a
      href={`/${module}/${item.id}`}
      className="users"
    >
      {item.name}
    </a>
  ),
    },
    //{ key: "gstin", label: "GSTIN" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    //{ key: "address", label: "Address" },
    
  
    {
  key: "cp",
  label: "CP",
  render: (row) => (
      <button
        className="btn btn-primary"
        onClick={() => handleChangePassword(row)}
      >
            <KeyRound size={13} />
      </button>
  ),
},
{ key: "action", label: "Action" },
  ];

const handleChangePassword = (row) => {
  setPasswordUser(row);
};
const handlePasswordSubmit = async (data) => {
  try {
    await updateData(
      `users/${passwordUser.id}/password`,
      data
    );
    setPasswordUser(null);
  } catch (error) {
    throw error;
  }
};

  return (
    <>
    <PaginatedTable
      module={module}
      title="Users"
      columns={columns}
    />
    {passwordUser && (
      <div className="confirm-overlay" onClick={() => setShow(false)}>
          <div className={`confirm-box`} onClick={(e) => e.stopPropagation()} >
            <div className="confirm-title">
                Change Password 
                {/* For {passwordUser?.name} */}
            </div>
            <div className="confirm-message">
              <ChangePasswordForm
                user={passwordUser}
                onClose={() => setPasswordUser(null)}
                onSubmit={handlePasswordSubmit}
              />
            </div>
          </div>
       </div>
  )}
    </>
  );
};

export default UserList;