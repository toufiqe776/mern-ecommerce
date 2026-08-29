import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function CheckoutAddress() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.addressLine || !form.city || !form.state || !form.pinCode) {
      alert("Please fill in all address fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/address/add", {
        ...form,
        userId,
      });
      navigate("/checkout");
    } catch (error) {
      console.error("Failed to save address", error);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider pb-4 border-b border-gray-100">
          <span className="text-indigo-600">Step 1: Shipping Address</span>
          <span>Step 2: Payment</span>
        </div>

        <div>
          <h1 className="text-2xl font-black text-gray-900">Delivery Address</h1>
          <p className="text-sm text-gray-500 mt-1">
            Where should we send your order?
          </p>
        </div>

        <form onSubmit={saveAddress} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Full Name</label>
            <input
              name="fullName"
              placeholder="e.g. Alex Johnson"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="e.g. +1 555-0199"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Street Address</label>
            <input
              name="addressLine"
              placeholder="House/Apartment #, Street name"
              value={form.addressLine}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">City</label>
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">State / Region</label>
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Postal / ZIP</label>
              <input
                name="pinCode"
                placeholder="ZIP Code"
                value={form.pinCode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition transform active:scale-98 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Continue to Payment →"}
            </button>
            <Link
              to="/cart"
              className="text-center text-xs font-semibold text-gray-400 hover:text-gray-600 py-1"
            >
              ← Back to Cart
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

