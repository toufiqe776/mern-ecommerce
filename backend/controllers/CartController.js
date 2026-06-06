import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
      });
    } else {
      const item = cart.items.find(
        (i) =>
          i.productId.toString() === productId
      );

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
        });
      }
    }

    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Remove item from cart
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update quantity
export const updateQuantity = async (
  req,
  res
) => {
  try {
    const {
      userId,
      productId,
      quantity,
    } = req.body;

    const cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) =>
        i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message:
          "Item not found in cart",
      });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) =>
          i.productId.toString() !==
          productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    res.status(200).json({
      message:
        "Item quantity updated",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get cart by user id
export const getCart = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    let cart = await Cart.findOne({
      userId,
    }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        userId,
        items: [],
      });
    }

    // Remove deleted products
    cart.items = cart.items.filter(
      (item) => item.productId
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};