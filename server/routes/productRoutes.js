const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const protect = require("../middleware/auth"); // Import auth middleware if needed

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new product
router.post("/", async (req, res) => {
  try {
    const { name, price, category, image, stock } = req.body;
    const product = new Product({ name, price, category, image, stock });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete a product
router.delete("/:id", async (req, res) => {
   const { id}  = req.params;
   try{
    const product = await Product.findByIdAndDelete(id);
    if(!product) {
      res.status(404).json({message: "Product not found"});
    }
    res.status(200).json({
      message: "Product deleted successfully",
      product
    });
   }catch (err) {
    res.status(500).json({ 
      error: err.message,
    });
   }
});

//updating a product
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, category, image, stock} = req.body;
  try {
    const product = await Product.findByIdAndUpdate(id, 
      { name, price, category, image, stock},
      { new: true, runValidators: true}
    );
    if(!product) {
      return res.status(404).json({
        message: "Product not found"
      })
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;