import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const flavours = ["Chocolate", "Vanilla", "Strawberry", "Red Velvet", "Butterscotch", "Blueberry", "Pineapple", "Black Forest", "Mango", "Lemon"];
const sizes = [
  { label: "Small (500g)", price: 599 },
  { label: "Medium (1kg)", price: 999 },
  { label: "Large (2kg)", price: 1799 },
  { label: "Extra Large (3kg)", price: 2499 },
];
const layers = ["1 Layer", "2 Layers", "3 Layers", "4 Layers"];
const frostings = ["Buttercream", "Whipped Cream", "Fondant", "Cream Cheese", "Ganache", "Mirror Glaze"];
const shapes = ["Round", "Square", "Heart", "Rectangle", "Custom"];
const occasions = ["Birthday", "Wedding", "Anniversary", "Baby Shower", "Graduation", "Corporate", "Other"];

const CustomCake = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    flavour: "", size: "", sizePrice: 0, layers: "",
    frosting: "", shape: "", occasion: "",
    message: "", specialInstructions: "", deliveryDate: "",
  });

  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    if (field === "size") {
      const selected = sizes.find((s) => s.label === value);
      setForm({ ...form, size: value, sizePrice: selected ? selected.price : 0 });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const isFormValid = () =>
    form.flavour && form.size && form.layers &&
    form.frosting && form.shape && form.occasion && form.deliveryDate;

  const handleAddToCart = () => {
    if (!user) { navigate("/login"); return; }
    if (!isFormValid()) { setError("Please fill all required fields!"); return; }

    const customCakeItem = {
      _id: `custom-${Date.now()}`,
      id: `custom-${Date.now()}`,
      name: `Custom ${form.flavour} Cake (${form.size})`,
      category: "Custom Cake",
      price: form.sizePrice,
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&q=60",
      customDetails: form,
    };

    addToCart(customCakeItem);
    setAddedToCart(true);
    setError("");
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const selectStyle = (selected, value) => ({
    border: selected === value ? "2px solid #92400E" : "2px solid #EAD7C3",
    backgroundColor: selected === value ? "#FEF3C7" : "white",
    color: selected === value ? "#92400E" : "#7C2D12",
    cursor: "pointer",
    borderRadius: "12px",
    padding: "10px 16px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
  });

  return (
    <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
      <Navbar />

      <section className="px-6 lg:px-20 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-semibold tracking-widest mb-2" style={{ color: "#92400E" }}>
            BUILD YOUR DREAM CAKE
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold mb-3"
            style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
            Custom Cake Builder 🎨
          </h1>
          <p style={{ color: "#7C2D12" }}>
            Design your perfect cake for any occasion — we'll bake it just for you!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT - Form */}
          <div className="lg:col-span-2 space-y-8">

            {/* Occasion */}
            <div className="bg-white rounded-3xl p-8 shadow-md" style={{ border: "1px solid #EAD7C3" }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: "#1C0A00" }}>
                🎉 Select Occasion <span className="text-red-500">*</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {occasions.map((o) => (
                  <button key={o} onClick={() => handleChange("occasion", o)} style={selectStyle(form.occasion, o)}>
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Flavour */}
            <div className="bg-white rounded-3xl p-8 shadow-md" style={{ border: "1px solid #EAD7C3" }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: "#1C0A00" }}>
                🍫 Choose Flavour <span className="text-red-500">*</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {flavours.map((f) => (
                  <button key={f} onClick={() => handleChange("flavour", f)} style={selectStyle(form.flavour, f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="bg-white rounded-3xl p-8 shadow-md" style={{ border: "1px solid #EAD7C3" }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: "#1C0A00" }}>
                📦 Choose Size <span className="text-red-500">*</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sizes.map((s) => (
                  <button key={s.label} onClick={() => handleChange("size", s.label)}
                    className="p-4 rounded-2xl text-center transition-all"
                    style={{
                      border: form.size === s.label ? "2px solid #92400E" : "2px solid #EAD7C3",
                      backgroundColor: form.size === s.label ? "#FEF3C7" : "white",
                    }}>
                    <p className="font-bold text-sm" style={{ color: "#1C0A00" }}>{s.label}</p>
                    <p className="font-bold text-lg mt-1" style={{ color: "#92400E" }}>₹{s.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Layers & Frosting */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-8 shadow-md" style={{ border: "1px solid #EAD7C3" }}>
                <h2 className="text-xl font-bold mb-5" style={{ color: "#1C0A00" }}>
                  🎂 Layers <span className="text-red-500">*</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {layers.map((l) => (
                    <button key={l} onClick={() => handleChange("layers", l)} style={selectStyle(form.layers, l)}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-md" style={{ border: "1px solid #EAD7C3" }}>
                <h2 className="text-xl font-bold mb-5" style={{ color: "#1C0A00" }}>
                  🍦 Frosting <span className="text-red-500">*</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {frostings.map((f) => (
                    <button key={f} onClick={() => handleChange("frosting", f)} style={selectStyle(form.frosting, f)}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shape */}
            <div className="bg-white rounded-3xl p-8 shadow-md" style={{ border: "1px solid #EAD7C3" }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: "#1C0A00" }}>
                🔷 Cake Shape <span className="text-red-500">*</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {shapes.map((s) => (
                  <button key={s} onClick={() => handleChange("shape", s)} style={selectStyle(form.shape, s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Message & Instructions */}
            <div className="bg-white rounded-3xl p-8 shadow-md" style={{ border: "1px solid #EAD7C3" }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: "#1C0A00" }}>
                ✍️ Cake Message & Instructions
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                    Message on Cake
                  </label>
                  <input type="text" placeholder='e.g. "Happy Birthday Seeja!"'
                    value={form.message} onChange={(e) => handleChange("message", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ border: "2px solid #D97706", backgroundColor: "#FFF9F0", color: "#1C0A00" }}
                    onFocus={(e) => e.target.style.borderColor = "#92400E"}
                    onBlur={(e) => e.target.style.borderColor = "#D97706"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                    Special Instructions
                  </label>
                  <textarea placeholder="Any special requests, allergies, design preferences..."
                    value={form.specialInstructions}
                    onChange={(e) => handleChange("specialInstructions", e.target.value)}
                    rows={4} className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                    style={{ border: "2px solid #D97706", backgroundColor: "#FFF9F0", color: "#1C0A00" }}
                    onFocus={(e) => e.target.style.borderColor = "#92400E"}
                    onBlur={(e) => e.target.style.borderColor = "#D97706"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                    Preferred Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input type="date" value={form.deliveryDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleChange("deliveryDate", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ border: "2px solid #D97706", backgroundColor: "#FFF9F0", color: "#1C0A00" }}
                    onFocus={(e) => e.target.style.borderColor = "#92400E"}
                    onBlur={(e) => e.target.style.borderColor = "#D97706"}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl text-red-700 font-medium"
                style={{ backgroundColor: "#FEE2E2", border: "1px solid #FCA5A5" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Add to Cart Button */}
            <button onClick={handleAddToCart}
              className="w-full py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105"
              style={{
                backgroundColor: addedToCart ? "#16A34A" : "#92400E",
                color: "white",
                boxShadow: "0 4px 15px rgba(146,64,14,0.4)",
              }}>
              {addedToCart ? "✓ Added to Cart! Go to Cart →" : "🛒 Add Custom Cake to Cart"}
            </button>

          </div>

          {/* RIGHT - Live Preview */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl p-6 sticky top-24"
              style={{ backgroundColor: "white", border: "2px solid #D97706", boxShadow: "0 8px 30px rgba(146,64,14,0.15)" }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
                🎂 Live Preview
              </h2>
              <div className="relative mb-6">
                <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=60"
                  alt="Custom Cake" className="w-full h-48 object-cover rounded-2xl" />
                {form.message && (
                  <div className="absolute bottom-3 left-3 right-3 bg-white bg-opacity-90 px-3 py-2 rounded-xl text-center">
                    <p className="text-sm font-bold" style={{ color: "#92400E" }}>"{form.message}"</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {[
                  { label: "🎉 Occasion", value: form.occasion },
                  { label: "🍫 Flavour", value: form.flavour },
                  { label: "📦 Size", value: form.size },
                  { label: "🎂 Layers", value: form.layers },
                  { label: "🍦 Frosting", value: form.frosting },
                  { label: "🔷 Shape", value: form.shape },
                  { label: "📅 Delivery", value: form.deliveryDate },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2"
                    style={{ borderBottom: "1px solid #EAD7C3" }}>
                    <span className="text-sm font-semibold" style={{ color: "#7C2D12" }}>{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: item.value ? "#1C0A00" : "#D97706" }}>
                      {item.value || "Not selected"}
                    </span>
                  </div>
                ))}
              </div>
              {form.sizePrice > 0 && (
                <div className="mt-5 p-4 rounded-2xl text-center" style={{ backgroundColor: "#FEF3C7" }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#7C2D12" }}>Starting Price</p>
                  <p className="text-3xl font-bold" style={{ color: "#92400E" }}>₹{form.sizePrice}</p>
                  <p className="text-xs mt-1" style={{ color: "#7C2D12" }}>Final price may vary</p>
                </div>
              )}
              <div className="mt-5">
                <div className="flex justify-between text-xs mb-2" style={{ color: "#92400E" }}>
                  <span>Completion</span>
                  <span>{[form.occasion, form.flavour, form.size, form.layers, form.frosting, form.shape, form.deliveryDate].filter(Boolean).length}/7</span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: "#EAD7C3" }}>
                  <div className="h-2 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: "#92400E",
                      width: `${([form.occasion, form.flavour, form.size, form.layers, form.frosting, form.shape, form.deliveryDate].filter(Boolean).length / 7) * 100}%`
                    }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default CustomCake;