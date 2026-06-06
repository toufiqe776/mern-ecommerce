import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router";

export default function Checkout() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!userId) {
          navigate("/");
          return;
        }

        const cartRes = await api.get(`/cart/${userId}`);
        setCart(cartRes.data);

        const addressRes = await api.get(
          `/address/${userId}`
        );

        setAddresses(addressRes.data || []);

        if (
          addressRes.data &&
          addressRes.data.length > 0
        ) {
          setSelectedAddress(addressRes.data[0]);
        }
      } catch (error) {
        console.error(
          "Error loading checkout data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, navigate]);

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        alert("Please select an address");
        return;
      }

      const res = await api.post(
        "/order/place",
        {
          userId,
          address: selectedAddress,
        }
      );

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error(
        "Error placing order:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to place order"
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        Loading...
      </div>
    );
  }

  const validItems = (
    cart?.items || []
  ).filter((item) => item?.productId);

  const total = validItems.reduce(
    (sum, item) =>
      sum +
      (item.quantity *
        (item?.productId?.price || 0)),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      {/* Address Section */}
      <h2 className="text-lg font-semibold mb-3">
        Select Address
      </h2>

      {addresses.length === 0 ? (
        <div className="border p-4 rounded">
          No address found.
          <button
            onClick={() =>
              navigate("/add-address")
            }
            className="ml-3 text-blue-600"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {addresses.map((addr) => (
            <label
              key={addr._id}
              className="block border p-3 rounded cursor-pointer"
            >
              <input
                type="radio"
                name="address"
                checked={
                  selectedAddress?._id ===
                  addr._id
                }
                onChange={() =>
                  setSelectedAddress(addr)
                }
                className="mr-2"
              />

              <strong>
                {addr.fullName}
              </strong>

              <p className="text-sm">
                {addr.addressLine},{" "}
                {addr.city},{" "}
                {addr.state} -{" "}
                {addr.pinCode}
              </p>

              <p className="text-sm">
                {addr.phone}
              </p>
            </label>
          ))}
        </div>
      )}

      {/* Order Summary */}
      <h2 className="text-lg font-semibold mb-3">
        Order Summary
      </h2>

      <div className="border rounded p-4 mb-4">
        {validItems.map((item) => (
          <div
            key={item.productId._id}
            className="flex justify-between py-2"
          >
            <span>
              {item.productId.title} ×{" "}
              {item.quantity}
            </span>

            <span>
              $
              {(
                item.productId.price *
                item.quantity
              ).toFixed(2)}
            </span>
          </div>
        ))}

        <hr className="my-3" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={placeOrder}
        disabled={!selectedAddress}
        className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        Place Order (COD)
      </button>
    </div>
  );
}