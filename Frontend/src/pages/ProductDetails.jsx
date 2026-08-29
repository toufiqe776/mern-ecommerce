import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useParams, useNavigate, Link } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to add products to your cart");
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      const res = await api.post("/cart/add", {
        userId,
        productId: product._id,
      });

      // Update quantity if user selected > 1
      if (quantity > 1) {
        await api.post("/cart/update", {
          userId,
          productId: product._id,
          quantity: quantity,
        });
      }

      const totalCount = res.data.cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      localStorage.setItem("cartCount", totalCount);
      window.dispatchEvent(new Event("cartUpdated"));

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (error) {
      console.error("Failed to add to cart", error);
      alert("Failed to add product to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-5xl mb-3">🔍</span>
        <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 mb-4">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <span className="text-gray-400">{product.category || "Products"}</span>
          <span>/</span>
          <span className="text-gray-800 font-semibold truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Product Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Image Gallery View */}
          <div className="w-full h-72 sm:h-96 bg-gray-50/80 rounded-2xl flex items-center justify-center p-6 border border-gray-100 relative">
            <img
              src={product.image || "https://placehold.co/400"}
              alt={product.title}
              className="w-full h-full object-contain hover:scale-105 transition duration-300"
              onError={(e) => {
                e.target.src = "https://placehold.co/400?text=No+Image";
              }}
            />
            {product.category && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                {product.category}
              </span>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                {product.title}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-3xl font-black text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  ✓ In Stock
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-100 py-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {product.description || "No description provided for this product."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 transition transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 text-base"
              >
                {adding ? "Adding to Cart…" : "🛒 Add to Cart"}
              </button>

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl text-center animate-fadeIn flex items-center justify-center gap-2">
                  <span>✅</span> Added to cart! <Link to="/cart" className="underline ml-1">View Cart</Link>
                </div>
              )}
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span>🚚</span> Free Delivery over $50
              </div>
              <div className="flex items-center gap-2">
                <span>🛡️</span> 100% Authentic Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

