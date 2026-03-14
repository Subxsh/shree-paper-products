const CustomOrder = require('../models/CustomOrder');
const { sendCustomOrderConfirmation, sendAdminNotification } = require('../utils/emailService');

// Create a new custom order
exports.createCustomOrder = async (req, res) => {
  try {
    const customOrder = new CustomOrder(req.body);
    await customOrder.save();

    // Send confirmation email to customer
    sendCustomOrderConfirmation(customOrder);

    // Send notification email to admin
    sendAdminNotification(customOrder);

    const referenceNumber = customOrder._id.toString().slice(-8).toUpperCase();

    res.status(201).json({
      message: 'Custom order request submitted successfully',
      referenceNumber: referenceNumber,
      order: customOrder
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all custom orders (Admin only)
exports.getAllCustomOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    if (status) {
      filter.status = status;
    }

    const orders = await CustomOrder.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get custom orders for logged-in customer
exports.getMyCustomOrders = async (req, res) => {
  try {
    const customerEmail = req.user?.email?.toLowerCase();

    if (!customerEmail) {
      return res.status(400).json({ message: 'Customer email not found in token' });
    }

    const orders = await CustomOrder.find({ email: customerEmail }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single custom order
exports.getCustomOrderById = async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Custom order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update custom order status (Admin only)
exports.updateCustomOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await CustomOrder.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Custom order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete custom order (Admin only)
exports.deleteCustomOrder = async (req, res) => {
  try {
    const order = await CustomOrder.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Custom order not found' });
    }
    res.json({ message: 'Custom order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get custom order statistics (Admin only)
exports.getCustomOrderStats = async (req, res) => {
  try {
    const totalOrders = await CustomOrder.countDocuments();
    
    const ordersByStatus = await CustomOrder.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentOrders = await CustomOrder.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalOrders,
      ordersByStatus,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
