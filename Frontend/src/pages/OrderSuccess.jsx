import { useParams, Link } from "react-router";
import { useState } from "react";

export default function OrderSuccess() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const copyOrderId = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm text-center space-y-6">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce">
          ✓
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Order Placed!
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Thank you for shopping with us! We have received your order and are preparing it for shipment.
          </p>
        </div>

        {/* Order ID Box */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 flex items-center justify-between gap-2">
          <div className="text-left overflow-hidden">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order ID</span>
            <span className="text-xs font-mono font-bold text-gray-800 truncate block max-w-[220px]">
              {id || "N/A"}
            </span>
          </div>
          <button
            onClick={copyOrderId}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 shrink-0"
          >
            {copied ? "Copied! ✓" : "Copy"}
          </button>
        </div>

        {/* Info list */}
        <div className="text-xs text-gray-500 space-y-2 text-left bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
          <div className="flex items-center gap-2">
            <span>📦</span> <strong>Payment Method:</strong> Cash on Delivery (COD)
          </div>
          <div className="flex items-center gap-2">
            <span>🚚</span> <strong>Estimated Delivery:</strong> 3-5 Business Days
          </div>
        </div>

        <Link
          to="/"
          className="block w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition transform active:scale-98 text-sm"
        >
          Continue Shopping 🛍️
        </Link>
      </div>
    </div>
  );
}

