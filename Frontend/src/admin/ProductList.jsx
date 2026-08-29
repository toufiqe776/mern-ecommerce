import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/products/delete/${id}`);
      alert("Product deleted successfully!");
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Admin Inventory</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage store catalog, pricing and stocks</p>
          </div>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition transform active:scale-95"
          >
            <span>+</span> Add New Product
          </Link>
        </div>

        {/* Responsive Table Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading products…</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No products found in inventory.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/80 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Stock</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-3">
                        <img
                          src={product.image || "https://placehold.co/50"}
                          alt={product.title}
                          className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100 shrink-0"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/50";
                          }}
                        />
                        <span className="truncate max-w-[180px] sm:max-w-xs">{product.title}</span>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500">{product.category || "General"}</td>
                      <td className="py-4 px-6 font-bold text-gray-900">${Number(product.price).toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          product.stock > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-600"
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                        <Link
                          to={`/admin/products/update/${product._id}`}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

