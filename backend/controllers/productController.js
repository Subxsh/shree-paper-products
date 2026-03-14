const Product = require('../models/Product');

// Get all products with filters
exports.getAllProducts = async (req, res) => {
  try {
    const { coneDegree, color, material, threadCompatibility, search } = req.query;
    let filter = {};

    if (coneDegree) filter.coneDegree = coneDegree;
    if (color) filter.color = color;
    if (material) filter.material = material;
    if (threadCompatibility) filter.threadCompatibility = threadCompatibility;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product statistics
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalStock = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: '$stock' } } }
    ]);

    const productsByDegree = await Product.aggregate([
      { $group: { _id: '$coneDegree', count: { $sum: 1 } } }
    ]);

    const productsByColor = await Product.aggregate([
      { $group: { _id: '$color', count: { $sum: 1 } } }
    ]);

    res.json({
      totalProducts,
      totalStock: totalStock[0]?.totalStock || 0,
      productsByDegree,
      productsByColor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
