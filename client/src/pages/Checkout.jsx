 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const steps = ["Address", "Payment", "Confirm"];

const inputStyle = {
  backgroundColor: "#FFF9F0",
  border: "2px solid #D97706",
  color: "#1C0A00",
};

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const gst = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + gst;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(1);
  };

  const handlePaymentSubmit = () => {
    if (!paymentMethod) {
      alert("Please select a payment method!");
      return;
    }
    setCurrentStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      if (paymentMethod === "stripe") {
        // Stripe flow
        const { data } = await API.post("/payment/create-checkout-session", {
          cartItems,
          address,
        });
        window.location.href = data.url;
      } else {
        // COD or UPI - save order directly
        const { data } = await API.post("/orders/place", {
          items: cartItems,
          address,
          paymentMethod,
          totalPrice: grandTotal,
        });
        setOrderId(data.orderId);
        setOrderPlaced(true);
        clearCart();
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-md w-full"
            style={{ border: "2px solid #D97706" }}>
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-3"
              style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
              Order Placed!
            </h2>
            <p className="mb-2" style={{ color: "#92400E" }}>
              Thank you, {user?.name}! Your order is confirmed.
            </p>
            <div className="my-6 p-4 rounded-2xl" style={{ backgroundColor: "#FEF3C7" }}>
              <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
                Order ID: <span style={{ color: "#1C0A00" }}>#{orderId}</span>
              </p>
              <p className="text-sm mt-1" style={{ color: "#92400E" }}>
                Amount Paid: <span className="font-bold" style={{ color: "#1C0A00" }}>₹{grandTotal}</span>
              </p>
              <p className="text-sm mt-1" style={{ color: "#92400E" }}>
                Payment: <span className="font-bold" style={{ color: "#1C0A00" }}>
                  {paymentMethod === "cod" ? "Cash on Delivery" : "UPI"}
                </span>
              </p>
            </div>
            <p className="text-sm mb-8" style={{ color: "#7C2D12" }}>
              📧 A confirmation email has been sent to {address.email}
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg"
              style={{ backgroundColor: "#92400E" }}>
              Back to Home 🏠
            </button>
            <button
              onClick={() => navigate("/order")}
              className="w-full py-3 rounded-2xl font-semibold mt-3"
              style={{ border: "2px solid #92400E", color: "#92400E" }}>
              Order More Cakes 🎂
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
      <Navbar />

      <section className="px-6 lg:px-20 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="font-semibold tracking-widest mb-1" style={{ color: "#92400E" }}>
            ALMOST THERE
          </p>
          <h1 className="text-4xl font-bold"
            style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
            Checkout 🛒
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all"
                  style={{
                    backgroundColor: index <= currentStep ? "#92400E" : "#EAD7C3",
                    color: index <= currentStep ? "white" : "#7C2D12",
                    boxShadow: index === currentStep ? "0 4px 15px rgba(146,64,14,0.4)" : "none",
                  }}>
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <p className="text-xs font-semibold mt-2"
                  style={{ color: index <= currentStep ? "#92400E" : "#7C2D12" }}>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="w-24 h-1 mx-2 rounded-full mb-5"
                  style={{ backgroundColor: index < currentStep ? "#92400E" : "#EAD7C3" }} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT - Steps */}
          <div className="lg:col-span-2">

            {/* STEP 1 - Address */}
            {currentStep === 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-md"
                style={{ border: "1px solid #EAD7C3" }}>
                <h2 className="text-2xl font-bold mb-6"
                  style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
                  📍 Delivery Address
                </h2>
                <form onSubmit={handleAddressSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                        Full Name *
                      </label>
                      <input
                        type="text" name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        placeholder="Enter full name"
                        required
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "#92400E"}
                        onBlur={(e) => e.target.style.borderColor = "#D97706"}
                      />
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                        Email *
                      </label>
                      <input
                        type="email" name="email"
                        value={address.email}
                        onChange={handleAddressChange}
                        placeholder="Enter email"
                        required
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "#92400E"}
                        onBlur={(e) => e.target.style.borderColor = "#D97706"}
                      />
                    </div>
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel" name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        placeholder="Enter phone number"
                        required
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "#92400E"}
                        onBlur={(e) => e.target.style.borderColor = "#D97706"}
                      />
                    </div>
                    {/* Pincode */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                        Pincode *
                      </label>
                      <input
                        type="text" name="pincode"
                        value={address.pincode}
                        onChange={handleAddressChange}
                        placeholder="Enter pincode"
                        required
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "#92400E"}
                        onBlur={(e) => e.target.style.borderColor = "#D97706"}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={address.address}
                      onChange={handleAddressChange}
                      placeholder="House no, Street, Area..."
                      required rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#92400E"}
                      onBlur={(e) => e.target.style.borderColor = "#D97706"}
                    />
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                      Landmark
                    </label>
                    <input
                      type="text" name="landmark"
                      value={address.landmark}
                      onChange={handleAddressChange}
                      placeholder="Near temple, school etc."
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#92400E"}
                      onBlur={(e) => e.target.style.borderColor = "#D97706"}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                        City *
                      </label>
                      <input
                        type="text" name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        placeholder="Enter city"
                        required
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "#92400E"}
                        onBlur={(e) => e.target.style.borderColor = "#D97706"}
                      />
                    </div>
                    {/* State */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                        State *
                      </label>
                      <select
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "#92400E"}
                        onBlur={(e) => e.target.style.borderColor = "#D97706"}
                      >
                        <option value="">Select State</option>
                        {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
                    style={{ backgroundColor: "#92400E", boxShadow: "0 4px 15px rgba(146,64,14,0.4)" }}>
                    Continue to Payment →
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2 - Payment */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-8 shadow-md"
                style={{ border: "1px solid #EAD7C3" }}>
                <h2 className="text-2xl font-bold mb-6"
                  style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
                  💳 Select Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Stripe */}
                  <div
                    onClick={() => setPaymentMethod("stripe")}
                    className="flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all"
                    style={{
                      border: paymentMethod === "stripe" ? "2px solid #92400E" : "2px solid #EAD7C3",
                      backgroundColor: paymentMethod === "stripe" ? "#FEF3C7" : "white",
                    }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: "#EAD7C3" }}>
                      💳
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg" style={{ color: "#1C0A00" }}>
                        Credit / Debit Card
                      </p>
                      <p className="text-sm" style={{ color: "#7C2D12" }}>
                        Secure payment via Stripe — Visa, Mastercard, Rupay
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: "#92400E" }}>
                      {paymentMethod === "stripe" && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#92400E" }} />
                      )}
                    </div>
                  </div>

                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className="flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all"
                    style={{
                      border: paymentMethod === "upi" ? "2px solid #92400E" : "2px solid #EAD7C3",
                      backgroundColor: paymentMethod === "upi" ? "#FEF3C7" : "white",
                    }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: "#EAD7C3" }}>
                      📱
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg" style={{ color: "#1C0A00" }}>
                        UPI Payment
                      </p>
                      <p className="text-sm" style={{ color: "#7C2D12" }}>
                        Pay via GPay, PhonePe, Paytm, BHIM UPI
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: "#92400E" }}>
                      {paymentMethod === "upi" && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#92400E" }} />
                      )}
                    </div>
                  </div>

                  {/* UPI ID Input */}
                  {paymentMethod === "upi" && (
                    <div className="px-4">
                      <label className="block text-sm font-semibold mb-2" style={{ color: "#1C0A00" }}>
                        Enter UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={inputStyle}
                      />
                    </div>
                  )}

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className="flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all"
                    style={{
                      border: paymentMethod === "cod" ? "2px solid #92400E" : "2px solid #EAD7C3",
                      backgroundColor: paymentMethod === "cod" ? "#FEF3C7" : "white",
                    }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: "#EAD7C3" }}>
                      💵
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg" style={{ color: "#1C0A00" }}>
                        Cash on Delivery
                      </p>
                      <p className="text-sm" style={{ color: "#7C2D12" }}>
                        Pay when your order arrives at your door
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: "#92400E" }}>
                      {paymentMethod === "cod" && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#92400E" }} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="flex-1 py-4 rounded-2xl font-bold transition-all"
                    style={{ border: "2px solid #92400E", color: "#92400E" }}>
                    ← Back
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    className="flex-1 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
                    style={{ backgroundColor: "#92400E", boxShadow: "0 4px 15px rgba(146,64,14,0.4)" }}>
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 - Confirm */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-8 shadow-md"
                style={{ border: "1px solid #EAD7C3" }}>
                <h2 className="text-2xl font-bold mb-6"
                  style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
                  ✅ Review & Confirm Order
                </h2>

                {/* Delivery Details */}
                <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: "#FEF3C7" }}>
                  <h3 className="font-bold mb-3" style={{ color: "#1C0A00" }}>📍 Delivery Address</h3>
                  <p className="font-semibold" style={{ color: "#1C0A00" }}>{address.fullName}</p>
                  <p className="text-sm" style={{ color: "#7C2D12" }}>{address.phone} | {address.email}</p>
                  <p className="text-sm" style={{ color: "#7C2D12" }}>
                    {address.address}, {address.landmark && `${address.landmark}, `}
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: "#FEF3C7" }}>
                  <h3 className="font-bold mb-2" style={{ color: "#1C0A00" }}>💳 Payment Method</h3>
                  <p className="font-semibold" style={{ color: "#92400E" }}>
                    {paymentMethod === "stripe" && "💳 Credit / Debit Card (Stripe)"}
                    {paymentMethod === "upi" && "📱 UPI Payment"}
                    {paymentMethod === "cod" && "💵 Cash on Delivery"}
                  </p>
                </div>

                {/* Items */}
                <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: "#FEF3C7" }}>
                  <h3 className="font-bold mb-3" style={{ color: "#1C0A00" }}>🎂 Order Items</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "#1C0A00" }}>
                              {item.name}
                            </p>
                            <p className="text-xs" style={{ color: "#7C2D12" }}>
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold" style={{ color: "#92400E" }}>
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-4 rounded-2xl font-bold transition-all"
                    style={{ border: "2px solid #92400E", color: "#92400E" }}>
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
                    style={{ backgroundColor: loading ? "#D97706" : "#92400E", boxShadow: "0 4px 15px rgba(146,64,14,0.4)" }}>
                    {loading ? "Placing Order..." : "Place Order 🎂"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl p-6 sticky top-24"
              style={{ backgroundColor: "white", border: "2px solid #D97706", boxShadow: "0 8px 30px rgba(146,64,14,0.15)" }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span style={{ color: "#7C2D12" }}>{item.name} × {item.quantity}</span>
                    <span className="font-semibold" style={{ color: "#1C0A00" }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2" style={{ borderColor: "#EAD7C3" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#7C2D12" }}>Subtotal</span>
                  <span className="font-semibold" style={{ color: "#1C0A00" }}>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#7C2D12" }}>Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#7C2D12" }}>GST (5%)</span>
                  <span className="font-semibold" style={{ color: "#1C0A00" }}>₹{gst}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3"
                  style={{ borderColor: "#EAD7C3" }}>
                  <span style={{ color: "#1C0A00" }}>Total</span>
                  <span style={{ color: "#92400E" }}>₹{grandTotal}</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: "🔒", text: "Secure" },
                  { icon: "🚚", text: "Free Delivery" },
                  { icon: "⭐", text: "Premium" },
                ].map((b) => (
                  <div key={b.text} className="p-2 rounded-xl" style={{ backgroundColor: "#FEF3C7" }}>
                    <div className="text-xl mb-1">{b.icon}</div>
                    <p className="text-xs font-semibold" style={{ color: "#92400E" }}>{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;