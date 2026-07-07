 
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(data.user, data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FFFBEB" }}>
      {/* Left Side - Image */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundColor: "#92400E" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="text-6xl mb-6">🎂</div>
          <h1 className="text-5xl font-bold mb-4 text-center"
            style={{ fontFamily: "Georgia, serif" }}>
            Pastry Palace
          </h1>
          <p className="text-xl text-center opacity-90 mb-8"
            style={{ color: "#FDE68A" }}>
            Where every cake tells a story
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {["🎂 Custom Cakes", "🚚 Fast Delivery", "⭐ Premium Quality", "💝 Made with Love"].map((item) => (
              <div key={item}
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full"
                style={{ backgroundColor: i === 0 ? "#FDE68A" : "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ backgroundColor: "#D97706" }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20"
          style={{ backgroundColor: "#D97706" }} />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-4xl mb-2">🎂</div>
            <h1 className="text-3xl font-bold" style={{ color: "#92400E", fontFamily: "Georgia, serif" }}>
              Pastry Palace
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#1C0A00" }}>
              Create Account
            </h2>
            <p style={{ color: "#92400E" }}>
              Join us and order your dream cake! 🎉
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl text-red-700 text-sm font-medium"
              style={{ backgroundColor: "#FEE2E2", border: "1px solid #FCA5A5" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2"
                style={{ color: "#1C0A00" }}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2"
                style={{ color: "#1C0A00" }}>
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔐</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 mt-2"
              style={{
                backgroundColor: loading ? "#D97706" : "#92400E",
                boxShadow: "0 4px 15px rgba(146, 64, 14, 0.4)",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#7C2D12"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#92400E"}
            >
              {loading ? "Creating Account..." : "Create Account 🎂"}
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: "#92400E" }}>
            Already have an account?{" "}
            <Link to="/login"
              className="font-bold underline"
              style={{ color: "#1C0A00" }}>
              Login here
            </Link>
          </p>

          <p className="text-center text-xs mt-4" style={{ color: "#92400E" }}>
            By registering you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;