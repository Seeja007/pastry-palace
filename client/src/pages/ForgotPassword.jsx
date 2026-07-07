 
import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      setMessage(data.message);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#FFFBEB" }}>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl p-8 shadow-2xl"
          style={{ backgroundColor: "#FFFFFF", border: "2px solid #D97706" }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎂</div>
            <h1 className="text-3xl font-bold"
              style={{ color: "#92400E", fontFamily: "Georgia, serif" }}>
              Pastry Palace
            </h1>
          </div>

          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#FEF3C7" }}>
                  <span className="text-4xl">🔐</span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#1C0A00" }}>
                  Forgot Password?
                </h2>
                <p className="text-sm" style={{ color: "#92400E" }}>
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 rounded-xl text-red-700 text-sm"
                  style={{ backgroundColor: "#FEE2E2" }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2"
                    style={{ color: "#1C0A00" }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📧</span>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "#FFF9F0",
                        border: "2px solid #D97706",
                        color: "#1C0A00",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#92400E"}
                      onBlur={(e) => e.target.style.borderColor = "#D97706"}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200"
                  style={{
                    backgroundColor: loading ? "#D97706" : "#92400E",
                    boxShadow: "0 4px 15px rgba(146, 64, 14, 0.4)",
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link 📧"}
                </button>
              </form>
            </>
          ) : (
            // Success State
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: "#1C0A00" }}>
                Email Sent!
              </h2>
              <p className="mb-2" style={{ color: "#92400E" }}>
                {message}
              </p>
              <p className="text-sm mb-8" style={{ color: "#D97706" }}>
                Please check your inbox and click the reset link.
              </p>
              <div className="p-4 rounded-xl mb-6"
                style={{ backgroundColor: "#FEF3C7" }}>
                <p className="text-sm font-medium" style={{ color: "#92400E" }}>
                  📧 Sent to: <strong>{email}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <Link to="/login"
              className="flex-1 py-3 rounded-xl font-semibold text-center transition-all"
              style={{
                border: "2px solid #92400E",
                color: "#92400E",
              }}>
              ← Back to Login
            </Link>
            <Link to="/register"
              className="flex-1 py-3 rounded-xl font-semibold text-center text-white transition-all"
              style={{ backgroundColor: "#92400E" }}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;