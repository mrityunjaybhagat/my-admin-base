import React, { useState } from "react";
import { TramFront, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { login as apiLogin, forgotPassword as apiForgotPassword } from "../api/auth.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Enter your email address."); return; }
    if (!EMAIL_RE.test(email.trim())) { setError("That doesn't look like a valid email address."); return; }
    setError("");
    setLoading(true);
    try {
      await apiForgotPassword(email);
    } catch {
      // expected until VITE_API_BASE_URL points at a real backend
    }
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="login-card">
        <div className="login-brand">
          <TramFront size={20} color="var(--rust)" strokeWidth={2} />
          <span className="login-brand-text">Calcutta Chronicle</span>
        </div>
        <div className="login-sub">CHECK YOUR EMAIL</div>
        <p style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.6, marginBottom: 22 }}>
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </p>
        <button className="btn btn-secondary" style={{ width: "100%" }} onClick={onBack}>Back to Sign In</button>
      </div>
    );
  }

  return (
    <div className="login-card">
      <button className="link-btn" style={{ marginBottom: 10 }} onClick={onBack}>← Back to Sign In</button>
      <div className="login-brand">
        <TramFront size={20} color="var(--rust)" strokeWidth={2} />
        <span className="login-brand-text">Calcutta Chronicle</span>
      </div>
      <div className="login-sub">RESET YOUR PASSWORD</div>
      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="login-field">
          <div className="field-label">Email</div>
          <div className="login-input-row">
            <Mail size={15} color="var(--muted)" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
              placeholder="editor@calcuttachronicle.co.in"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary login-submit">
          {loading ? "Sending…" : (<>Send Reset Link <ArrowRight size={15} /></>)}
        </button>
      </form>
    </div>
  );
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Enter both email and password.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("That doesn't look like a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { user } = await apiLogin(email, password);
      setLoading(false);
      onLogin?.(user);
    } catch {
      setLoading(false);
      onLogin?.({ email }); // mock fallback until a real backend exists
    }
  };

  if (mode === "forgot") {
    return (
      <div className="login-shell">
        <div className="login-fade" />
        <div className="login-glow" />
        <ForgotPassword onBack={() => setMode("login")} />
      </div>
    );
  }

  return (
    <div className="login-shell">
      <div className="login-fade" />
      <div className="login-glow" />

      <div className="login-card">
        <div className="login-brand">
          <TramFront size={20} color="var(--rust)" strokeWidth={2} />
          <span className="login-brand-text">Calcutta Chronicle</span>
        </div>
        <div className="login-sub">EDITORIAL DESK — SIGN IN</div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <div className="field-label">Email</div>
            <div className="login-input-row">
              <Mail size={15} color="var(--muted)" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="editor@calcuttachronicle.co.in" />
            </div>
          </div>

          <div className="login-field">
            <div className="field-label">Password</div>
            <div className="login-input-row">
              <Lock size={15} color="var(--muted)" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              <button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="login-forgot">
            <button type="button" onClick={() => setMode("forgot")}>Forgot password?</button>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary login-submit">
            {loading ? "Signing in…" : (<>Sign In <ArrowRight size={15} /></>)}
          </button>
        </form>

        <div className="login-footnote">Accounts are Admin or Editor — access is set per user.</div>
      </div>
    </div>
  );
}
