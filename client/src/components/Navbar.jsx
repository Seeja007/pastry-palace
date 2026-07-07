import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 shadow-md"
      style={{ backgroundColor: "#FFFBEB", borderBottom: "2px solid #D97706" }}>
      <div className="px-6 lg:px-20 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🎂</span>
          <span className="text-2xl font-bold"
            style={{ color: "#92400E", fontFamily: "Georgia, serif" }}>
            Pastry Palace
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/"
            className="font-semibold transition-all hover:text-[#92400E]"
            style={{ color: "#1C0A00" }}>
            Home
          </Link>
          <Link to="/order"
            className="font-semibold transition-all hover:text-[#92400E]"
            style={{ color: "#1C0A00" }}>
            Orders
          </Link>
          <Link to="/custom-cake"
            className="font-semibold transition-all hover:text-[#92400E]"
            style={{ color: "#1C0A00" }}>
            Custom Cake
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <span className="text-2xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ backgroundColor: "#92400E" }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Profile or Login */}
          {user ? (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: "#92400E", color: "white" }}>
                <span className="text-lg">👤</span>
                <span className="hidden md:block max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl overflow-hidden z-50"
                    style={{ backgroundColor: "white", border: "2px solid #D97706" }}>

                    {/* User Info Header */}
                    <div className="p-4" style={{ backgroundColor: "#FEF3C7" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                          style={{ backgroundColor: "#92400E" }}>
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-base truncate"
                            style={{ color: "#1C0A00" }}>
                            {user.name}
                          </p>
                          <p className="text-xs truncate"
                            style={{ color: "#92400E" }}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">

                      {/* My Orders */}
                      <Link
                        to="/my-orders"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-[#FEF3C7]"
                        style={{ color: "#1C0A00" }}>
                        <span className="text-xl">📦</span>
                        <div>
                          <p className="font-semibold text-sm">My Orders</p>
                          <p className="text-xs" style={{ color: "#92400E" }}>
                            Track & review orders
                          </p>
                        </div>
                      </Link>

                      {/* My Cart */}
                      <Link
                        to="/cart"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-[#FEF3C7]"
                        style={{ color: "#1C0A00" }}>
                        <span className="text-xl">🛒</span>
                        <div>
                          <p className="font-semibold text-sm">My Cart</p>
                          <p className="text-xs" style={{ color: "#92400E" }}>
                            {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} in cart` : "Cart is empty"}
                          </p>
                        </div>
                      </Link>

                      {/* Custom Cake */}
                      <Link
                        to="/custom-cake"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-[#FEF3C7]"
                        style={{ color: "#1C0A00" }}>
                        <span className="text-xl">🎨</span>
                        <div>
                          <p className="font-semibold text-sm">Custom Cake</p>
                          <p className="text-xs" style={{ color: "#92400E" }}>
                            Design your dream cake
                          </p>
                        </div>
                      </Link>

                      {/* Divider */}
                      <div className="my-2 mx-2 border-t"
                        style={{ borderColor: "#EAD7C3" }} />

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-50">
                        <span className="text-xl">🚪</span>
                        <div className="text-left">
                          <p className="font-semibold text-sm text-red-600">Logout</p>
                          <p className="text-xs text-red-400">Sign out of account</p>
                        </div>
                      </button>

                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login"
              className="px-5 py-2 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{ backgroundColor: "#92400E" }}>
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "#92400E" }}>
            ☰
          </button>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2"
          style={{ borderTop: "1px solid #EAD7C3" }}>
          <Link to="/" onClick={() => setMenuOpen(false)}
            className="block py-2 font-semibold"
            style={{ color: "#1C0A00" }}>
            🏠 Home
          </Link>
          <Link to="/order" onClick={() => setMenuOpen(false)}
            className="block py-2 font-semibold"
            style={{ color: "#1C0A00" }}>
            🍰 Orders
          </Link>
          <Link to="/custom-cake" onClick={() => setMenuOpen(false)}
            className="block py-2 font-semibold"
            style={{ color: "#1C0A00" }}>
            🎨 Custom Cake
          </Link>
          {user && (
            <Link to="/my-orders" onClick={() => setMenuOpen(false)}
              className="block py-2 font-semibold"
              style={{ color: "#1C0A00" }}>
              📦 My Orders
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;