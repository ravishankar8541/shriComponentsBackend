const Product = require('../models/Product');

// 1. Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Get Single Product (Moved outside so it is globally accessible)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Create Product
const createProduct = async (req, res) => {
  try {
    const { name, path, description, imageMetadata } = req.body;

    if (!name || !path || !description) {
      return res.status(400).json({ message: "Name, path, and description are required" });
    }

    let imageVariants = [];
    try {
      imageVariants = imageMetadata ? JSON.parse(imageMetadata) : [];
    } catch (e) {
      return res.status(400).json({ message: "Invalid images metadata format" });
    }

    const processedImages = imageVariants.map((variant, index) => {
      const file = req.files?.[index];
      return {
        productHeading: variant.productHeading || "",
        url: file ? `/uploads/${file.filename}` : null,
        price: Number(variant.price) || 0,
        specs: variant.specs || []
      };
    });

    const newProduct = new Product({ name, path, description, images: processedImages });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, path, description, imageMetadata } = req.body;

    let incomingVariants = [];
    try {
      incomingVariants = imageMetadata ? JSON.parse(imageMetadata) : [];
    } catch (e) {
      return res.status(400).json({ message: "Invalid metadata format" });
    }

    let fileIndex = 0;
    const processedImages = incomingVariants.map((variant) => {
      let finalUrl = variant.existingUrl;

      if (!variant.existingUrl || variant.existingUrl === "null" || variant.existingUrl === "") {
        if (req.files && req.files[fileIndex]) {
          finalUrl = `/uploads/${req.files[fileIndex].filename}`;
          fileIndex++;
        }
      }

      return {
        productHeading: variant.productHeading,
        price: Number(variant.price),
        url: finalUrl,
        specs: variant.specs || []
      };
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, path, description, images: processedImages },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Delete Product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. Exports
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};