const Order = require("../models/Order");
const User = require("../models/User");
const FoodItem = require("../models/FoodItem");

// Dashboard summary stats
const getDashboardStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      dailyOrdersResult,
      totalRevenueResult,
      totalOrdersCount,
      pendingOrdersCount,
      preparingOrdersCount,
      completedOrdersCount,
      totalUsersCount,
      activeMenuItemsCount,
      recentUsers,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$totalPrice" },
          },
        },
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "preparing" }),
      Order.countDocuments({ orderStatus: "completed" }),
      User.countDocuments({ role: "user" }),
      FoodItem.countDocuments({ available: true }),
      User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("_id name email createdAt"),
    ]);

    const dailyOrders = dailyOrdersResult[0] || { count: 0, revenue: 0 };
    const totalRevenueObj = totalRevenueResult[0] || { total: 0 };

    return res.status(200).json({
      data: {
        dailyOrders: dailyOrders.count,
        dailyRevenue: parseFloat(dailyOrders.revenue || 0),
        totalRevenue: parseFloat(totalRevenueObj.total || 0),
        totalOrders: totalOrdersCount,
        pendingOrders: pendingOrdersCount,
        preparingOrders: preparingOrdersCount,
        completedOrders: completedOrdersCount,
        totalUsers: totalUsersCount,
        activeMenuItems: activeMenuItemsCount,
        recentUsers: recentUsers.map((user) => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

// Orders over time (last 30 days)
const getOrdersOverTime = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ordersOverTime = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedData = ordersOverTime.map((item) => ({
      date: item._id,
      orders: item.orders,
      revenue: parseFloat(item.revenue || 0),
    }));

    return res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Orders over time error:", error);
    return res.status(500).json({ error: "Failed to fetch orders over time" });
  }
};

// Top selling items
const getTopSellingItems = async (req, res) => {
  try {
    const topItems = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.productName" },
          price: { $first: "$items.price" },
          total_sold: { $sum: "$items.quantity" },
          total_revenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { total_sold: -1 } },
      { $limit: 10 },
    ]);

    return res.status(200).json({ data: topItems });
  } catch (error) {
    console.error("Top selling items error:", error);
    return res.status(500).json({ error: "Failed to fetch top selling items" });
  }
};

// Orders by status breakdown
const getOrdersByStatus = async (req, res) => {
  try {
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedData = statusBreakdown.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    return res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Orders by status error:", error);
    return res.status(500).json({ error: "Failed to fetch orders by status" });
  }
};

module.exports = {
  getDashboardStats,
  getOrdersOverTime,
  getTopSellingItems,
  getOrdersByStatus,
};
