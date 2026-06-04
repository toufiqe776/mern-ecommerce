import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");


  const loadProducts = async () => {
  try {
    const res = await api.get(
      `/products?search=${search}&category=${category}`
    );

    // Always keep products as an array
    const data = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.products)
      ? res.data.products
      : [];

    setProducts(data);
  } catch (error) {
    console.error("Error loading products:", error);
    setProducts([]);
  }
};

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  // Add to cart
  const addToCart = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please login to add items to cart");
        return;
      }

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

      alert("Product added to cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Search & Filter */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search Products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Laptop">Laptop</option>
          <option value="Fashion">Fashion</option>
          <option value="Mobile">Mobile</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-3 rounded shadow hover:shadow-lg transition"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain bg-white rounded p-4"
              />

              <h2 className="mt-2 font-semibold text-lg">
                {product.title}
              </h2>

              <p className="text-gray-600">${product.price}</p>
            </Link>

            <button
              onClick={() => addToCart(product._id)}
              className="mt-3 w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}