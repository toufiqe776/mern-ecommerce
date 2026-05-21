import { useEffect, useState } from "react";
import {api} from "../api/axios";
import {
  useNavigate,
  useParams,
} from "react-router";

export default function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const allowedFields = [
    "title",
    "description",
    "price",
    "category",
    "image",
    "stock",
  ];

  // Load Product
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);

        // Safe data handling
        setForm({
          title: res.data?.title || "",
          description:
            res.data?.description || "",
          price: res.data?.price || "",
          category: res.data?.category || "",
          image: res.data?.image || "",
          stock: res.data?.stock || "",
        });
      } catch (err) {
        console.error(
          "Error loading product:",
          err
        );
      }
    };

    loadProduct();
  }, [id]);

  // Handle Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/products/update/${id}`,
        form
      );

      alert("Product updated successfully");

      navigate("/admin/products");
    } catch (err) {
      console.error(
        "Error updating product:",
        err
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          {allowedFields.map((key) => (
            <input
              key={key}
              type={
                key === "price" ||
                key === "stock"
                  ? "number"
                  : "text"
              }
              name={key}
              value={form?.[key] || ""}
              onChange={handleChange}
              placeholder={key}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}