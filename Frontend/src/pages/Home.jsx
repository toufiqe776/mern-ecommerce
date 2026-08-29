import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const categories = ["All", "Laptop", "Mobile", "Fashion", "Electronics", "Accessories"];

  const loadProducts = async () => {
    try {
      setLoading(true);
      const queryCategory = category === "All" ? "" : category;
      const res = await api.get(
        `/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(queryCategory)}`
      );

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.products)
        ? res.data.products
        : [];

      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  // Add to cart
  const addToCart = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please sign in to add items to your cart");
        return;
      }

      setAddingId(productId);
      const res = await api.post(`/cart/add`, {
        userId,
        productId,
      });

      const totalCount = res.data.cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      localStorage.setItem("cartCount", totalCount);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert(error?.response?.data?.message || "Failed to add item to cart");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden shadow-inner">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-pink-100">
            🔥 Big Deals Season
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Top Products at Unbeatable Prices
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 max-w-2xl mx-auto">
            From cutting-edge electronics to modern fashion, find everything curated just for you.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-lg pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-gray-50/60"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="text-xs sm:text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-800">{products.length}</span> items
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = (category === "" && cat === "All") || category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === "All" ? "" : cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse space-y-3">
                <div className="h-44 bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-9 bg-gray-200 rounded-xl mt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
            <span className="text-5xl block mb-3">📦</span>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No products found</h3>
            <p className="text-sm text-gray-500 mb-4">
              Try adjusting your search query or category filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
              }}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
              >
                <Link to={`/product/${product._id}`} className="block">
                  {/* Image container */}
                  <div className="relative w-full h-48 bg-gray-50 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-3">
                    <img
                      src={product.image || "https://placehold.co/300x300?text=Product"}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/300x300?text=No+Image";
                      }}
                    />
                    {product.category && (
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-[11px] font-bold text-indigo-600 rounded-full shadow-xs">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* Title & Info */}
                  <h2 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-indigo-600 transition mb-1">
                    {product.title}
                  </h2>

                  {product.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.stock > 0 ? (
                      <span className="text-[11px] font-semibold text-emerald-600">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-rose-500">
                        Out of stock
                      </span>
                    )}
                  </div>
                </Link>

                {/* Add to Cart button */}
                <button
                  onClick={() => addToCart(product._id)}
                  disabled={addingId === product._id}
                  className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-sm shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                >
                  {addingId === product._id ? "Adding… 🛒" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

