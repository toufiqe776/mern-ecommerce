import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/products/add", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      });
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Add New Product</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Fill in the details to list a new item in the store.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Product Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. MacBook Pro 16-inch M3"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Detailed description of features and specs"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="99.99"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                required
              >
                <option value="">Select Category</option>
                <option value="Laptop">Laptop</option>
                <option value="Mobile">Mobile</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Image URL</label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
          </div>

          {/* Image Preview if available */}
          {form.image && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center gap-3">
              <img
                src={form.image}
                alt="Preview"
                className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-gray-200"
                onError={(e) => {
                  e.target.src = "https://placehold.co/100?text=Invalid+Image";
                }}
              />
              <span className="text-xs text-gray-500">Image Preview</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition transform active:scale-98 disabled:opacity-50"
            >
              {loading ? "Publishing Product…" : "Publish Product →"}
            </button>
            <Link
              to="/admin/products"
              className="text-center text-xs font-semibold text-gray-400 hover:text-gray-600 py-1"
            >
              ← Cancel and Return to Inventory
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

