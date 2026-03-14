const Order = require('../models/Order');
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate unique PO number
const generatePONumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
  return `PO-${dateStr}-${random}`;
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    let query = Order.find();

    // If user is not admin, only show their orders
    if (req.user.role !== 'admin') {
      query = query.where('userId').equals(req.user.id);
    }

    const orders = await query
      .populate('items.productId')
      .populate('userId', 'name email company phone')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId')
      .populate('createdBy', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, customerName, gstNumber, ...otherData } = req.body;

    // Calculate totals
    let basicTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;

    const processedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        const itemBasic = item.quantity * item.rate;
        const itemCGST = itemBasic * (item.cgst / 100);
        const itemSGST = itemBasic * (item.sgst / 100);
        const itemTotal = itemBasic + itemCGST + itemSGST;

        basicTotal += itemBasic;
        cgstTotal += itemCGST;
        sgstTotal += itemSGST;

        return {
          ...item,
          productName: product.name,
          total: itemTotal
        };
      })
    );

    const order = new Order({
      poNumber: generatePONumber(),
      userId: req.user?.id,
      items: processedItems,
      customerName,
      gstNumber,
      basicTotal,
      cgstTotal,
      sgstTotal,
      grandTotal: basicTotal + cgstTotal + sgstTotal,
      createdBy: req.user?.id,
      ...otherData
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export order as PDF
exports.exportOrderPDF = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create PDF document
    const doc = new PDFDocument();
    const filename = `order-${order.poNumber}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('SHREE PAPER PRODUCTS', 50, 50);
    doc.fontSize(10).font('Helvetica').text('Paper Cone Manufacturing', 50, 75);
    doc.fontSize(9).text('Kangeyam, Tirupur, Tamilnadu, India', 50, 90);

    // Order details
    doc.fontSize(12).font('Helvetica-Bold').text('PURCHASE ORDER', 400, 50);
    doc.fontSize(10).font('Helvetica')
      .text(`PO Number: ${order.poNumber}`, 400, 75)
      .text(`Date: ${new Date(order.date).toLocaleDateString('en-IN')}`, 400, 90)
      .text(`Status: ${order.status}`, 400, 105);

    // Customer details
    doc.fontSize(11).font('Helvetica-Bold').text('Bill To:', 50, 130);
    doc.fontSize(10).font('Helvetica')
      .text(order.customerName, 50, 150)
      .text(`GST: ${order.gstNumber || 'N/A'}`, 50, 165)
      .text(`Email: ${order.email || 'N/A'}`, 50, 180)
      .text(`Phone: ${order.phone || 'N/A'}`, 50, 195);

    // Table headers
    const tableTop = 240;
    const colWidth = 80;
    doc.fontSize(10).font('Helvetica-Bold')
      .text('Description', 50, tableTop)
      .text('Qty', 200, tableTop)
      .text('Rate (₹)', 260, tableTop)
      .text('Amount (₹)', 350, tableTop);

    doc.fontSize(0.5).strokeColor('#000').moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table rows
    let rowY = tableTop + 25;
    order.items.forEach(item => {
      doc.fontSize(9).font('Helvetica')
        .text(item.productName.substring(0, 30), 50, rowY)
        .text(item.quantity.toString(), 200, rowY)
        .text(`₹${item.rate.toFixed(2)}`, 260, rowY)
        .text(`₹${item.total.toFixed(2)}`, 350, rowY);
      rowY += 20;
    });

    // Totals
    const totalsY = rowY + 10;
    doc.fontSize(0.5).strokeColor('#000').moveTo(50, totalsY).lineTo(550, totalsY).stroke();

    doc.fontSize(10).font('Helvetica-Bold')
      .text('Basic Total:', 350, totalsY + 15)
      .text(`₹${order.basicTotal.toFixed(2)}`, 480, totalsY + 15);

    doc.text('CGST (9%):', 350, totalsY + 35)
      .text(`₹${order.cgstTotal.toFixed(2)}`, 480, totalsY + 35);

    doc.text('SGST (9%):', 350, totalsY + 55)
      .text(`₹${order.sgstTotal.toFixed(2)}`, 480, totalsY + 55);

    doc.fontSize(11).font('Helvetica-Bold')
      .text('GRAND TOTAL:', 350, totalsY + 75)
      .text(`₹${order.grandTotal.toFixed(2)}`, 480, totalsY + 75);

    if (order.notes) {
      doc.fontSize(9).font('Helvetica')
        .text('Notes:', 50, totalsY + 120)
        .text(order.notes, 50, totalsY + 140);
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalValue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$grandTotal' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
          total: { $sum: '$grandTotal' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);

    res.json({
      totalOrders,
      totalValue: totalValue[0]?.total || 0,
      ordersByStatus,
      monthlyOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
