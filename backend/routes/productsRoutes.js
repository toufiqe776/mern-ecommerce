import express from 'express';

import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js"

const router =express.Router();

//Route to create a new product 
router.post('/add',createProduct);

//Route to get all products 
router.get('/',getProducts);

//Route to updated a product 
router.put('/update/:id',updateProduct);

//route to delete a product by Id
router.delete('/delete/:id',deleteProduct);

export default router;

