import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { api } from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Listen for login/logout changes
  useEffect(() => {
    const handleUserChange = () => {
      setUserId(localStorage.getItem("userId"));
    };

    window.addEventListener("userChanged", handleUserChange);
    return () => {
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  // Load cart count
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (!userId) {
          setCartCount(0);
          return;
        }

        const res = await api.get(`/cart/${userId}`);
        const total = res.data.items?.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        setCartCount(total || 0);
      } catch (error) {
        console.error("Failed to load cart count", error);
      }
    };

    loadCart();

    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUserId(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition"
          >
            <span className="text-2xl">🛍️</span>
            <span>MyShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition hover:text-indigo-600 ${
                location.pathname === "/" ? "text-indigo-600" : "text-gray-600"
              }`}
            >
              Home
            </Link>

            <Link
              to="/admin/products"
              className={`text-sm font-semibold transition hover:text-indigo-600 ${
                location.pathname.startsWith("/admin")
                  ? "text-indigo-600"
                  : "text-gray-600"
              }`}
            >
              Admin Dashboard
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {userId && (
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100/80 hover:bg-indigo-50 hover:text-indigo-600 transition shadow-sm"
                title="View Cart"
              >
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {!userId ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-md shadow-indigo-500/20 transition transform active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Right Bar (Cart + Hamburger) */}
          <div className="flex items-center gap-3 md:hidden">
            {userId && (
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100"
              >
                <span className="text-lg">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <span className="text-2xl font-bold leading-none">✕</span>
              ) : (
                <span className="text-2xl font-bold leading-none">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              location.pathname === "/"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            🏠 Home
          </Link>

          <Link
            to="/admin/products"
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              location.pathname.startsWith("/admin")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            ⚙️ Admin Dashboard
          </Link>

          {userId && (
            <Link
              to="/cart"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <span>🛒 My Cart</span>
              {cartCount > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {!userId ? (
              <>
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
                >
                  Create Account
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-center py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

