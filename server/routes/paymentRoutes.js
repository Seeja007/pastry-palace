const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

// ✅ Create Stripe Session + Save Order
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const { cartItems, address } = req.body;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = Math.round(subtotal * 0.05);
    const totalPrice = subtotal + gst;

    // ✅ Save order to DB immediately
    const order = await Order.create({
      user: req.user._id,
      items: cartItems,
      address,
      paymentMethod: "stripe",
      totalPrice,
      paymentStatus: "pending",
      orderStatus: "Order Placed",
    });

    console.log("✅ Order created:", order._id);

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order-success?order_id=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    res.json({ url: session.url, orderId: order._id });
  } catch (err) {
    console.log("❌ Stripe error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Confirm Payment after Stripe redirect
router.post("/confirm-payment", protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log("Confirming payment for order:", orderId);

    const order = await Order.findById(orderId).populate("user");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    order.orderStatus = "Confirmed";
    await order.save();

    console.log("✅ Order confirmed:", order._id);

    const customerEmail = order.address?.email || order.user?.email;
    const customerName = order.address?.fullName || order.user?.name;

    // Email to owner
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "💰 New Payment - Pastry Palace",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#92400E;padding:20px;text-align:center;border-radius:10px 10px 0 0">
            <h1 style="color:white;margin:0">💰 New Order Paid!</h1>
          </div>
          <div style="padding:20px;background:#FFF9F0;">
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${order.address?.phone}</p>
            <p><strong>Total:</strong> ₹${order.totalPrice}</p>
            <p><strong>Address:</strong> ${order.address?.address}, ${order.address?.city}, ${order.address?.state}</p>
            <h3>Items:</h3>
            ${order.items?.map(i => `<p>• ${i.name} x${i.quantity} = ₹${i.price * i.quantity}</p>`).join("")}
          </div>
        </div>
      `
    });

    // Email to customer
    await sendEmail({
      to: customerEmail,
      subject: "🎂 Order Confirmed - Pastry Palace",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#92400E;padding:20px;text-align:center;border-radius:10px 10px 0 0">
            <h1 style="color:white;margin:0">🎂 Pastry Palace</h1>
          </div>
          <div style="padding:20px;background:#FFF9F0;">
            <h2>Order Confirmed! 🎉</h2>
            <p>Hi ${customerName}, payment received!</p>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Total:</strong> ₹${order.totalPrice}</p>
            <p>We'll start baking your cake! 🎂</p>
          </div>
        </div>
      `
    });

    res.json({ message: "Payment confirmed!" });
  } catch (err) {
    console.log("❌ Confirm error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;