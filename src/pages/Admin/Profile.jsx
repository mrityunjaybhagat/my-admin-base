import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  Mail,
  Phone,
  BadgeCheck,
  Camera,
} from "lucide-react";

import EditProfileForm from "./Editprofileform.jsx";
import ChangePasswordForm from "../Users/ChangePasswordForm.jsx";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("profile")) || {};
    } catch {
      return {};
    }
  });

  // Photo is frontend-only for now.
  // Later we will send this File object to Laravel.
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");

  const handleProfileUpdated = (updated) => {
    const updatedUser = updated?.user || updated;

    const merged = {
      ...user,
      ...updatedUser,
    };

    setUser(merged);
    localStorage.setItem("profile", JSON.stringify(merged));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoError("");

    // Only JPG, PNG and WEBP
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setPhotoError("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    // Maximum 2MB
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Photo must be smaller than 2MB.");
      e.target.value = "";
      return;
    }

    // Remove previous temporary preview
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setPhoto(file);
    setPhotoPreview(previewUrl);
  };

  // Clean browser memory when page closes
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const initial = (user?.name || user?.email || "?")
    .charAt(0)
    .toUpperCase();

  const userType =
    user?.user_type?.name ||
    user?.userType?.name ||
    user?.user_type ||
    "User";

  const isActive =
    user?.is_active === true ||
    user?.is_active === 1 ||
    user?.is_active === "1";

  return (
    <div className="profile-page">

      {/* =========================
          PROFILE HEADER
      ========================== */}
      <div className="profile-card profile-header-card">

        <div>
        <div className="profile-avatar-wrapper">
  {photoPreview ? (
    <img
      src={photoPreview}
      alt="Profile preview"
      className="profile-avatar-image"
    />
  ) : user?.photo ? (
    <img
      src={user.photo}
      alt={user?.name || "Profile"}
      className="profile-avatar-image"
    />
  ) : (
    <div className="profile-avatar-large">
      {initial}
    </div>
  )}

  <label
    className="profile-camera-button"
    title="Change photo"
  >
    <Camera size={15} />

    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handlePhotoChange}
      hidden
    />
  </label>
</div>

          {photoError && (
            <div
              className="field-error"
              style={{
                marginTop: "8px",
                maxWidth: "180px",
              }}
            >
              {photoError}
            </div>
          )}
        </div>


        <div className="profile-header-info">

          <h1>
            {user?.name || "User"}
          </h1>

          <div className="profile-header-email">
            {user?.email || ""}
          </div>

          <div className="profile-badges">

            <span className="profile-badge profile-role-badge">
              <Shield size={13} />
              {userType}
            </span>

            <span
              className={`profile-badge ${
                isActive
                  ? "profile-active-badge"
                  : "profile-inactive-badge"
              }`}
            >
              <BadgeCheck size={13} />
              {isActive ? "Active" : "Inactive"}
            </span>

          </div>

        </div>

      </div>


      {/* =========================
          TABS
      ========================== */}
      <div className="profile-tabs">

        <button
          type="button"
          className={`profile-tab ${
            activeTab === "profile" ? "active" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={17} />
          Profile
        </button>

        <button
          type="button"
          className={`profile-tab ${
            activeTab === "security" ? "active" : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          <Shield size={17} />
          Security
        </button>

      </div>


      {/* =========================
          PROFILE TAB
      ========================== */}
      {activeTab === "profile" && (
        <div className="profile-grid">

          {/* EDIT PROFILE */}
          <div className="profile-card profile-main-card">

            <div className="profile-section-header">
              <div>
                <h2>Personal Information</h2>

                <p>
                  Update your personal details and contact
                  information.
                </p>
              </div>
            </div>

            <EditProfileForm
              user={user}
              onSuccess={handleProfileUpdated}
            />

          </div>


          {/* ACCOUNT INFORMATION */}
          <div className="profile-card profile-account-card">

            <h2>Account Information</h2>

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <Mail size={17} />
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {user?.email || "Not available"}
                </strong>
              </div>

            </div>


            <div className="profile-info-item">

              <div className="profile-info-icon">
                <Phone size={17} />
              </div>

              <div>
                <span>Phone</span>

                <strong>
                  {user?.phone || "Not added"}
                </strong>
              </div>

            </div>


            <div className="profile-info-item">

              <div className="profile-info-icon">
                <Shield size={17} />
              </div>

              <div>
                <span>User Type</span>

                <strong>
                  {userType}
                </strong>
              </div>

            </div>


            <div className="profile-info-item">

              <div className="profile-info-icon">
                <BadgeCheck size={17} />
              </div>

              <div>
                <span>Account Status</span>

                <strong
                  className={
                    isActive
                      ? "profile-status-active"
                      : "profile-status-inactive"
                  }
                >
                  {isActive ? "Active" : "Inactive"}
                </strong>
              </div>

            </div>

          </div>

        </div>
      )}


      {/* =========================
          SECURITY TAB
      ========================== */}
      {activeTab === "security" && (
        <div className="profile-card profile-security-card">

          <div className="profile-section-header">
            <div>
              <h2>Security</h2>

              <p>
                Update your password to keep your account
                secure.
              </p>
            </div>
          </div>


          <div className="profile-password-wrapper">

            <div className="profile-security-icon">
              <Shield size={25} />
            </div>

            <div className="profile-password-content">

              <h3>
                Change Password
              </h3>

              <p>
                Choose a strong password that you haven't used
                before.
              </p>

              <ChangePasswordForm />

            </div>

          </div>

        </div>
      )}

    </div>
  );
}