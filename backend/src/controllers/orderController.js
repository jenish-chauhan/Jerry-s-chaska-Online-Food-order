const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const FoodItem = require("../models/FoodItem");
const { emitOrderCreated, emitOrderUpdated } = require("../socket");

const normalizeOrderItem = (item, menuItemMap = new Map()) => {
  const productId = String(item.id || item._id || item.productId || "");
  const fallbackItem = productId ? menuItemMap.get(productId) : null;
  const quantity = Math.max(1, Number(item.quantity) || 1);
  const price = Number(item.price ?? fallbackItem?.price ?? 0);

  return {
    productId,
    productName:
      item.name || item.productName || fallbackItem?.name || "Menu Item",
    quantity,
    price,
    image: item.image || item.image_url || fallbackItem?.image_url || "",
  };
};

const getMenuItemMap = async (items) => {
  const validObjectIds = [
    ...new Set(
      items
        .map((item) => item.id || item._id || item.productId)
        .filter((value) => mongoose.Types.ObjectId.isValid(value))
        .map((value) => value.toString()),
    ),
  ];

  if (validObjectIds.length === 0) {
    return new Map();
  }

  const menuItems = await FoodItem.find({
    _id: { $in: validObjectIds },
  }).select("_id name price image_url");

  return new Map(
    menuItems.map((item) => [
      item._id.toString(),
      {
        name: item.name,
        price: item.price,
        image_url: item.image_url,
      },
    ]),
  );
};

const serializeOrder = (order, menuItemMap = new Map()) => ({
  id: order._id.toString(),
  orderNumber: order.orderNumber,
  userId: order.userId,
  customerName: order.customerName,
  email: order.email,
  phone: order.phone,
  items: order.items.map((item) => {
    const fallbackItem = item.productId ? menuItemMap.get(item.productId) : null;

    return {
      productId: item.productId,
      productName: item.productName || fallbackItem?.name || "Menu Item",
      quantity: Number(item.quantity) || 0,
      price: Number(item.price ?? fallbackItem?.price) || 0,
      image: item.image || fallbackItem?.image_url || "",
    };
  }),
  itemCount: order.items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0),
    0,
  ),
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

const getOrderMenuItemMap = async (orders) => {
  const validObjectIds = [
    ...new Set(
      orders
        .flatMap((order) => order.items || [])
        .map((item) => item.productId)
        .filter((value) => mongoose.Types.ObjectId.isValid(value))
        .map((value) => value.toString()),
    ),
  ];

  if (validObjectIds.length === 0) {
    return new Map();
  }

  const menuItems = await FoodItem.find({
    _id: { $in: validObjectIds },
  }).select("_id name price image_url");

  return new Map(
    menuItems.map((item) => [
      item._id.toString(),
      {
        name: item.name,
        price: item.price,
        image_url: item.image_url,
      },
    ]),
  );
};

const orderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("items.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Item quantity must be at least 1"),
  body("items.*.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Item price must be a positive number"),
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
    const menuItemMap = await getMenuItemMap(items);

    const newOrder = new Order({
      userId: req.user.id.toString(),
      customerName,
      phone,
      email,
      items: items.map((item) => normalizeOrderItem(item, menuItemMap)),
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
    const menuItemMap = await getOrderMenuItemMap(orders);

    res.json({ data: orders.map((order) => serializeOrder(order, menuItemMap)) });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const menuItemMap = await getOrderMenuItemMap(orders);

    res.json({ data: orders.map((order) => serializeOrder(order, menuItemMap)) });
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

    const menuItemMap = await getOrderMenuItemMap([order]);
    res.json({ data: serializeOrder(order, menuItemMap) });
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

    const menuItemMap = await getOrderMenuItemMap([order]);
    const serializedOrder = serializeOrder(order, menuItemMap);
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

    const menuItemMap = await getOrderMenuItemMap([order]);
    const serializedOrder = serializeOrder(order, menuItemMap);
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
