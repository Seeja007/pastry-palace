import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const statusSteps = ["Order Placed", "Confirmed", "Baking", "Out for Delivery", "Delivered"];

const statusColors = {
  "Order Placed": "#D97706",
  "Confirmed": "#2563EB",
  "confirmed": "#2563EB",
  "Baking": "#7C3AED",
  "Out for Delivery": "#EA580C",
  "Delivered": "#16A34A",
};

const normalizeStatus = (status) => {
  if (!status) return "Order Placed";
  if (status === "confirmed") return "Confirmed";
  return status;
};

// Time-based auto progress
const getAutoStatus = (order) => {
  if (order.orderStatus === "Delivered") return "Delivered";
  if (order.orderStatus === "Out for Delivery") return "Out for Delivery";

  const placed = new Date(order.statusUpdatedAt || order.createdAt);
  const now = new Date();
  const mins = Math.floor((now - placed) / 60000);

  if (mins < 30) return "Order Placed";
  if (mins < 60) return "Confirmed";
  if (mins < 90) return "Baking";
  if (mins < 150) return "Out for Delivery";
  return "Delivered";
};

const getTimeRemaining = (order) => {
  const placed = new Date(order.statusUpdatedAt || order.createdAt);
  const now = new Date();
  const mins = Math.floor((now - placed) / 60000);
  const totalMins = 150;
  const remaining = totalMins - mins;
  if (remaining <= 0) return "Arriving soon!";
  const h = Math.floor(remaining / 60);
  const m = remaining % 60;
  return h > 0 ? `${h}h ${m}m remaining` : `${m} min remaining`;
};

