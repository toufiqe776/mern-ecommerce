import { useState } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router';

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

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
      await api.post("/products/add", form);
      alert("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg">
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Product
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type={key === "price" || key === "stock" ? "number" : "text"}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          ))}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}