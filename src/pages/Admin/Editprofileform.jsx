import React, { useState } from "react";
import FieldLabel from "../../components/forms/FieldLabel.jsx";
import { updateData } from "../../api/apiAxios.js";

/**
 * Reuses the existing users.js/UserController update endpoint — no new
 * backend route needed. Relies on `user.id` from the login response
 * (App.jsx already stores this). Fine for editing your own name/email,
 * which isn't security-sensitive the way a password change is; that's
 * still the one gated behind Sanctum, not this.
 */
export default function EditProfileForm({ user, onSuccess, onCancel }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setFormError("");
    setSaving(true);
    try {
      const updated = await updateData(user.id, { name, email });
      setSaving(false);
      onSuccess?.(updated);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const mapped = {};
        Object.entries(apiErrors).forEach(([field, messages]) => { mapped[field] = messages[0]; });
        setFieldErrors(mapped);
      } else {
        setFormError(err.response?.data?.message || "Couldn't update your profile.");
      }
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      {formError && <div className="error-banner">{formError}</div>}

      <div>
        <FieldLabel>Name</FieldLabel>
        <input className="text-input" value={name} onChange={(e) => setName(e.target.value)} />
        {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
      </div>

      <div>
        <FieldLabel>Email</FieldLabel>
        <input className="text-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
      </div>

      <div className="action-row">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
      </div>
    </form>
  );
}