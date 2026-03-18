import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import {
  getDashboardStats,
  getOrdersOverTime,
  getTopSellingItems,
  getAllOrders,
} from "../services/api";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Clock,
  IndianRupee,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { disconnectAdminSocket, getAdminSocket } from "../services/socket";

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  color = "var(--primary)",
  onClick,
}) => (
  <div
    className="card"
    style={{ padding: 24, cursor: onClick ? "pointer" : "default" }}
    onClick={onClick}
  >
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <div>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "var(--text-primary)",
          }}
        >
          {value}
        </p>
        {sub && (
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            {sub}
          </p>
        )}
      </div>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={22} color={color} />
      </div>
    </div>
  </div>
);

const formatRupee = (val) => `$${parseFloat(val || 0).toFixed(2)}`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [ordersOverTime, setOrdersOverTime] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [s, ot, ti, orders] = await Promise.all([
        getDashboardStats(),
        getOrdersOverTime(),
        getTopSellingItems(),
        getAllOrders(),
      ]);
      setStats(s.data);
      setOrdersOverTime(
        ot.data.map((r) => ({
          ...r,
          date: new Date(r.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          revenue: parseFloat(r.revenue),
        })),
      );
      setTopItems(ti.data.slice(0, 6));
      setRecentOrders((orders.data || []).slice(0, 5));
      setRecentUsers(s.data.recentUsers || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      await fetchAll();
      setLoading(false);
    };
    initFetch();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      return undefined;
    }

    const socket = getAdminSocket();
    const handleRealtimeRefresh = async () => {
      await fetchAll();
    };

    socket.on("order:created", handleRealtimeRefresh);
    socket.on("order:updated", handleRealtimeRefresh);

    return () => {
      socket.off("order:created", handleRealtimeRefresh);
      socket.off("order:updated", handleRealtimeRefresh);
      disconnectAdminSocket();
    };
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid var(--border)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
            }}
            className="spin"
          />
        </div>
      </AdminLayout>
    );

  const statusColors = {
    pending: "badge-pending",
    accepted: "badge-confirmed",
    preparing: "badge-preparing",
    ready: "badge-ready",
    completed: "badge-delivered",
    cancelled: "badge-cancelled",
  };

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <StatCard
            icon={ShoppingBag}
            label="Today's Orders"
            value={stats?.dailyOrders ?? 0}
            sub="New orders today"
            color="var(--primary)"
          />
          <StatCard
            icon={IndianRupee}
            label="Today's Revenue"
            value={formatRupee(stats?.dailyRevenue)}
            sub="Revenue today"
            color="#27AE60"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={formatRupee(stats?.totalRevenue)}
            sub="All time"
            color="#2980B9"
          />
          <StatCard
            icon={Clock}
            label="Pending Orders"
            value={stats?.pendingOrders ?? 0}
            sub="Awaiting action"
            color="#F39C12"
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats?.totalUsers ?? 0}
            sub="Registered customers"
            color="#8E44AD"
            onClick={() => navigate("/users")}
          />
          <StatCard
            icon={UtensilsCrossed}
            label="Menu Items"
            value={stats?.activeMenuItems ?? 0}
            sub="Currently active"
            color="#16A085"
          />
        </div>

        {/* Charts Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 28,
          }}
        >
          {/* Orders over time */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Orders (Last 30 Days)</span>
              <BarChart3 size={18} color="var(--text-muted)" />
            </div>
            <div className="card-body">
              {ordersOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={ordersOverTime}>
                    <defs>
                      <linearGradient
                        id="orderGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#FF6B35"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FF6B35"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        fontSize: 13,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#FF6B35"
                      fill="url(#orderGrad)"
                      strokeWidth={2}
                      name="Orders"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: 14,
                  }}
                >
                  No order data yet
                </div>
              )}
            </div>
          </div>

          {/* Top selling items */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Selling Items</span>
            </div>
            <div className="card-body">
              {topItems.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topItems} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      width={90}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        fontSize: 13,
                      }}
                    />
                    <Bar
                      dataKey="total_sold"
                      fill="#FF6B35"
                      radius={[0, 4, 4, 0]}
                      name="Sold"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: 14,
                  }}
                >
                  No sales data yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Orders</span>
            <a
              href="/orders"
              style={{
                fontSize: 13,
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View all →
            </a>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        padding: 32,
                      }}
                    >
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.orderNumber}>
                      <td style={{ fontWeight: 600 }}>{order.orderNumber}</td>
                      <td>{order.customerName || "Customer"}</td>
                      <td style={{ fontWeight: 600, color: "var(--primary)" }}>
                        {formatRupee(order.totalPrice)}
                      </td>
                      <td>
                        <span
                          className={`badge ${statusColors[order.orderStatus] || "badge-pending"}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td
                        style={{ color: "var(--text-secondary)", fontSize: 13 }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header">
            <span className="card-title">Recent Customers</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        padding: 24,
                      }}
                    >
                      No registered customers yet
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 600 }}>{user.name}</td>
                      <td>{user.email}</td>
                      <td
                        style={{ color: "var(--text-secondary)", fontSize: 13 }}
                      >
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
