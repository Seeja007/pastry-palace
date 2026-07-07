import { useState, useMemo, useCallback } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const cakesData = [
  // BIRTHDAY CAKES (8)
  { id: 1, name: "Chocolate Birthday Cake", category: "Birthday Cake", price: 899, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=60" },
  { id: 2, name: "Strawberry Birthday Cake", category: "Birthday Cake", price: 999, image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=300&q=60" },
  { id: 3, name: "Black Forest Cake", category: "Birthday Cake", price: 1099, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&q=60" },
  { id: 4, name: "Vanilla Cream Cake", category: "Birthday Cake", price: 799, image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&q=60" },
  { id: 5, name: "Rainbow Layer Cake", category: "Birthday Cake", price: 1299, image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=300&q=60" },
  { id: 6, name: "KitKat Chocolate Cake", category: "Birthday Cake", price: 1499, image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=300&q=60" },
  { id: 7, name: "Blueberry Cake", category: "Birthday Cake", price: 1199, image: "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=300&q=60" },
  { id: 8, name: "Pineapple Cake", category: "Birthday Cake", price: 899, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=60" },

  // WEDDING CAKES (8)
  { id: 9, name: "Elegant White Wedding Cake", category: "Wedding Cake", price: 4999, image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=300&q=60" },
  { id: 10, name: "Luxury Tiered Wedding Cake", category: "Wedding Cake", price: 6999, image: "https://images.unsplash.com/photo-1522767131594-6b7e96848fba?w=300&q=60" },
  { id: 11, name: "Rose Wedding Cake", category: "Wedding Cake", price: 6499, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&q=60" },
  { id: 12, name: "Royal Gold Wedding Cake", category: "Wedding Cake", price: 8999, image: "https://images.unsplash.com/photo-1547050605-2870a9a14f76?w=300&q=60" },
  { id: 13, name: "Floral Wedding Cake", category: "Wedding Cake", price: 7499, image: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=300&q=60" },
  { id: 14, name: "Classic White Wedding Cake", category: "Wedding Cake", price: 5499, image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=300&q=60" },
  { id: 15, name: "Chocolate Wedding Cake", category: "Wedding Cake", price: 6999, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=60" },
  { id: 16, name: "Pearl White Wedding Cake", category: "Wedding Cake", price: 7999, image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=300&q=60" },

  // CUPCAKES (8)
  { id: 17, name: "Red Velvet Cupcake", category: "Cup Cake", price: 399, image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&q=60" },
  { id: 18, name: "Chocolate Cupcake", category: "Cup Cake", price: 299, image: "https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=300&q=60" },
  { id: 19, name: "Vanilla Frosted Cupcake", category: "Cup Cake", price: 249, image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=300&q=60" },
  { id: 20, name: "Rainbow Cupcake", category: "Cup Cake", price: 349, image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=300&q=60" },
  { id: 21, name: "Strawberry Cupcake", category: "Cup Cake", price: 299, image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=300&q=60" },
  { id: 22, name: "Lemon Cupcake", category: "Cup Cake", price: 279, image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=300&q=60" },
  { id: 23, name: "Oreo Cream Cupcake", category: "Cup Cake", price: 399, image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=300&q=60" },
  { id: 24, name: "Blueberry Cupcake", category: "Cup Cake", price: 329, image: "https://images.unsplash.com/photo-1558024920-b41e1887dc32?w=300&q=60" },

  // PASTRIES (8)
  { id: 25, name: "Chocolate Pastry", category: "Pastry", price: 199, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=60" },
  { id: 26, name: "Vanilla Cream Pastry", category: "Pastry", price: 179, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=60" },
  { id: 27, name: "Strawberry Pastry", category: "Pastry", price: 249, image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&q=60" },
  { id: 28, name: "Black Forest Pastry", category: "Pastry", price: 259, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&q=60" },
  { id: 29, name: "Butterscotch Pastry", category: "Pastry", price: 219, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=60" },
  { id: 30, name: "Mango Pastry", category: "Pastry", price: 229, image: "https://images.unsplash.com/photo-1587334207876-0f22b0f9d4d0?w=300&q=60" },
  { id: 31, name: "Pineapple Pastry", category: "Pastry", price: 199, image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&q=60" },
  { id: 32, name: "Red Velvet Pastry", category: "Pastry", price: 269, image: "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=300&q=60" },

  // DONUTS (8)
  { id: 33, name: "Chocolate Glazed Donut", category: "Donut", price: 149, image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=60" },
  { id: 34, name: "Strawberry Frosted Donut", category: "Donut", price: 159, image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&q=60" },
  { id: 35, name: "Classic Cream Donut", category: "Donut", price: 139, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=300&q=60" },
  { id: 36, name: "Nutella Filled Donut", category: "Donut", price: 179, image: "https://images.unsplash.com/photo-1556913396-7a3c459ef68e?w=300&q=60" },
  { id: 37, name: "Vanilla Sprinkle Donut", category: "Donut", price: 149, image: "https://images.unsplash.com/photo-1534432182912-63863115e106?w=300&q=60" },
  { id: 38, name: "Rainbow Sprinkle Donut", category: "Donut", price: 169, image: "https://images.unsplash.com/photo-1619531040576-f9416740661e?w=300&q=60" },
  { id: 39, name: "Caramel Donut", category: "Donut", price: 159, image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=300&q=60" },
  { id: 40, name: "Blueberry Glazed Donut", category: "Donut", price: 169, image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=300&q=60" },
];

const categories = ["All", "Birthday Cake", "Wedding Cake", "Cup Cake", "Pastry", "Donut"];

const CakeCard = ({ cake, onAdd, added }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
    <div className="relative">
      <img
        src={cake.image}
        alt={cake.name}
        loading="lazy"
        className="h-44 w-full object-cover"
      />
      <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-semibold"
        style={{ backgroundColor: "#FDE68A", color: "#92400E" }}>
        {cake.category}
      </span>
    </div>
    <div className="p-4">
      <h2 className="font-bold mb-3 text-sm leading-tight" style={{ color: "#1C0A00", minHeight: "36px" }}>
        {cake.name}
      </h2>
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg" style={{ color: "#92400E" }}>₹{cake.price}</p>
        <button
          onClick={() => onAdd(cake)}
          className="text-xs px-4 py-2 rounded-xl font-semibold text-white transition-all duration-300"
          style={{ backgroundColor: added ? "#16A34A" : "#92400E" }}>
          {added ? "✓ Added!" : "+ Cart"}
        </button>
      </div>
    </div>
  </div>
);

const OrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedItems, setAddedItems] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const filteredCakes = useMemo(() =>
    selectedCategory === "All"
      ? cakesData
      : cakesData.filter((c) => c.category === selectedCategory),
    [selectedCategory]
  );

  const handleAdd = useCallback((cake) => {
    addToCart({ ...cake, _id: cake.id });
    setAddedItems((prev) => ({ ...prev, [cake.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [cake.id]: false }));
    }, 1500);
  }, [addToCart]);

  return (
    <div style={{ backgroundColor: "#FDF8F0", minHeight: "100vh" }}>
      <Navbar />

      <section className="px-6 lg:px-16 py-12">
        {/* HEADER */}
        <div className="text-center mb-10">
          <p className="font-semibold tracking-widest mb-2" style={{ color: "#92400E" }}>
            ORDER YOUR FAVORITE
          </p>
          <h1 className="text-4xl font-bold mb-3"
            style={{ color: "#1C0A00", fontFamily: "Georgia, serif" }}>
            Cakes & Pastries
          </h1>
          <p style={{ color: "#7C2D12" }}>Freshly baked happiness delivered to your doorstep 🍰</p>
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-5 py-2 rounded-2xl font-semibold transition-all text-sm"
              style={{
                backgroundColor: selectedCategory === cat ? "#92400E" : "#EAD7C3",
                color: selectedCategory === cat ? "white" : "#7C2D12",
                boxShadow: selectedCategory === cat ? "0 4px 12px rgba(146,64,14,0.3)" : "none"
              }}>
              {cat === "All" && "🍽️ "}{cat === "Birthday Cake" && "🎂 "}{cat === "Wedding Cake" && "💒 "}
              {cat === "Cup Cake" && "🧁 "}{cat === "Pastry" && "🥐 "}{cat === "Donut" && "🍩 "}
              {cat}
            </button>
          ))}
        </div>

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
            Showing {filteredCakes.length} items
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="px-5 py-2 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105"
            style={{ backgroundColor: "#92400E" }}>
            🛒 View Cart
          </button>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {filteredCakes.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              onAdd={handleAdd}
              added={!!addedItems[cake.id]}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default OrderPage;