import React, { useState } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";

export default function DefaultForm({ formData, setFormData, onSubmit }) {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };    
    const validateForm = () => {
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = "This is required";
      // Set errors state.
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        setSubmitting(true);
        onSubmit(formData);
        setSubmitting(false);
        setErrors({});
      }
    };
  return (
    <>
    <form onSubmit={handleSubmit}>
      Default Form
        <div className="login-field_">
          <div className="field-label">Name</div>
          <div className="login-input-row">
            <input
              type="text"
              className="text-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Product name"
              isInvalid={!!errors.name}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary login-submit">
          Submit
        </button>
      </form>
    </>
  );
}
