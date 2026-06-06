import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  // Load cart data
  const loadCart = async () => {
    try {
      if (!userId) return;

      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Remove item
  const removeItem = async (productId) => {
    try {
      await api.post("/cart/remove", {
        userId,
        productId,
      });

      await loadCart();

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Error removing item:",
        error
      );
    }
  };

  // Update quantity
  const updateQty = async (
    productId,
    quantity
  ) => {
    try {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      await api.post("/cart/update", {
        userId,
        productId,
        quantity,
      });

      await loadCart();

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error
      );
    }
  };

  // Loading state
  if (!cart) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        Loading cart...
      </div>
    );
  }

  // Filter invalid products
  const validItems = (
    cart?.items || []
  ).filter((item) => item?.productId);

  // Calculate total
  const total = validItems.reduce(
    (sum, item) =>
      sum +
      (item?.productId?.price || 0) *
        item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Your Cart
      </h1>

      {validItems.length === 0 ? (
        <div className="text-center text-gray-600">
          Your Cart is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {validItems.map((item) => (
            <div
              key={item.productId._id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.productId.image ||
                    "https://via.placeholder.com/100"
                  }
                  alt={
                    item.productId.title
                  }
                  className="w-16 h-16 object-cover rounded"
                />

                <div>
                  <h2 className="text-lg font-semibold">
                    {
                      item.productId.title
                    }
                  </h2>

                  <p className="text-gray-600">
                    $
                    {item.productId.price}
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQty(
                      item.productId._id,
                      item.quantity - 1
                    )
                  }
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>

                <span className="font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQty(
                      item.productId._id,
                      item.quantity + 1
                    )
                  }
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div>
                <p className="font-semibold">
                  $
                  {(
                    item.productId
                      .price *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() =>
                  removeItem(
                    item.productId._id
                  )
                }
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Cart Total */}
          <div className="text-right text-2xl font-bold mt-6">
            Total: $
            {total.toFixed(2)}
          </div>

          {/* Checkout */}
          <button
            onClick={() =>
              navigate(
                "/checkout-address"
              )
            }
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}