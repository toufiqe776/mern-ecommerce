import express from 'express';

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js"

const router =express.Router();

//Route to create a new product 
router.post('/add',createProduct);

//Route to get all products 
router.get('/',getProducts);

//Route to get a single product by ID
router.get('/:id',getProductById);

//Route to updated a product 
router.put('/update/:id',updateProduct);

//route to delete a product by Id
router.delete('/delete/:id',deleteProduct);

export default router;

