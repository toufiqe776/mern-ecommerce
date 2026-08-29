import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      window.dispatchEvent(new Event("userChanged"));
      setMsg({ text: "Login successful! Redirecting…", type: "success" });
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || "Invalid credentials. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.card}>
        {/* Left decorative panel — hidden on small screens via inline media approach */}
        <div style={styles.leftPanel} className="login-left-panel">
          <div style={styles.leftContent}>
            <div style={styles.logo}>🛒</div>
            <h1 style={styles.brandName}>MyShop</h1>
            <p style={styles.brandTagline}>
              Your one-stop destination for everything you love.
            </p>
            <div style={styles.featureList}>
              {["Free shipping on orders above $50", "30-day easy returns", "Secure & encrypted payments", "24/7 customer support"].map((f) => (
                <div key={f} style={styles.featureItem}>
                  <span style={styles.featureCheck}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div style={styles.rightPanel}>
          <div style={styles.formWrapper}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome back</h2>
              <p style={styles.formSubtitle}>Sign in to your account to continue</p>
            </div>

            {msg.text && (
              <div style={{
                ...styles.msgBox,
                background: msg.type === "success" ? "#ecfdf5" : "#fef2f2",
                borderColor: msg.type === "success" ? "#6ee7b7" : "#fca5a5",
                color: msg.type === "success" ? "#065f46" : "#991b1b",
              }}>
                <span style={styles.msgIcon}>{msg.type === "success" ? "✅" : "⚠️"}</span>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Email field */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="login-email">Email address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  />
                </div>
              </div>

              {/* Password field */}
              <div style={styles.fieldGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label} htmlFor="login-password">Password</label>
                  <button
                    type="button"
                    onClick={() => alert("In progress")}
                    style={styles.forgotLink}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ ...styles.input, paddingRight: "3rem" }}
                    onFocus={(e) => Object.assign(e.target.style, { ...styles.inputFocus, paddingRight: "3rem" })}
                    onBlur={(e) => Object.assign(e.target.style, { ...styles.input, paddingRight: "3rem" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
                onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.submitBtnHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { ...styles.submitBtn, opacity: loading ? 0.75 : 1 })}
              >
                {loading ? (
                  <span style={styles.loadingRow}>
                    <span style={styles.spinner} /> Signing in…
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            <p style={styles.switchText}>
              Don&apos;t have an account?{" "}
              <Link to="/signup" style={styles.switchLink}>
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-left-panel {
          display: flex;
        }
        @media (max-width: 768px) {
          .login-left-panel {
            display: none !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes blobMove {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-20px) scale(1.05); }
          66% { transform: translate(-20px,30px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  blob1: {
    position: "absolute", top: "-20%", left: "-10%",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    animation: "blobMove 8s ease-in-out infinite",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute", bottom: "-20%", right: "-10%",
    width: "400px", height: "400px", borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    animation: "blobMove 10s ease-in-out infinite reverse",
    pointerEvents: "none",
  },
  blob3: {
    position: "absolute", top: "40%", left: "30%",
    width: "200px", height: "200px", borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    animation: "blobMove 6s ease-in-out infinite 2s",
    pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 1,
    display: "flex",
    width: "100%", maxWidth: "900px",
    minHeight: "520px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  },
  leftPanel: {
    flex: "0 0 42%",
    background: "linear-gradient(160deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)",
    padding: "3rem 2.5rem",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  leftContent: { position: "relative", zIndex: 1 },
  logo: { fontSize: "3rem", marginBottom: "0.5rem" },
  brandName: {
    fontSize: "2.2rem", fontWeight: 800,
    color: "#fff", marginBottom: "0.5rem", letterSpacing: "-0.5px",
  },
  brandTagline: {
    color: "rgba(255,255,255,0.8)", fontSize: "1rem",
    lineHeight: 1.6, marginBottom: "2rem",
  },
  featureList: { display: "flex", flexDirection: "column", gap: "0.9rem" },
  featureItem: {
    display: "flex", alignItems: "flex-start", gap: "0.6rem",
    color: "rgba(255,255,255,0.9)", fontSize: "0.875rem",
  },
  featureCheck: {
    color: "#a5f3fc", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0, marginTop: "1px",
  },
  rightPanel: {
    flex: 1,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.5rem 2rem",
  },
  formWrapper: { width: "100%", maxWidth: "380px" },
  formHeader: { marginBottom: "1.75rem" },
  formTitle: {
    fontSize: "1.85rem", fontWeight: 800,
    color: "#111827", marginBottom: "0.3rem", letterSpacing: "-0.5px",
  },
  formSubtitle: { color: "#6b7280", fontSize: "0.9rem" },
  msgBox: {
    display: "flex", alignItems: "center", gap: "0.5rem",
    padding: "0.75rem 1rem", borderRadius: "10px",
    border: "1px solid", fontSize: "0.875rem",
    marginBottom: "1.25rem", fontWeight: 500,
  },
  msgIcon: { flexShrink: 0, fontSize: "1rem" },
  form: { display: "flex", flexDirection: "column", gap: "1.2rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: "0.875rem", fontWeight: 600, color: "#374151" },
  forgotLink: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: "0.8rem", color: "#6366f1", fontWeight: 500,
    padding: 0, textDecoration: "underline",
  },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute", left: "0.85rem",
    fontSize: "1rem", pointerEvents: "none", zIndex: 1,
  },
  input: {
    width: "100%", padding: "0.75rem 0.85rem 0.75rem 2.6rem",
    border: "1.5px solid #e5e7eb", borderRadius: "10px",
    fontSize: "0.95rem", color: "#111827",
    outline: "none", background: "#f9fafb",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.15)",
    background: "#fff",
  },
  eyeBtn: {
    position: "absolute", right: "0.75rem",
    background: "none", border: "none", cursor: "pointer",
    fontSize: "1.1rem", padding: 0, lineHeight: 1,
  },
  submitBtn: {
    width: "100%", padding: "0.85rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", border: "none", borderRadius: "10px",
    fontSize: "1rem", fontWeight: 700, cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
    letterSpacing: "0.3px", marginTop: "0.25rem",
  },
  submitBtnHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(99,102,241,0.5)",
    background: "linear-gradient(135deg, #5558e8, #7c4fe0)",
  },
  loadingRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" },
  spinner: {
    display: "inline-block", width: "16px", height: "16px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  switchText: {
    textAlign: "center", marginTop: "1.5rem",
    color: "#6b7280", fontSize: "0.9rem",
  },
  switchLink: {
    color: "#6366f1", fontWeight: 700, textDecoration: "none",
  },
};

