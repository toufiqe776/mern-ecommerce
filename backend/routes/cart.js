import express from 'express';
import {
    addToCart,
    removeItem,
    updateQuantity,
    getCart,

} from '../controllers/CartController.js';

const router = express.Router();

//Add item to cart 
router.post('/add',addToCart);

//Remove item from cart 
router.post('/remove',removeItem);

//updated item quantity in cart 
router.post('/update',updateQuantity);

//get user's cart 
router.get('/:userId',getCart);

export default router;


