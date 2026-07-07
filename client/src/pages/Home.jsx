import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const cakes = [
  { name: "Chocolate Dream", price: "₹899", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=60" },
  { name: "Strawberry Delight", price: "₹999", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=60" },
  { name: "Creamy Pastry", price: "₹499", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=60" },
];

const testimonials = [
  { name: "Priya S.", text: "Best birthday cake I've ever ordered! Super fresh and delicious.", stars: 5 },
  { name: "Rahul M.", text: "The custom cake for our wedding was absolutely stunning!", stars: 5 },
  { name: "Sneha K.", text: "Fast delivery and amazing taste. Will order again!", stars: 5 },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOrderNow = useCallback(() => {
    if (user) {
      navigate("/order");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
      <Navbar />

      {/* WELCOME BANNER - shown only when logged in */}
      {user && (
        <div className="px-6 lg:px-20 pt-6">
          <div className="rounded-2xl px-6 py-4 flex items-center gap-4"
            style={{ backgroundColor: "#FEF3C7", border: "2px solid #D97706" }}>
            <span className="text-3xl">👋</span>
            <div>
              <p className="font-bold text-lg" style={{ color: "#1C0A00" }}>
                Welcome back, {user.name}!
              </p>
              <p className="text-sm" style={{ color: "#92400E" }}>
                Ready to order something delicious today? 🎂
              </p>
            </div>
            <button
              onClick={handleOrderNow}
              className="ml-auto px-5 py-2 rounded-xl font-bold text-white"
              style={{ backgroundColor: "#92400E" }}>
              Order Now
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="px-6 lg:px-20 py-16 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-semibold mb-4 tracking-widest" style={{ color: "#92400E" }}>
              PREMIUM PASTRY SHOP
            </p>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
              style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
              Delicious Cakes
              <span className="block mt-2" style={{ color: "#92400E" }}>
                Crafted with Love
              </span>
            </h1>
            <p className="text-lg mb-10 leading-relaxed max-w-xl" style={{ color: "#7C2D12" }}>
              Freshly baked cakes and pastries made with premium ingredients
              for birthdays, weddings and every beautiful celebration.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button onClick={handleOrderNow}
                className="px-10 py-5 rounded-2xl font-semibold text-lg text-white shadow-lg transition-all hover:scale-105"
                style={{ backgroundColor: "#92400E" }}>
                Order Now 🍰
              </button>
              <button onClick={() => navigate("/custom-cake")}
                className="px-10 py-5 rounded-2xl font-semibold text-lg transition-all hover:scale-105"
                style={{ border: "2px solid #92400E", color: "#92400E" }}>
                Custom Cake 🎨
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-14 flex-wrap">
              {[
                { value: "5000+", label: "Happy Customers" },
                { value: "120+", label: "Cake Designs" },
                { value: "4.9★", label: "Customer Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <h2 className="text-3xl font-bold" style={{ color: "#92400E" }}>{stat.value}</h2>
                  <p style={{ color: "#7C2D12" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full opacity-20"
              style={{ backgroundColor: "#D97706" }} />
            <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full opacity-20"
              style={{ backgroundColor: "#92400E" }} />
            <img
              src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=75"
              alt="Cake"
              loading="lazy"
              className="rounded-[40px] shadow-2xl object-cover relative z-10"
              style={{ height: "550px", width: "100%" }}
            />
            <div className="absolute bottom-8 left-8 bg-white px-6 py-4 rounded-2xl shadow-xl z-20">
              <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
                🎉 Freshly Baked Everyday
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 lg:px-20 py-16" style={{ backgroundColor: "#FEF3C7" }}>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
            How It Works
          </h2>
          <p style={{ color: "#7C2D12" }}>Order your dream cake in 3 simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: "🍰", title: "Choose Your Cake", desc: "Browse our wide collection of cakes and pastries" },
            { step: "02", icon: "🛒", title: "Add to Cart", desc: "Select your favorites and add them to your cart" },
            { step: "03", icon: "🚚", title: "Get Delivered", desc: "We deliver fresh to your doorstep on time" },
          ].map((item) => (
            <div key={item.step} className="text-center p-8 rounded-3xl bg-white shadow-md">
              <div className="text-5xl mb-4">{item.icon}</div>
              <div className="text-sm font-bold mb-2" style={{ color: "#D97706" }}>STEP {item.step}</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#1C0A00" }}>{item.title}</h3>
              <p style={{ color: "#7C2D12" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 lg:px-20 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
            Our Categories
          </h2>
          <p style={{ color: "#7C2D12" }}>Choose your favorite sweet delight</p>
        </div>
        <div className="flex flex-wrap gap-5 justify-center">
          {["🎂 Birthday Cakes", "💒 Wedding Cakes", "🧁 Cup Cakes", "🍫 Chocolates", "🥐 Pastries"].map((item) => (
            <button key={item} onClick={handleOrderNow}
              className="px-8 py-5 rounded-3xl font-semibold shadow-sm hover:scale-105 transition-all"
              style={{ backgroundColor: "#EAD7C3", color: "#7C2D12" }}>
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED CAKES */}
      <section className="px-6 lg:px-20 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
              Featured Cakes
            </h2>
            <p className="mt-2" style={{ color: "#7C2D12" }}>Handpicked customer favorites</p>
          </div>
          <button onClick={handleOrderNow} className="font-semibold" style={{ color: "#92400E" }}>
            View All →
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {cakes.map((cake) => (
            <div key={cake.name}
              className="bg-white rounded-[30px] overflow-hidden shadow-lg hover:-translate-y-3 transition-all duration-300">
              <img src={cake.image} alt={cake.name} loading="lazy"
                className="h-64 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3" style={{ color: "#1C0A00" }}>{cake.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-2xl" style={{ color: "#92400E" }}>{cake.price}</p>
                  <button onClick={handleOrderNow}
                    className="text-white px-5 py-2 rounded-xl transition-all"
                    style={{ backgroundColor: "#92400E" }}>
                    Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 lg:px-20 py-16" style={{ backgroundColor: "#FEF3C7" }}>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3" style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
            What Our Customers Say
          </h2>
          <p style={{ color: "#7C2D12" }}>Real reviews from happy customers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white p-8 rounded-3xl shadow-md">
              <div className="flex mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="mb-6 leading-relaxed" style={{ color: "#7C2D12" }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: "#92400E" }}>
                  {t.name[0]}
                </div>
                <p className="font-bold" style={{ color: "#1C0A00" }}>{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OFFER BANNER */}
      <section className="px-6 lg:px-20 py-10">
        <div className="rounded-[40px] p-10 lg:p-14 text-white flex flex-col lg:flex-row items-center justify-between gap-10"
          style={{ backgroundColor: "#92400E" }}>
          <div>
            <p className="mb-3 font-semibold tracking-widest" style={{ color: "#FDE68A" }}>SPECIAL OFFER</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>
              20% OFF On Custom Cakes
            </h2>
            <p className="text-lg" style={{ color: "#FDE68A" }}>
              Celebrate your special moments with sweetness and elegance.
            </p>
          </div>
          <button onClick={handleOrderNow}
            className="bg-white font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all"
            style={{ color: "#92400E" }}>
            Order Today
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 py-14 px-6 lg:px-20" style={{ backgroundColor: "#2A1E1A" }}>
        <div className="grid md:grid-cols-3 gap-12 text-white">
          <div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>
              🎂 Pastry Palace
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Fresh cakes & pastries crafted with premium ingredients and love.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-5">Quick Links</h3>
            <div className="space-y-3 text-gray-300">
              <p className="cursor-pointer hover:text-white" onClick={() => navigate("/")}>Home</p>
              <p className="cursor-pointer hover:text-white" onClick={handleOrderNow}>Orders</p>
              <p className="cursor-pointer hover:text-white" onClick={() => navigate("/cart")}>Cart</p>
              <p className="cursor-pointer hover:text-white" onClick={() => navigate("/custom-cake")}>Custom Cake</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-5">Contact</h3>
            <div className="space-y-3 text-gray-300">
              <p>📍 Chennai, India</p>
              <p>📞 +91 9876543210</p>
              <p>📧 pastry@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400">
          © 2026 Pastry Palace. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;