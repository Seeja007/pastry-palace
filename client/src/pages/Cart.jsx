 
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
            Your Cart is Empty!
          </h2>
          <p className="mb-8 text-lg" style={{ color: "#92400E" }}>
            Looks like you haven't added any cakes yet 🎂
          </p>
          <button
            onClick={() => navigate("/order")}
            className="px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
            style={{ backgroundColor: "#92400E", boxShadow: "0 4px 15px rgba(146,64,14,0.4)" }}>
            Browse Cakes 🍰
          </button>
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
            YOUR SELECTION
          </p>
          <h1 className="text-4xl font-bold" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
            My Cart 🛒
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => (
              <div key={item._id}
                className="bg-white rounded-2xl p-5 flex gap-5 items-center shadow-md hover:shadow-lg transition-all"
                style={{ border: "1px solid #EAD7C3" }}>

                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold"
                    style={{ backgroundColor: "#FDE68A", color: "#92400E" }}>
                    {item.category}
                  </span>
                  <h3 className="font-bold text-lg mt-2 mb-1" style={{ color: "#1C0A00" }}>
                    {item.name}
                  </h3>
                  <p className="font-bold text-xl" style={{ color: "#92400E" }}>
                    ₹{item.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 rounded-xl overflow-hidden"
                    style={{ border: "2px solid #D97706" }}>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-2 font-bold text-lg transition-all hover:bg-[#FEF3C7]"
                      style={{ color: "#92400E" }}>
                      −
                    </button>
                    <span className="px-3 font-bold text-lg" style={{ color: "#1C0A00" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-2 font-bold text-lg transition-all hover:bg-[#FEF3C7]"
                      style={{ color: "#92400E" }}>
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "#7C2D12" }}>
                    ₹{item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 text-sm font-semibold hover:text-red-700 transition-all">
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-sm font-semibold text-red-500 hover:text-red-700 transition-all mt-2">
              🗑️ Clear Entire Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl p-8 sticky top-24"
              style={{ backgroundColor: "white", border: "2px solid #D97706", boxShadow: "0 8px 30px rgba(146,64,14,0.15)" }}>

              <h2 className="text-2xl font-bold mb-6" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
                Order Summary
              </h2>

              {/* Items list */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center text-sm">
                    <span style={{ color: "#7C2D12" }}>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold" style={{ color: "#1C0A00" }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-3" style={{ borderColor: "#EAD7C3" }}>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "#7C2D12" }}>Subtotal</span>
                  <span className="font-semibold" style={{ color: "#1C0A00" }}>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "#7C2D12" }}>Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "#7C2D12" }}>GST (5%)</span>
                  <span className="font-semibold" style={{ color: "#1C0A00" }}>
                    ₹{Math.round(totalPrice * 0.05)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-8" style={{ borderColor: "#EAD7C3" }}>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold" style={{ color: "#1C0A00" }}>Total</span>
                  <span className="text-2xl font-bold" style={{ color: "#92400E" }}>
                    ₹{totalPrice + Math.round(totalPrice * 0.05)}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "2px solid #D97706", backgroundColor: "#FFF9F0", color: "#1C0A00" }}
                />
                <button className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: "#D97706" }}>
                  Apply
                </button>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
                style={{ backgroundColor: "#92400E", boxShadow: "0 4px 15px rgba(146,64,14,0.4)" }}>
                Proceed to Checkout 🎂
              </button>

              <button
                onClick={() => navigate("/order")}
                className="w-full py-3 rounded-2xl font-semibold text-center mt-3 transition-all"
                style={{ border: "2px solid #92400E", color: "#92400E" }}>
                ← Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: "🔒", text: "Secure Payment" },
                  { icon: "🚚", text: "Free Delivery" },
                  { icon: "⭐", text: "Premium Quality" },
                ].map((badge) => (
                  <div key={badge.text} className="p-2 rounded-xl"
                    style={{ backgroundColor: "#FEF3C7" }}>
                    <div className="text-xl mb-1">{badge.icon}</div>
                    <p className="text-xs font-semibold" style={{ color: "#92400E" }}>{badge.text}</p>
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

export default Cart;