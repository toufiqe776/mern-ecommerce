import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api/axios";

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "#e5e7eb" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "#e5e7eb" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f97316" },
    { label: "Good", color: "#eab308" },
    { label: "Strong", color: "#22c55e" },
  ];
  return map[score] || map[0];
}

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const res = await api.post("/auth/signup", form);
      setMsg({ text: res.data.message || "Account created! Redirecting to login…", type: "success" });
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = getPasswordStrength(form.password);

  return (
    <div style={styles.page}>
      {/* Animated blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.card}>
        {/* Left form panel */}
        <div style={styles.leftPanel}>
          <div style={styles.formWrapper}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Create account</h2>
              <p style={styles.formSubtitle}>Join thousands of happy shoppers today</p>
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
              {/* Name */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="signup-name">Full name</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="signup-email">Email address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    id="signup-email"
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

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="signup-password">Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
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

                {/* Password strength bar */}
                {form.password && (
                  <div style={styles.strengthWrapper}>
                    <div style={styles.strengthTrack}>
                      {[1, 2, 3, 4].map((seg) => (
                        <div
                          key={seg}
                          style={{
                            ...styles.strengthSeg,
                            background: pwStrength.score >= seg ? pwStrength.color : "#e5e7eb",
                          }}
                        />
                      ))}
                    </div>
                    {pwStrength.label && (
                      <span style={{ ...styles.strengthLabel, color: pwStrength.color }}>
                        {pwStrength.label}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Terms */}
              <p style={styles.terms}>
                By creating an account you agree to our{" "}
                <span style={styles.termsLink}>Terms of Service</span> and{" "}
                <span style={styles.termsLink}>Privacy Policy</span>.
              </p>

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
                    <span style={styles.spinner} /> Creating account…
                  </span>
                ) : "Create Account"}
              </button>
            </form>

            <p style={styles.switchText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.switchLink}>Sign in</Link>
            </p>
          </div>
        </div>

        {/* Right decorative panel — hidden on mobile */}
        <div style={styles.rightPanel} className="signup-right-panel">
          <div style={styles.rightContent}>
            <div style={styles.logo}>🛒</div>
            <h1 style={styles.brandName}>MyShop</h1>
            <p style={styles.brandTagline}>
              Shop smarter, live better. Discover products you'll love.
            </p>
            <div style={styles.statsGrid}>
              {[
                { num: "50K+", label: "Happy Customers" },
                { num: "10K+", label: "Products" },
                { num: "99%", label: "Satisfaction" },
                { num: "24/7", label: "Support" },
              ].map((s) => (
                <div key={s.label} style={styles.statCard}>
                  <div style={styles.statNum}>{s.num}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .signup-right-panel {
          display: flex;
        }
        @media (max-width: 768px) {
          .signup-right-panel {
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
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  blob1: {
    position: "absolute", top: "-15%", right: "-10%",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "rgba(99,102,241,0.15)",
    animation: "blobMove 8s ease-in-out infinite",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute", bottom: "-20%", left: "-10%",
    width: "450px", height: "450px", borderRadius: "50%",
    background: "rgba(139,92,246,0.12)",
    animation: "blobMove 11s ease-in-out infinite reverse",
    pointerEvents: "none",
  },
  blob3: {
    position: "absolute", top: "50%", right: "30%",
    width: "180px", height: "180px", borderRadius: "50%",
    background: "rgba(168,85,247,0.08)",
    animation: "blobMove 7s ease-in-out infinite 1s",
    pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 1,
    display: "flex",
    width: "100%", maxWidth: "900px",
    minHeight: "560px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
  },
  leftPanel: {
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
  form: { display: "flex", flexDirection: "column", gap: "1.1rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.875rem", fontWeight: 600, color: "#374151" },
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
  strengthWrapper: {
    display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem",
  },
  strengthTrack: { display: "flex", gap: "4px", flex: 1 },
  strengthSeg: {
    flex: 1, height: "4px", borderRadius: "2px",
    transition: "background 0.3s",
  },
  strengthLabel: { fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" },
  terms: {
    fontSize: "0.78rem", color: "#9ca3af", lineHeight: 1.5,
  },
  termsLink: { color: "#6366f1", cursor: "pointer", textDecoration: "underline" },
  submitBtn: {
    width: "100%", padding: "0.85rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", border: "none", borderRadius: "10px",
    fontSize: "1rem", fontWeight: 700, cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
    letterSpacing: "0.3px",
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
  // Right decorative panel
  rightPanel: {
    flex: "0 0 42%",
    background: "linear-gradient(160deg, #312e81 0%, #4c1d95 50%, #5b21b6 100%)",
    padding: "3rem 2.5rem",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  rightContent: { position: "relative", zIndex: 1, width: "100%" },
  logo: { fontSize: "3.5rem", marginBottom: "0.5rem" },
  brandName: {
    fontSize: "2.2rem", fontWeight: 800,
    color: "#fff", marginBottom: "0.5rem", letterSpacing: "-0.5px",
  },
  brandTagline: {
    color: "rgba(255,255,255,0.75)", fontSize: "0.95rem",
    lineHeight: 1.6, marginBottom: "2.5rem",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  statCard: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "12px", padding: "1rem 0.75rem",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
  },
  statNum: { fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: "0.2rem" },
  statLabel: { fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 },
};

