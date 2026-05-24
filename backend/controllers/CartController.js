import Cart from '../models/Cart.js';

//add item to cart  

export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });

    // Create new cart
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
      // Find existing item
      const item = cart.items.find(
        (i) =>
          i.productId.toString() === productId
      );

      // If item exists increase quantity
      if (item) {
        item.quantity += 1;
      } else {
        // Add new item
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
    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Remove item from cart 

export const removeItem = async (
  req,
  res
) => {
  try {
    const { userId, productId } =
      req.body;

    // Find cart
    const cart = await Cart.findOne({
      userId,
    });

    // Cart not found
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // Remove item
    cart.items = cart.items.filter(
      (i) =>
        i.productId.toString() !==
        productId
    );

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart",
      
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update item quantity in cart 

export const updateQuantity = async(req,res) =>{
    try{
        const {userId, productId, quantity} =req.body ;
        const cart =await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message:"cart not found"});

        }
        const item =cart.items.find(
            i => i.productId.toString() ===productId
        );
        if(!item){
            return res.status(404).json({message:"Item not found in cart"});

        }
        item.quantity=quantity;
        await cart.save();
        res.json({
            message:"item qunatity updated",
            cart
        });

    }catch(error){
        res.status(500).json({message:"server Error",error});
    }
}

//Gte cart by user id 

export const getCart = async(req,res) =>{
    try{
        const {userId} =req.params;
        const cart = await Cart.findOne({userId}).populate('items.productId');
        res.json(cart);

    }catch(error){
        res.status(500).json({message:"Server Error", error});
    }
}