const getProgressPercent = (order) => {
  const placed = new Date(order.statusUpdatedAt || order.createdAt);
  const now = new Date();
  const mins = Math.floor((now - placed) / 60000);
  return Math.min(Math.round((mins / 150) * 100), 100);
};

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [reviewData, setReviewData] = useState({ rating: 0, text: "", photo: null, orderId: null });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [otpInputs, setOtpInputs] = useState({});
  const [otpLoading, setOtpLoading] = useState({});
  const [otpError, setOtpError] = useState({});
  const [otpSuccess, setOtpSuccess] = useState({});
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchOrders();
    const interval = setInterval(() => {
      setTick(t => t + 1);
      fetchOrders();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await API.get("/orders/my-orders");
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  const totalSpent = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const deliveredOrders = orders.filter(o =>
    normalizeStatus(o.orderStatus) === "Delivered" || getAutoStatus(o) === "Delivered"
  );

  const handleOtpVerify = async (orderId) => {
    const otp = otpInputs[orderId];
    if (!otp || otp.length !== 6) {
      setOtpError({ ...otpError, [orderId]: "Please enter 6 digit OTP" });
      return;
    }
    setOtpLoading({ ...otpLoading, [orderId]: true });
    setOtpError({ ...otpError, [orderId]: "" });
    try {
      await API.post(`/orders/${orderId}/verify-otp`, { otp });
      setOtpSuccess({ ...otpSuccess, [orderId]: "✅ Order Delivered Successfully!" });
      fetchOrders();
    } catch (err) {
      setOtpError({ ...otpError, [orderId]: err.response?.data?.message || "Invalid OTP" });
    }
    setOtpLoading({ ...otpLoading, [orderId]: false });
  };

  const handleReviewSubmit = async (orderId) => {
    if (!reviewData.rating) { alert("Please select a rating!"); return; }
    setReviewLoading(true);
    try {
      const formData = new FormData();
      formData.append("rating", reviewData.rating);
      formData.append("text", reviewData.text);
      if (reviewData.photo) formData.append("photo", reviewData.photo);
      await API.post(`/orders/${orderId}/review`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setReviewSuccess("Review submitted! ⭐");
      setReviewData({ rating: 0, text: "", photo: null, orderId: null });
      fetchOrders();
      setTimeout(() => setReviewSuccess(""), 3000);
    } catch (err) {
      alert("Failed to submit review");
    }
    setReviewLoading(false);
  };

  if (loading) return (
    <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
      <Navbar />
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="text-6xl mb-4">🎂</div>
          <p className="text-xl font-semibold" style={{ color: "#92400E" }}>Loading your orders...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
      <Navbar />
      <section className="px-6 lg:px-20 py-12">

        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-md flex flex-col md:flex-row items-center gap-6"
          style={{ border: "2px solid #D97706" }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ backgroundColor: "#92400E", fontSize: "36px" }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
              {user?.name}
            </h1>
            <p style={{ color: "#92400E" }}>{user?.email}</p>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {[
              { label: "Total Orders", value: orders.length, icon: "🛒" },
              { label: "Delivered", value: deliveredOrders.length, icon: "✅" },
              { label: "Total Spent", value: `₹${totalSpent}`, icon: "💰" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-2xl"
                style={{ backgroundColor: "#FEF3C7", minWidth: "90px" }}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="text-xl font-bold" style={{ color: "#92400E" }}>{stat.value}</p>
                <p className="text-xs font-semibold" style={{ color: "#7C2D12" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {["orders", "reviews"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-6 py-3 rounded-2xl font-bold capitalize transition-all"
              style={{
                backgroundColor: activeTab === tab ? "#92400E" : "#EAD7C3",
                color: activeTab === tab ? "white" : "#7C2D12",
              }}>
              {tab === "orders" ? "🛒 My Orders" : "⭐ My Reviews"}
            </button>
          ))}
        </div>

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-md"
                style={{ border: "1px solid #EAD7C3" }}>
                <div className="text-7xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: "#1C0A00" }}>No Orders Yet!</h2>
                <p className="mb-6" style={{ color: "#92400E" }}>Start ordering your favorite cakes!</p>
                <button onClick={() => navigate("/order")}
                  className="px-8 py-4 rounded-2xl font-bold text-white"
                  style={{ backgroundColor: "#92400E" }}>
                  Order Now 🎂
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const autoStatus = getAutoStatus(order);
                const displayStatus = normalizeStatus(order.orderStatus) === "Delivered"
                  ? "Delivered"
                  : autoStatus;
                const currentIndex = statusSteps.indexOf(displayStatus);
                const progress = getProgressPercent(order);
                const isDelivered = displayStatus === "Delivered";
                const isOutForDelivery = displayStatus === "Out for Delivery";

                return (
                  <div key={order._id} className="bg-white rounded-3xl p-6 shadow-md"
                    style={{ border: "1px solid #EAD7C3" }}>

                    {/* Order Header */}
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#7C2D12" }}>
                          Order ID:{" "}
                          <span className="font-bold" style={{ color: "#92400E" }}>
                            #{order._id.toString().slice(-8).toUpperCase()}
                          </span>
                        </p>
                        <p className="text-sm mt-1" style={{ color: "#7C2D12" }}>
                          📅 {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "long", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                        <p className="text-sm mt-1" style={{ color: "#7C2D12" }}>
                          💳 {order.paymentMethod?.toUpperCase()} —{" "}
                          <span style={{ color: order.paymentStatus === "paid" ? "#16A34A" : "#D97706" }}>
                            {order.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-4 py-2 rounded-full text-sm font-bold text-white inline-block mb-2"
                          style={{ backgroundColor: statusColors[displayStatus] || "#92400E" }}>
                          {displayStatus}
                        </span>
                        <p className="font-bold text-xl" style={{ color: "#92400E" }}>
                          ₹{order.totalPrice}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="flex flex-wrap gap-3 mb-5">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl"
                          style={{ backgroundColor: "#FEF3C7" }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover"
                            onError={(e) => e.target.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100"}
                          />
                          <div>
                            <p className="text-sm font-bold" style={{ color: "#1C0A00" }}>{item.name}</p>
                            <p className="text-xs" style={{ color: "#92400E" }}>
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* TIME-BASED TRACKING */}
                    {!isDelivered && (
                      <div className="mb-5 p-4 rounded-2xl" style={{ backgroundColor: "#FFF9F0" }}>
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm font-bold" style={{ color: "#1C0A00" }}>
                            📍 Live Tracking
                          </p>
                          <p className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                            ⏱ {getTimeRemaining(order)}
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 rounded-full mb-4 overflow-hidden"
                          style={{ backgroundColor: "#EAD7C3" }}>
                          <div
                            className="h-3 rounded-full transition-all duration-1000"
                            style={{
                              width: `${progress}%`,
                              background: "linear-gradient(90deg, #92400E, #D97706)",
                            }}
                          />
                        </div>

                        {/* Step Indicators */}
                        <div className="flex items-center">
                          {statusSteps.map((step, index) => {
                            const isCompleted = index <= currentIndex;
                            const isActive = index === currentIndex;
                            return (
                              <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                  <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                    style={{
                                      backgroundColor: isCompleted ? "#92400E" : "#EAD7C3",
                                      color: isCompleted ? "white" : "#92400E",
                                      boxShadow: isActive ? "0 0 0 4px rgba(146,64,14,0.25)" : "none",
                                    }}>
                                    {isCompleted ? "✓" : index + 1}
                                  </div>
                                  <p className="text-center font-semibold mt-1 hidden md:block"
                                    style={{
                                      color: isCompleted ? "#92400E" : "#D1D5DB",
                                      fontSize: "9px",
                                      maxWidth: "55px",
                                      lineHeight: "1.2",
                                    }}>
                                    {step}
                                  </p>
                                </div>
                                {index < statusSteps.length - 1 && (
                                  <div className="flex-1 h-1 mx-1 rounded-full transition-all"
                                    style={{ backgroundColor: index < currentIndex ? "#92400E" : "#EAD7C3" }} />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Status Message */}
                        <div className="mt-4 p-3 rounded-xl text-center"
                          style={{ backgroundColor: "#FEF3C7" }}>
                          <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
                            {displayStatus === "Order Placed" && "✅ Order received! We're getting ready..."}
                            {displayStatus === "Confirmed" && "👨‍🍳 Order confirmed! Preparing ingredients..."}
                            {displayStatus === "Baking" && "🔥 Your cake is in the oven! Smells amazing!"}
                            {displayStatus === "Out for Delivery" && "🚚 Your cake is on the way! Check your email for OTP!"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Delivered Tracking */}
                    {isDelivered && (
                      <div className="mb-5 p-4 rounded-2xl" style={{ backgroundColor: "#DCFCE7" }}>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">✅</span>
                          <div>
                            <p className="font-bold" style={{ color: "#16A34A" }}>Order Delivered!</p>
                            <p className="text-sm" style={{ color: "#15803D" }}>
                              Your cake has been delivered successfully!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OTP Section - Show when Out for Delivery */}
                    {isOutForDelivery && !isDelivered && !order.otpVerified && (
                      <div className="mb-5 p-5 rounded-2xl"
                        style={{ border: "2px solid #EA580C", backgroundColor: "#FFF7ED" }}>
                        <p className="font-bold mb-1" style={{ color: "#EA580C" }}>
                          🚚 Delivery OTP Verification
                        </p>
                        <p className="text-sm mb-4" style={{ color: "#7C2D12" }}>
                          Check your email for the OTP and enter it below to confirm delivery
                        </p>

                        {otpSuccess[order._id] ? (
                          <div className="p-3 rounded-xl text-center font-bold"
                            style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}>
                            {otpSuccess[order._id]}
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                value={otpInputs[order._id] || ""}
                                onChange={(e) => setOtpInputs({
                                  ...otpInputs,
                                  [order._id]: e.target.value.replace(/\D/g, "")
                                })}
                                className="flex-1 px-4 py-3 rounded-xl outline-none text-center text-2xl font-bold tracking-widest"
                                style={{
                                  border: "2px solid #EA580C",
                                  backgroundColor: "#FFF",
                                  color: "#1C0A00",
                                }}
                              />
                              <button
                                onClick={() => handleOtpVerify(order._id)}
                                disabled={otpLoading[order._id]}
                                className="px-6 py-3 rounded-xl font-bold text-white transition-all"
                                style={{ backgroundColor: "#EA580C" }}>
                                {otpLoading[order._id] ? "..." : "Verify"}
                              </button>
                            </div>
                            {otpError[order._id] && (
                              <p className="text-red-600 text-sm mt-2 font-semibold">
                                {otpError[order._id]}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Delivery Address */}
                    {order.address?.fullName && (
                      <div className="mb-5 p-4 rounded-2xl" style={{ backgroundColor: "#FEF3C7" }}>
                        <p className="text-sm font-bold mb-1" style={{ color: "#1C0A00" }}>
                          📍 Delivery Address
                        </p>
                        <p className="text-sm" style={{ color: "#7C2D12" }}>
                          {order.address.fullName} | {order.address.phone}
                        </p>
                        <p className="text-sm" style={{ color: "#7C2D12" }}>
                          {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
                        </p>
                      </div>
                    )}

                    {/* REVIEW — Only if Delivered */}
                    {isDelivered && (
                      <div className="border-t pt-5" style={{ borderColor: "#EAD7C3" }}>
                        {order.review?.rating > 0 ? (
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-bold" style={{ color: "#1C0A00" }}>
                              Your Rating:
                            </p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span key={s} className="text-2xl"
                                  style={{ color: s <= order.review.rating ? "#F59E0B" : "#D1D5DB" }}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm font-semibold" style={{ color: "#92400E" }}>
                              ({order.review.rating}/5)
                            </span>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold mb-3" style={{ color: "#1C0A00" }}>
                              Rate Your Order ⭐
                            </p>
                            {reviewSuccess && reviewData.orderId === order._id && (
                              <div className="p-3 rounded-xl mb-3 font-semibold text-green-700"
                                style={{ backgroundColor: "#DCFCE7" }}>
                                {reviewSuccess}
                              </div>
                            )}
                            <div className="flex gap-2 mb-3">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button key={s}
                                  onClick={() => setReviewData({ ...reviewData, rating: s, orderId: order._id })}
                                  className="text-3xl transition-all hover:scale-110">
                                  <span style={{
                                    color: s <= reviewData.rating && reviewData.orderId === order._id
                                      ? "#F59E0B" : "#D1D5DB"
                                  }}>★</span>
                                </button>
                              ))}
                            </div>
                            {reviewData.orderId === order._id && (
                              <>
                                <textarea
                                  placeholder="Share your experience..."
                                  value={reviewData.text}
                                  onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
                                  rows={2}
                                  className="w-full px-4 py-3 rounded-xl outline-none resize-none mb-3 text-sm"
                                  style={{ border: "2px solid #D97706", backgroundColor: "#FFF9F0", color: "#1C0A00" }}
                                />
                                <div className="flex items-center gap-3 mb-3">
                                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl font-semibold text-sm"
                                    style={{ border: "2px solid #D97706", color: "#92400E" }}>
                                    📷 Photo
                                    <input type="file" accept="image/*" className="hidden"
                                      onChange={(e) => setReviewData({ ...reviewData, photo: e.target.files[0] })} />
                                  </label>
                                  {reviewData.photo && (
                                    <p className="text-xs" style={{ color: "#92400E" }}>
                                      ✓ {reviewData.photo.name}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleReviewSubmit(order._id)}
                                  disabled={reviewLoading}
                                  className="px-6 py-3 rounded-2xl font-bold text-white text-sm transition-all"
                                  style={{ backgroundColor: "#92400E" }}>
                                  {reviewLoading ? "Submitting..." : "Submit Review ⭐"}
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {deliveredOrders.filter(o => o.review?.rating > 0).length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-md"
                style={{ border: "1px solid #EAD7C3" }}>
                <div className="text-7xl mb-4">⭐</div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#1C0A00" }}>No Reviews Yet!</h2>
                <p style={{ color: "#92400E" }}>Reviews appear after your orders are delivered</p>
              </div>
            ) : (
              deliveredOrders.filter(o => o.review?.rating > 0).map((order) => (
                <div key={order._id} className="bg-white rounded-3xl p-6 shadow-md"
                  style={{ border: "1px solid #EAD7C3" }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold" style={{ color: "#1C0A00" }}>
                        Order #{order._id.toString().slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm" style={{ color: "#7C2D12" }}>
                        {order.review?.createdAt
                          ? new Date(order.review.createdAt).toLocaleDateString("en-IN")
                          : ""}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-xl"
                          style={{ color: s <= order.review.rating ? "#F59E0B" : "#D1D5DB" }}>★</span>
                      ))}
                    </div>
                  </div>
                  {order.review?.text && (
                    <p className="mb-3" style={{ color: "#7C2D12" }}>"{order.review.text}"</p>
                  )}
                  {order.review?.photo && (
                    <img src={`http://localhost:5000${order.review.photo}`}
                      alt="Review" className="w-24 h-24 rounded-xl object-cover mb-3" />
                  )}
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item, i) => (
                      <span key={i} className="text-xs px-3 py-1 rounded-full font-semibold"
                        style={{ backgroundColor: "#FDE68A", color: "#92400E" }}>
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyOrders;