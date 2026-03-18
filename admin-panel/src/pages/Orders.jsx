import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllOrders, updateOrderStatus } from "../services/api";
import { RefreshCw, Search } from "lucide-react";
import { disconnectAdminSocket, getAdminSocket } from "../services/socket";

const statusColors = {
  pending: "badge-pending",
  accepted: "badge-confirmed", // Reusing confirmed style for accepted
  preparing: "badge-preparing",
  ready: "badge-ready",
  completed: "badge-delivered", // Reusing delivered style for completed
  cancelled: "badge-cancelled",
};

const MANUAL_STATUSES = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "cancelled",
];
const FILTER_STATUSES = [...MANUAL_STATUSES, "completed"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      return undefined;
    }

    const socket = getAdminSocket();

    const handleOrderCreated = (order) => {
      setOrders((current) => {
        const exists = current.some(
          (existing) => existing.orderNumber === order.orderNumber,
        );
        return exists ? current : [order, ...current];
      });
    };

    const handleOrderUpdated = (order) => {
      setOrders((current) =>
        current.map((existing) =>
          existing.orderNumber === order.orderNumber ? order : existing,
        ),
      );
    };

    socket.on("order:created", handleOrderCreated);
    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("order:created", handleOrderCreated);
      socket.off("order:updated", handleOrderUpdated);
      disconnectAdminSocket();
    };
  }, []);

  const handleStatusChange = async (orderNumber, newStatus) => {
    setUpdatingId(orderNumber);
    try {
      await updateOrderStatus(orderNumber, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNumber ? { ...o, orderStatus: newStatus } : o,
        ),
      );
    } catch (e) {
      alert("Failed to update status: " + e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      String(o.orderNumber || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(o.customerName || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              Orders
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Manage and update customer orders
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchOrders}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              className="form-input"
              placeholder="Search by ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36, width: 260 }}
            />
          </div>
          <select
            className="form-input form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 160 }}
          >
            <option value="all">All Statuses</option>
            {FILTER_STATUSES.map((s) => (
              <option key={s} value={s} style={{ textTransform: "capitalize" }}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          {loading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 48 }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid var(--border)",
                  borderTopColor: "var(--primary)",
                  borderRadius: "50%",
                }}
                className="spin"
              />
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          color: "var(--text-muted)",
                          padding: 40,
                        }}
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => (
                      <tr key={order.orderNumber}>
                        <td style={{ fontWeight: 700 }}>{order.orderNumber}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>
                            {order.customerName || "Customer"}
                          </div>
                          <div
                            style={{ fontSize: 12, color: "var(--text-muted)" }}
                          >
                            {order.phone || order.email || ""}
                          </div>
                        </td>
                        <td
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: 13,
                          }}
                        >
                          {order.itemCount ||
                            (order.items && order.items.length) ||
                            "—"}{" "}
                          items
                        </td>
                        <td
                          style={{ fontWeight: 700, color: "var(--primary)" }}
                        >
                          ${parseFloat(order.totalPrice || 0).toFixed(2)}
                        </td>
                        <td>
                          <span
                            className={`badge ${statusColors[order.orderStatus] || "badge-pending"}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: 13,
                          }}
                        >
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                          <br />
                          <span style={{ fontSize: 11 }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          {order.orderStatus === "completed" ? (
                            <span
                              style={{
                                fontSize: 12,
                                color: "#27AE60",
                                fontWeight: 700,
                              }}
                            >
                              Auto-completed
                            </span>
                          ) : (
                            <select
                              className="form-input form-select"
                              value={order.orderStatus}
                              disabled={updatingId === order.orderNumber}
                              onChange={(e) =>
                                handleStatusChange(
                                  order.orderNumber,
                                  e.target.value,
                                )
                              }
                              style={{
                                fontSize: 12,
                                padding: "5px 28px 5px 10px",
                                width: 130,
                              }}
                            >
                              {[...MANUAL_STATUSES, order.orderStatus]
                                .filter((value, index, array) =>
                                  array.indexOf(value) === index,
                                )
                                .map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
          Showing {filtered.length} of {orders.length} orders
        </p>
      </div>
    </AdminLayout>
  );
};

export default Orders;
