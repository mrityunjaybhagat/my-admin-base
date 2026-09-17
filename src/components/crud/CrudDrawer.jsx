import React, { useEffect, useState } from "react";
import { Eye, Plus, Pencil } from "lucide-react";

import FormDrawer from "../common/FormDrawer";
import { getFormComponent } from "../formMap";

import {
  getData,
  postData,
  updateData,
} from "../../api/apiAxios";
import InvoiceView from "../../pages/Invoices/InvoiceView";

export default function CrudDrawer({
  id,
  module,
  action,
  onSuccess,
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  // Decide form from common formMap
  const FormComponent = getFormComponent(module);

  // -----------------------------------------
  // LOAD DATA FOR EDIT / VIEW
  // -----------------------------------------

  useEffect(() => {
    if (!open) return;

    // ADD
    if (!id) {
      setFormData({ name: "" });
      return;
    }

    // EDIT / VIEW
    const fetchRecord = async () => {
      try {
        const response = await getData(`${module}/${id}`);

        setFormData(response.data ?? response);
      } catch (error) {
        console.error("Failed to fetch record:", error);
      }
    };

    fetchRecord();
  }, [open, id, module]);

  // -----------------------------------------
  // ADD + EDIT
  // -----------------------------------------

  const handleSubmit = async (data) => {
    try {
      if (data.id) {
        await updateData(
          `${module}/${data.id}`,
          data
        );
      } else {
        await postData(
          module,
          data
        );
      }

      setOpen(false);
      setFormData({ name: "" });

      // Refresh pagination/list after save
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  // -----------------------------------------
  // BUTTON
  // -----------------------------------------

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
  };

  const config = actionConfig[action];

  if (!config) {
    return null;
  }

  // -----------------------------------------
  // TITLE
  // -----------------------------------------

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
      {/* BUTTON */}

      <button
        type="button"
        className={config.className}
        onClick={() => setOpen(true)}
      >
        {config.icon}

        {config.label && (
          <span>{config.label}</span>
        )}
      </button>


      {/* RIGHT DRAWER */}

      <FormDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        width={module === "invoices" ? 900 : 440}
      >
{action === "view" ? (
  < InvoiceView
    id={id}
    onClose={() => setOpen(false)}
  />
) : (
  <FormComponent
          module={module}
          id={id}
          action={action}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
)}
        
      </FormDrawer>
    </>
  );
}