import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllOrders, updateOrderStatus } from "../services/api";
import { Eye, Package, RefreshCw, Search, X } from "lucide-react";
import { disconnectAdminSocket, getAdminSocket } from "../services/socket";

const statusColors = {
  pending: "badge-pending",
  accepted: "badge-confirmed",
  preparing: "badge-preparing",
  ready: "badge-ready",
  completed: "badge-delivered",
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

const getItemName = (item) =>
  item?.productName || item?.name || item?.title || "Menu Item";

const getNormalizedItems = (items = []) =>
  Array.isArray(items)
    ? items.map((item) => ({
        productId: item?.productId || item?.id || "",
        productName: getItemName(item),
        quantity: Math.max(1, Number(item?.quantity) || 1),
        price: Number(item?.price) || 0,
        image: item?.image || "",
      }))
    : [];

const getItemMetrics = (items = []) => {
  const normalizedItems = getNormalizedItems(items);
  const totalUnits = normalizedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return {
    normalizedItems,
    previewItems: normalizedItems.slice(0, 3),
    hiddenCount: Math.max(0, normalizedItems.length - 3),
    uniqueCount: normalizedItems.length,
    totalUnits,
  };
};

const formatCurrency = (value) => `$${parseFloat(value || 0).toFixed(2)}`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      setSelectedOrder((current) =>
        current?.orderNumber === order.orderNumber ? order : current,
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
      const response = await updateOrderStatus(orderNumber, newStatus);
      const updatedOrder = response?.data;

      setOrders((prev) =>
        prev.map((order) =>
          order.orderNumber === orderNumber
            ? updatedOrder || { ...order, orderStatus: newStatus }
            : order,
        ),
      );
      setSelectedOrder((current) =>
        current?.orderNumber === orderNumber
          ? updatedOrder || { ...current, orderStatus: newStatus }
          : current,
      );
    } catch (e) {
      alert("Failed to update status: " + e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((order) => {
    const normalizedSearch = search.toLowerCase();
    const matchSearch =
      !search ||
      String(order.orderNumber || "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(order.customerName || "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(order.phone || "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      (Array.isArray(order.items)
        ? order.items.some((item) =>
            getItemName(item).toLowerCase().includes(normalizedSearch),
          )
        : false);

    const matchStatus =
      filterStatus === "all" || order.orderStatus === filterStatus;

    return matchSearch && matchStatus;
  });

  const selectedOrderMetrics = selectedOrder
    ? getItemMetrics(selectedOrder.items)
    : null;

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              Orders
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Live order queue with full item visibility for every customer
              order
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchOrders}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

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
              placeholder="Search by ID, customer, phone, or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36, width: 320 }}
            />
          </div>
          <select
            className="form-input form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 170 }}
          >
            <option value="all">All Statuses</option>
            {FILTER_STATUSES.map((status) => (
              <option
                key={status}
                value={status}
                style={{ textTransform: "capitalize" }}
              >
                {status}
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
                    filtered.map((order) => {
                      const { previewItems, hiddenCount, uniqueCount, totalUnits } =
                        getItemMetrics(order.items);

                      return (
                        <tr key={order.orderNumber}>
                          <td style={{ fontWeight: 700 }}>{order.orderNumber}</td>
                          <td>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>
                              {order.customerName || "Customer"}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "var(--text-muted)",
                                marginBottom: 2,
                              }}
                            >
                              {order.phone || ""}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "var(--text-secondary)",
                              }}
                            >
                              {order.email || ""}
                            </div>
                          </td>
                          <td style={{ minWidth: 320 }}>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 8,
                                marginBottom: 8,
                              }}
                            >
                              {previewItems.map((item, index) => (
                                <span
                                  key={`${order.orderNumber}-${item.productId || index}`}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "5px 10px",
                                    borderRadius: 999,
                                    background: "var(--primary-light)",
                                    color: "var(--text-primary)",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    maxWidth: 220,
                                  }}
                                  title={item.productName}
                                >
                                  <span
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {item.productName}
                                  </span>
                                  <span
                                    style={{
                                      marginLeft: 6,
                                      color: "var(--primary-hover)",
                                    }}
                                  >
                                    x{item.quantity}
                                  </span>
                                </span>
                              ))}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                }}
                              >
                                {uniqueCount} unique item
                                {uniqueCount === 1 ? "" : "s"} • {totalUnits} qty
                              </span>
                              {hiddenCount > 0 && (
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "var(--primary)",
                                    fontWeight: 700,
                                  }}
                                >
                                  +{hiddenCount} more
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  border: "none",
                                  background: "transparent",
                                  color: "var(--info)",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  padding: 0,
                                }}
                              >
                                <Eye size={14} />
                                View details
                              </button>
                            </div>
                          </td>
                          <td
                            style={{
                              fontWeight: 700,
                              color: "var(--primary)",
                            }}
                          >
                            {formatCurrency(order.totalPrice)}
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
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                              }}
                            >
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
                                    .map((status) => (
                                      <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() +
                                          status.slice(1)}
                                      </option>
                                    ))}
                                </select>
                              )}

                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => setSelectedOrder(order)}
                                style={{
                                  justifyContent: "center",
                                  padding: "6px 10px",
                                }}
                              >
                                <Eye size={14} />
                                Open
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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

      {selectedOrder && selectedOrderMetrics && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedOrder(null)}
          role="presentation"
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
          >
            <div className="modal-header">
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 4,
                  }}
                >
                  Order Details
                </div>
                <div
                  id="order-details-title"
                  className="modal-title"
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  {selectedOrder.orderNumber}
                  <span
                    className={`badge ${statusColors[selectedOrder.orderStatus] || "badge-pending"}`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedOrder(null)}
                style={{ padding: 8 }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 14,
                    background: "#FAFBFC",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginBottom: 6,
                    }}
                  >
                    Customer
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    {selectedOrder.customerName}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "var(--text-secondary)" }}
                  >
                    {selectedOrder.phone}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "var(--text-secondary)" }}
                  >
                    {selectedOrder.email}
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 14,
                    background: "#FAFBFC",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginBottom: 6,
                    }}
                  >
                    Summary
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    {selectedOrderMetrics.uniqueCount} unique item
                    {selectedOrderMetrics.uniqueCount === 1 ? "" : "s"}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "var(--text-secondary)" }}
                  >
                    {selectedOrderMetrics.totalUnits} total quantity
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--primary)",
                      marginTop: 8,
                    }}
                  >
                    {formatCurrency(selectedOrder.totalPrice)}
                  </div>
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                    fontWeight: 700,
                  }}
                >
                  <Package size={16} color="var(--primary)" />
                  All Ordered Items
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {selectedOrderMetrics.normalizedItems.map((item, index) => (
                    <div
                      key={`${selectedOrder.orderNumber}-${item.productId || index}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 14,
                        padding: 14,
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        background: "#FAFBFC",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            minWidth: 34,
                            height: 34,
                            borderRadius: 10,
                            background: "var(--primary-light)",
                            color: "var(--primary-hover)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          x{item.quantity}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              wordBreak: "break-word",
                            }}
                          >
                            {item.productName}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                              marginTop: 2,
                            }}
                          >
                            Unit price: {formatCurrency(item.price)}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
