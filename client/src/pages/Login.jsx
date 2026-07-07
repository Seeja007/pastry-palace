 
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", formData);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FFFBEB" }}>
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎂</div>
            <h1 className="text-4xl font-bold mb-1"
              style={{ color: "#92400E", fontFamily: "Georgia, serif" }}>
              Pastry Palace
            </h1>
            <p className="text-sm" style={{ color: "#D97706" }}>
              ✨ Premium Cakes & Pastries
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#1C0A00" }}>
              Welcome Back!
            </h2>
            <p style={{ color: "#92400E" }}>
              Login to continue your sweet journey 🍰
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl text-red-700 text-sm font-medium"
              style={{ backgroundColor: "#FEE2E2", border: "1px solid #FCA5A5" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2"
                style={{ color: "#1C0A00" }}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📧</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2"
                style={{ color: "#1C0A00" }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded"
                  style={{ accentColor: "#92400E" }} />
                <span className="text-sm" style={{ color: "#92400E" }}>Remember me</span>
              </label>
              <Link to="/forgot-password"
                className="text-sm font-semibold"
                style={{ color: "#92400E" }}>
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200"
              style={{
                backgroundColor: loading ? "#D97706" : "#92400E",
                boxShadow: "0 4px 15px rgba(146, 64, 14, 0.4)",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#7C2D12"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#92400E"}
            >
              {loading ? "Logging in..." : "Login to Pastry Palace 🎂"}
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: "#92400E" }}>
            Don't have an account?{" "}
            <Link to="/register"
              className="font-bold underline"
              style={{ color: "#1C0A00" }}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundColor: "#92400E" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="text-7xl mb-6">🍰</div>
          <h2 className="text-4xl font-bold mb-4 text-center"
            style={{ fontFamily: "Georgia, serif" }}>
            Sweet Moments Await!
          </h2>
          <p className="text-lg text-center opacity-90 mb-8"
            style={{ color: "#FDE68A" }}>
            Order your perfect cake for every occasion
          </p>
          <div className="space-y-4 w-full max-w-sm">
            {[
              { icon: "🎂", text: "Birthday Cakes" },
              { icon: "💒", text: "Wedding Cakes" },
              { icon: "🎨", text: "Custom Designs" },
              { icon: "🚚", text: "Home Delivery" },
            ].map((item) => (
              <div key={item.text}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20"
          style={{ backgroundColor: "#D97706" }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-20"
          style={{ backgroundColor: "#D97706" }} />
      </div>
    </div>
  );
};

export default Login;