import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load cart data
  const loadCart = async () => {
    try {
      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Remove item
  const removeItem = async (productId) => {
    try {
      await api.post("/cart/remove", {
        userId,
        productId,
      });

      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Update quantity
  const updateQty = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      await api.post("/cart/update", {
        userId,
        productId,
        quantity,
      });

      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <span className="text-6xl mb-4">🔒</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Sign In</h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          You need to be logged in to view and manage your shopping cart.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center py-24">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your cart items…</p>
      </div>
    );
  }

  const validItems = (cart?.items || []).filter((item) => item?.productId);
  const subtotal = validItems.reduce(
    (sum, item) => sum + (item?.productId?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const grandTotal = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
          Shopping Cart ({validItems.length})
        </h1>

        {validItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto space-y-4">
            <span className="text-6xl block">🛒</span>
            <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
            <p className="text-sm text-gray-500">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 hover:opacity-95 transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (8 cols on desktop) */}
            <div className="lg:col-span-8 space-y-4">
              {validItems.map((item) => (
                <div
                  key={item.productId._id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:shadow-md"
                >
                  {/* Image & Title */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100">
                      <img
                        src={item.productId.image || "https://placehold.co/100"}
                        alt={item.productId.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/100";
                        }}
                      />
                    </div>
                    <div>
                      <Link
                        to={`/product/${item.productId._id}`}
                        className="font-bold text-gray-900 text-sm sm:text-base hover:text-indigo-600 transition line-clamp-1"
                      >
                        {item.productId.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Category: {item.productId.category || "General"}
                      </p>
                      <p className="text-sm font-extrabold text-indigo-600 sm:hidden mt-1">
                        ${Number(item.productId.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                      <button
                        onClick={() =>
                          updateQty(item.productId._id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-lg bg-white shadow-xs font-bold text-gray-600 hover:bg-gray-100 flex items-center justify-center transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.productId._id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-lg bg-white shadow-xs font-bold text-gray-600 hover:bg-gray-100 flex items-center justify-center transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Price Desktop */}
                    <div className="text-right min-w-[70px]">
                      <p className="text-base font-black text-gray-900">
                        $
                        {(
                          (item.productId.price || 0) * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeItem(item.productId._id)}
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (4 cols on desktop) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {subtotal < 50 && (
                  <p className="text-[11px] text-indigo-600 bg-indigo-50 p-2 rounded-lg font-medium">
                    💡 Add ${(50 - subtotal).toFixed(2)} more to qualify for Free Shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout-address")}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition transform active:scale-98"
              >
                Proceed to Checkout →
              </button>

              <Link
                to="/"
                className="block text-center text-xs font-semibold text-gray-500 hover:text-indigo-600 transition pt-1"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

