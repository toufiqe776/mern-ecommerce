import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/product.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;

    console.log("REQ BODY:", req.body);

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    console.log("CART:", JSON.stringify(cart, null, 2));

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = cart.items.map((item) => {
      if (!item.productId) {
        throw new Error(
          "A product in the cart no longer exists in database"
        );
      }

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId,
      items: orderItems,
      address,
      totalAmount,
      paymentMethod: "COD",
    });

    await Cart.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      name: error.name,
    });
  }
};