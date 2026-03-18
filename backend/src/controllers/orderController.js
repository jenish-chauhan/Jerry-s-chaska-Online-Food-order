const { body, validationResult } = require("express-validator");
const Order = require("../models/Order");
const { emitOrderCreated, emitOrderUpdated } = require("../socket");

const serializeOrder = (order) => ({
  id: order._id.toString(),
  orderNumber: order.orderNumber,
  userId: order.userId,
  customerName: order.customerName,
  email: order.email,
  phone: order.phone,
  items: order.items,
  itemCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
  totalPrice: order.totalPrice,
  total_price: order.totalPrice,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  payment_status: order.paymentStatus,
  orderStatus: order.orderStatus,
  status: order.orderStatus,
  createdAt: order.createdAt,
  created_at: order.createdAt,
  updatedAt: order.updatedAt,
  updated_at: order.updatedAt,
});

const orderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body().custom((value) => {
    const totalPrice = value.totalPrice ?? value.total_price;
    if (Number.isNaN(Number(totalPrice)) || Number(totalPrice) < 0) {
      throw new Error("Total price must be a positive number");
    }
    return true;
  }),
  body("customerName").notEmpty().withMessage("Customer Name is required"),
  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone must be 10 digits"),
  body("email").isEmail().withMessage("Valid email is required"),
];

const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      customerName,
      phone,
      email,
      items,
      totalPrice,
      total_price,
      paymentMethod,
    } = req.body;

    const newOrder = new Order({
      userId: req.user.id.toString(),
      customerName,
      phone,
      email,
      items: items.map((item) => ({
        productId: item.id || item._id || item.productId,
        productName: item.name || item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      totalPrice: Number(totalPrice ?? total_price),
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    await newOrder.save();

    const serializedOrder = serializeOrder(newOrder);
    emitOrderCreated(serializedOrder);

    return res.status(201).json({
      message: "Order created successfully",
      data: serializedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id.toString();

    if (req.user.role !== "admin" && req.user.id.toString() !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ data: orders.map(serializeOrder) });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ data: orders.map(serializeOrder) });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ orderNumber: id });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (req.user.role !== "admin" && order.userId !== req.user.id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ data: serializeOrder(order) });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

const confirmPickup = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ orderNumber: id });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (req.user.role !== "admin" && order.userId !== req.user.id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (order.orderStatus !== "ready") {
      return res
        .status(400)
        .json({ error: "Only ready orders can be confirmed as collected" });
    }

    order.orderStatus = "completed";
    await order.save();

    const serializedOrder = serializeOrder(order);
    emitOrderUpdated(serializedOrder);

    return res.status(200).json({
      message: "Order marked as collected",
      data: serializedOrder,
    });
  } catch (error) {
    console.error("Confirm pickup error:", error);
    return res.status(500).json({ error: "Failed to confirm pickup" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "accepted",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderNumber: id },
      { orderStatus: status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const serializedOrder = serializeOrder(order);
    emitOrderUpdated(serializedOrder);

    return res.status(200).json({
      message: "Order status updated successfully",
      data: serializedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ error: "Failed to update order status" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  confirmPickup,
  updateOrderStatus,
  orderValidation,
};
