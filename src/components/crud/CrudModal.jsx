import React, { useEffect, useState } from "react";
import { Eye, Plus, Pencil, Trash2 } from "lucide-react";

import { getFormComponent } from "../formMap";
//import DefaultForm from "../forms/DefaultForm";
//import ProductsForm from "../forms/ProductsForm";
//import CustomerForm from "../forms/CustomerForm";

//import CustomerForm from "../../pages/Customers/CustomerForm";


import {
  getData,
  postData,
  updateData,
  deleteData,
} from "../../api/apiAxios";

export default function CrudModal({ id, module, action }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  const endpoint =
  module === "stock-adjustments"
    ? "stock/adjustments"
    : module;

  //const FormComponent = componentMap[module] || DefaultForm;
  const FormComponent = getFormComponent(module);

  // Load existing record for Edit / View
  useEffect(() => {
    if (!show || !id) return;

    const fetchRecord = async () => {
      try {
        const response = await getData(`${module}/${id}`);

        // Supports both:
        // { data: {...} }
        // and direct {...}
        setFormData(response.data ?? response);
      } catch (error) {
        console.error("Failed to fetch record:", error);
      }
    };

    fetchRecord();
  }, [show, id, module]);

  // Reset form for Add
  const handleOpen = () => {
    if (action === "add") {
      setFormData({ name: "" });
    }

    setShow(true);
  };

  // Same function for Add + Edit
  const handleSubmit = async (data) => {
    try {
      if (data.id) {
        await updateData(`${module}/${data.id}`, data);
      } else {
        await postData(module, data);
      }

      setShow(false);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      await deleteData(`${module}/${id}`);
      setShow(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const actionConfig = {
    add: {
      className: "btn btn-primary",
      icon: <Plus size={15} />,
      label: `Add ${module}`,
    },

    view: {
      className: "icon-btn success",
      icon: <Eye size={15} />,
      label: "",
    },

    edit: {
      className: "icon-btn warning",
      icon: <Pencil size={15} />,
      label: "",
    },
    delete: {
      className: "icon-btn danger",
      icon: <Trash2 size={15} />,
      label: "",
    },
  };

  const config = actionConfig[action];

  // Prevent crash if wrong action is passed
  if (!config) {
    console.error(`Invalid CrudModule action: ${action}`);
    return null;
  }

  const title =
    action === "add"
      ? `Add ${module}`
      : action === "edit"
      ? `Edit ${module}`
      : action === "view"
      ? `View ${module}`
      : `Delete ${module}`;

  return (
    <>
      {/* Action Button */}
      <button
        type="button"
        className={config.className}
        onClick={handleOpen}
      >
        {config.icon}
        {config.label && <span>{config.label}</span>}
      </button>

      {/* Popup */}
      {show && (
        <div className="confirm-overlay" onClick={() => setShow(false)}>
          <div className={`confirm-box ${module === "invoices" ? "invoice_modal" : ""}`} onClick={(e) => e.stopPropagation()} >
            <div className="confirm-title">
              {title}
            </div>

            <div className="confirm-message">

              {action === "delete" ? (
                <p>
                  Are you sure you want to delete this record?
                </p>
              ) : (
                <FormComponent
                  module={module}
                  id={id}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  onClose={() => setShow(false)}
                />
              )}

            </div>
            
            {action === "delete" && (
              <div className="confirm-actions">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
