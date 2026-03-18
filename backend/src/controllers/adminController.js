const User = require("../models/User");
const Order = require("../models/Order");

const getAllUsers = async (req, res) => {
  try {
    const [users, orderCounts] = await Promise.all([
      User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .select("_id name email createdAt"),
      Order.aggregate([
        {
          $group: {
            _id: "$userId",
            totalOrders: { $sum: 1 },
          },
        },
      ]),
    ]);

    const orderCountMap = new Map(
      orderCounts.map((entry) => [entry._id, entry.totalOrders]),
    );

    return res.status(200).json({
      data: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        totalOrders: orderCountMap.get(user._id.toString()) || 0,
      })),
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = {
  getAllUsers,
};
