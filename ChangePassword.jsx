import React, { useState } from "react";
import FieldLabel from "../FieldLabel.jsx";
import { changePassword } from "../../api/auth.js";

/**
 * This form is fully built, but /change-password on the backend
 * cannot work correctly until Sanctum is wired up — without a real
 * session, the server has no way to know WHICH user is asking to
 * change their password. Right now this will either fail outright or
 * (worse) need to trust a user_id the frontend sends, which anyone
 * could fake. Don't ship this without Sanctum active.
 */
export default function ChangePassword({ onSuccess, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!currentPassword) errors.currentPassword = "Enter your current password.";
    if (!newPassword || newPassword.length < 6) errors.newPassword = "New password must be at least 6 characters.";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords don't match.";
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setFormError("");
    setSaving(true);
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setSaving(false);
      onSuccess?.();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't change your password.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      {formError && <div className="error-banner">{formError}</div>}

      <div>
        <FieldLabel>Current Password</FieldLabel>
        <input className="text-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        {fieldErrors.currentPassword && <div className="field-error">{fieldErrors.currentPassword}</div>}
      </div>

      <div>
        <FieldLabel>New Password</FieldLabel>
        <input className="text-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        {fieldErrors.newPassword && <div className="field-error">{fieldErrors.newPassword}</div>}
      </div>

      <div>
        <FieldLabel>Confirm New Password</FieldLabel>
        <input className="text-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
      </div>

      <div className="action-row">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Change Password"}</button>
      </div>
    </form>
  );
}