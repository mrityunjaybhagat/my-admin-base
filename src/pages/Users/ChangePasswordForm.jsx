import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FieldLabel from "../../components/forms/FieldLabel.jsx";

export default function ChangePasswordForm({
  user,
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Separate visibility for both fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    setFormError("");
  };

  const validate = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = "New password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (!formData.password_confirmation) {
      errors.password_confirmation = "Please confirm the new password.";
    } else if (
      formData.password !== formData.password_confirmation
    ) {
      errors.password_confirmation = "Passwords do not match.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();

    // Stop submission if validation fails
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setFormError("");
    setSaving(true);

    try {
      await onSubmit({
        user_id: user?.id,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
        err?.message ||
        "Couldn't change password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-stack">

      {formError && (
        <div className="error-banner">
          {formError}
        </div>
      )}

      {user && (
        <h3 className="confirm-title">
            {user.name || user.email || ""}
          {/* <input
            className="text-input"
            value={user.name || user.email || ""}
            disabled
          /> */}
        </h3>
      )}

      {/* New Password */}
      <div>
        <FieldLabel>New Password</FieldLabel>

        <div style={{ position: "relative" }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className="text-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            autoComplete="new-password"
            style={{ paddingRight: "42px" }}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? "Hide password" : "Show password"}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {fieldErrors.password && (
          <div className="field-error">
            {fieldErrors.password}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <FieldLabel>Confirm Password</FieldLabel>

        <div style={{ position: "relative" }}>
          <input
            name="password_confirmation"
            type={showConfirmPassword ? "text" : "password"}
            className="text-input"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm new password"
            autoComplete="new-password"
            style={{ paddingRight: "42px" }}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            title={
              showConfirmPassword
                ? "Hide password"
                : "Show password"
            }
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {fieldErrors.password_confirmation && (
          <div className="field-error">
            {fieldErrors.password_confirmation}
          </div>
        )}
      </div>

      <div className="action-row">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? "Changing…" : "Change Password"}
        </button>
      </div>

    </form>
  );
}