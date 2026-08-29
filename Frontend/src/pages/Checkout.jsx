import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function Checkout() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!userId) {
          navigate("/login");
          return;
        }

        const [cartRes, addressRes] = await Promise.all([
          api.get(`/cart/${userId}`),
          api.get(`/address/${userId}`),
        ]);

        setCart(cartRes.data);
        const addrs = addressRes.data || [];
        setAddresses(addrs);

        if (addrs.length > 0) {
          setSelectedAddress(addrs[0]);
        }
      } catch (error) {
        console.error("Checkout load error", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, navigate]);

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select or add a delivery address first.");
      navigate("/checkout-address");
      return;
    }

    try {
      setPlacingOrder(true);
      const res = await api.post("/order/place", {
        userId,
        address: selectedAddress,
      });

      localStorage.removeItem("cartCount");
      window.dispatchEvent(new Event("cartUpdated"));

      navigate(`/order-success/${res.data.orderId}`);
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const validItems = (cart?.items || []).filter((item) => item?.productId);
  const subtotal = validItems.reduce(
    (sum, item) => sum + item.quantity * (item.productId?.price || 0),
    0
  );
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const grandTotal = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Review & Place Order
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose your delivery address and confirm payment method.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Address + Payment Options) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Address Selection */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>📍</span> Delivery Address
                </h2>
                <Link
                  to="/checkout-address"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  + Add New Address
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-3">No saved address found.</p>
                  <Link
                    to="/checkout-address"
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs"
                  >
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress?._id === addr._id;
                    return (
                      <label
                        key={addr._id}
                        className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={isSelected}
                          onChange={() => setSelectedAddress(addr)}
                          className="mt-1 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-sm">
                          <div className="font-bold text-gray-900">
                            {addr.fullName} <span className="font-normal text-gray-500 text-xs">({addr.phone})</span>
                          </div>
                          <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                            {addr.addressLine}, {addr.city}, {addr.state} - {addr.pinCode}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>💳</span> Payment Method
              </h2>
              <div className="p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Cash on Delivery (COD)</div>
                    <div className="text-xs text-gray-500">Pay in cash upon delivery to your doorstep</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Selected
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary ({validItems.length} items)
            </h2>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {validItems.map((item) => (
                <div key={item.productId._id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 truncate max-w-[200px]">
                    <span className="font-bold text-gray-700">{item.quantity}x</span>
                    <span className="text-gray-600 truncate">{item.productId.title}</span>
                  </div>
                  <span className="font-semibold text-gray-900 shrink-0">
                    ${((item.productId.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 text-base font-bold text-gray-900">
                <span>Total Due</span>
                <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placingOrder || validItems.length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition transform active:scale-98 disabled:opacity-50 text-base flex items-center justify-center gap-2"
            >
              {placingOrder ? "Placing Order…" : "Confirm Order (COD) 🎉"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

