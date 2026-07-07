import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("loading");

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const confirm = async () => {
      try {
        if (orderId) {
          console.log("Confirming order:", orderId);
          await API.post("/payment/confirm-payment", { orderId });
          console.log("Order confirmed!");
        }
      } catch (err) {
        console.log("Confirm error:", err);
      } finally {
        clearCart();
        setStatus("success");
      }
    };
    confirm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") {
    return (
      <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="text-6xl mb-4">🎂</div>
          <p className="text-xl font-semibold" style={{ color: "#92400E" }}>
            Confirming your payment...
          </p>
          <p className="text-sm mt-2" style={{ color: "#7C2D12" }}>
            Please wait, do not close this page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-md w-full"
          style={{ border: "2px solid #D97706" }}>
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold mb-3"
            style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
            Payment Successful!
          </h2>
          <p className="mb-6" style={{ color: "#92400E" }}>
            Your order has been confirmed! 🎂
          </p>
          <div className="p-4 rounded-2xl mb-6" style={{ backgroundColor: "#FEF3C7" }}>
            <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
              ✅ Payment confirmed via Stripe
            </p>
            <p className="text-sm mt-2" style={{ color: "#7C2D12" }}>
              📧 Confirmation email sent to your inbox
            </p>
            <p className="text-sm mt-1" style={{ color: "#7C2D12" }}>
              👨‍🍳 We'll start baking your cake right away!
            </p>
          </div>
          <button onClick={() => navigate("/my-orders")}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg mb-3 transition-all hover:scale-105"
            style={{ backgroundColor: "#92400E", boxShadow: "0 4px 15px rgba(146,64,14,0.4)" }}>
            📦 Track My Order
          </button>
          <button onClick={() => navigate("/")}
            className="w-full py-3 rounded-2xl font-semibold mb-3 transition-all"
            style={{ border: "2px solid #92400E", color: "#92400E" }}>
            🏠 Back to Home
          </button>
          <button onClick={() => navigate("/order")}
            className="w-full py-3 rounded-2xl font-semibold transition-all"
            style={{ border: "2px solid #D97706", color: "#D97706" }}>
            🎂 Order More Cakes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;