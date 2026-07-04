const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// Generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Place Regular Order (COD/UPI)
router.post("/place", protect, async (req, res) => {
  try {
    const { items, address, paymentMethod, totalPrice } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      orderStatus: "Order Placed",
      statusUpdatedAt: new Date(),
    });

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "🛒 New Order - Pastry Palace",
      html: `<div style="font-family:Arial"><h2>New Order #${order._id.toString().slice(-8).toUpperCase()}</h2><p>Customer: ${address.fullName}</p><p>Total: ₹${totalPrice}</p><p>Payment: ${paymentMethod}</p></div>`
    });

    await sendEmail({
      to: address.email,
      subject: "🎂 Order Confirmed - Pastry Palace",
      html: `<div style="font-family:Arial"><h2>Hi ${address.fullName}! Order Confirmed!</h2><p>Order ID: #${order._id.toString().slice(-8).toUpperCase()}</p><p>Total: ₹${totalPrice}</p><p>Your cake will be delivered in ~2.5 hours!</p></div>`
    });

    res.status(201).json({
      message: "Order placed!",
      orderId: order._id.toString().slice(-8).toUpperCase(),
      fullOrderId: order._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get My Orders
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log(`✅ Found ${orders.length} orders for user ${req.user._id}`);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Verify Delivery OTP
router.post("/:id/verify-otp", protect, async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.id).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.deliveryOTP !== otp) {
      return res.status(400).json({ message: "❌ Invalid OTP! Please try again." });
    }

    order.orderStatus = "Delivered";
    order.otpVerified = true;
    order.deliveryOTP = null;
    order.statusUpdatedAt = new Date();
    await order.save();

    const customerEmail = order.address?.email || order.user?.email;
    const customerName = order.address?.fullName || order.user?.name;

    // Delivery confirmation email
    await sendEmail({
      to: customerEmail,
      subject: "🎂 Order Delivered! - Pastry Palace",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#92400E;padding:20px;text-align:center;border-radius:10px 10px 0 0">
            <h1 style="color:white;margin:0">🎂 Pastry Palace</h1>
          </div>
          <div style="padding:20px;background:#FFF9F0;">
            <h2 style="color:#1C0A00">Order Delivered! 🎉</h2>
            <p>Hi ${customerName}, your order has been delivered successfully!</p>
            <div style="background:#FEF3C7;padding:15px;border-radius:10px;margin:15px 0">
              <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Total Paid:</strong> ₹${order.totalPrice}</p>
            </div>
            <p>We hope you love your cake! Please rate your experience in the app ⭐</p>
          </div>
        </div>
      `
    });

    res.json({ message: "✅ Order delivered successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get Single Order
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update Order Status (triggers OTP for Out for Delivery)
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    order.statusUpdatedAt = new Date();

    // Send OTP when Out for Delivery
    if (status === "Out for Delivery") {
      const otp = generateOTP();
      order.deliveryOTP = otp;

      const customerEmail = order.address?.email || order.user?.email;
      const customerName = order.address?.fullName || order.user?.name;

      await sendEmail({
        to: customerEmail,
        subject: "🚚 Your Order is Out for Delivery! OTP Inside - Pastry Palace",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#92400E;padding:20px;text-align:center;border-radius:10px 10px 0 0">
              <h1 style="color:white;margin:0">🚚 Out for Delivery!</h1>
            </div>
            <div style="padding:20px;background:#FFF9F0;">
              <h2 style="color:#1C0A00">Hi ${customerName}! Your cake is on the way!</h2>
              <p>Order ID: #${order._id.toString().slice(-8).toUpperCase()}</p>
              <div style="background:#FEF3C7;padding:20px;border-radius:10px;margin:20px 0;text-align:center">
                <p style="font-size:14px;color:#92400E;margin:0 0 10px 0">Your Delivery OTP</p>
                <h1 style="font-size:48px;color:#92400E;margin:0;letter-spacing:10px">${otp}</h1>
                <p style="font-size:12px;color:#7C2D12;margin:10px 0 0 0">Share this OTP with the delivery person to confirm delivery</p>
              </div>
              <p style="color:#7C2D12">Do not share this OTP with anyone else!</p>
            </div>
          </div>
        `
      });
    }

    await order.save();
    res.json({ message: "Status updated!", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Submit Review
router.post("/:id/review", protect, upload.single("photo"), async (req, res) => {
  try {
    const { rating, text } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.review = {
      rating: Number(rating),
      text,
      photo: req.file ? `/uploads/${req.file.filename}` : "",
      createdAt: new Date(),
    };
    await order.save();
    res.json({ message: "Review submitted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;