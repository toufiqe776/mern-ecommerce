import Order from "../models/Order";
import Cart from "../model/Cart.js";
import Product from '../models/product.js';

export const placeOrder = async (req, res) =>{
    try{
     const {userId, address} =req.body;
     //get cart 
     const cart =await Cart.findOne({userId}).populate('items.productId');
     if(!cart || cart.items.length === 0){
        return res.status(400).json({message:"Cart is empty!"});

     }
     //prepare order items

     const orderItems = cart.items.map(item =>(
        {
            productId:item.productId._id,
            quantity:item.quantity,
            price:item.productid.price,
        }
     ));

     //calculate total amount 
      const totalAmount = orderItems.reduce((total , item) => total +(item.price * item.quantity),0);
      //deduct stock from product 
      for(let item of cart.items){
        await Product.findByIdAndUpdate(item.productId._id,{$inc:{stock: -item.quantity}});
      }
      //create order 
      const order = await Order.create({
        userId,
        items:orderItems,
        address,
        totalAmount,
        paymentMethod:"COD",
      });
      //clear cart 
      await Cart.findByIdAndUpdate({userId}, {items:[]});
      res.status(200).json({message:"Order placed successfully ", orderId:order._id});
    }catch(error){
        res.status(500).json({message:"Internal server error",error});
    }
}