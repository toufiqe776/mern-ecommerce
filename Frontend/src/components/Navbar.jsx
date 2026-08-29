import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

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
        console.log(error);
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
    navigate("/");
  };

  return (
    <nav className="flex justify-between p-4 shadow">
      <Link to="/" className="font-bold text-xl">
        MyShop
      </Link>

      <div className="flex gap-4 items-center">
        {userId && (
          <Link
            to="/cart"
            className="relative flex items-center justify-center
            bg-gray-100 hover:bg-gray-200
            w-12 h-12 rounded-full text-2xl transition shadow"
          >
            🛒

            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2
                bg-red-500 text-white text-xs
                w-5 h-5 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {!userId ? (
          <>
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}