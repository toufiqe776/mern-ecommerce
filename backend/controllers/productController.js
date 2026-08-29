

import Product from "../models/product.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error.message);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//get all product 


export const getProducts = async (req, res) => {
  try {

    const {search, category} =req.query;
    let filter ={};
    if(search) {
        filter.title ={ $regex: search, $options:'i'};

    }
    if(category){
        filter.category=category;
    }
    // Newest products first
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error.message);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product By ID Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//update a product 

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          // return updated document
        runValidators: true // apply schema validations
      }
    );

    // If product not found
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error.message);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
//delete a product 
// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    // Check if product exists
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
     
    });
  } catch (error) {
    console.error("Delete Product Error:", error.message);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};