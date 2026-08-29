import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router";

export default function Checkout() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!userId) {
          navigate("/");
          return;
        }

        const cartRes = await api.get(`/cart/${userId}`);
        setCart(cartRes.data);

        const addressRes = await api.get(`/address/${userId}`);
        setAddresses(addressRes.data || []);

        if (addressRes.data?.length > 0) {
          setSelectedAddress(addressRes.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [userId, navigate]);

  const placeOrder = async () => {
    try {
      const res = await api.post("/order/place", {
        userId,
        address: selectedAddress,
      });

      navigate(`/order-success/${res.data.orderId}`);
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to place order"
      );
    }
  };

  if (!cart) {
    return <div>Loading...</div>;
  }

  const total = (cart.items || []).reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (item.productId?.price || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Checkout
      </h1>

      <h2 className="font-semibold mb-2">
        Select Address
      </h2>

      {addresses.map((addr) => (
        <label
          key={addr._id}
          className="block border p-3 rounded mb-2"
        >
          <input
            type="radio"
            name="address"
            checked={
              selectedAddress?._id === addr._id
            }
            onChange={() =>
              setSelectedAddress(addr)
            }
            className="mr-2"
          />

          <strong>{addr.fullName}</strong>

          <p>
            {addr.addressLine}, {addr.city},{" "}
            {addr.state} - {addr.pinCode}
          </p>

          <p>{addr.phone}</p>
        </label>
      ))}

      <h2 className="font-semibold mt-4">
        Order Summary
      </h2>

      <p>Total Amount: ${total}</p>

      <button
        onClick={placeOrder}
        className="mt-4 w-full bg-green-600 text-white p-2 rounded"
      >
        Place Order (COD)
      </button>
    </div>
  );
}