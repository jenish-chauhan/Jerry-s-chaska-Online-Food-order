import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { confirmOrderPickup, getUserOrders } from "../services/api";
import MainLayout from "../layout/MainLayout";
import {
  Card,
  CardContent,
} from "../components/ui/Card";
import {
  Package,
  Clock,
  CheckCircle,
  ChefHat,
  Loader2,
  ListOrdered,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { disconnectSocket, getSocket } from "../services/socket";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    icon: Clock,
    rank: 0,
  },
  accepted: {
    label: "Accepted",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    icon: CheckCircle,
    rank: 1,
  },
  preparing: {
    label: "Preparing",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    icon: ChefHat,
    rank: 2,
  },
  ready: {
    label: "Ready",
    color: "text-green-500",
    bg: "bg-green-500/10",
    icon: Package,
    rank: 3,
  },
  completed: {
    label: "Completed",
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    icon: CheckCircle,
    rank: 4,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-500",
    bg: "bg-red-500/10",
    icon: Clock,
    rank: -1,
  },
};

const timelineStages = ["pending", "accepted", "preparing", "ready"];

const sortOrdersByCreatedAt = (orderList) =>
  [...orderList].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

const upsertOrder = (orderList, incomingOrder) => {
  const exists = orderList.some(
    (order) => order.orderNumber === incomingOrder.orderNumber,
  );

  const nextOrders = exists
    ? orderList.map((order) =>
        order.orderNumber === incomingOrder.orderNumber ? incomingOrder : order,
      )
    : [incomingOrder, ...orderList];

  return sortOrdersByCreatedAt(nextOrders);
};

const getLatestReadyOrder = (orderList, dismissedOrderNumbers) =>
  orderList.find(
    (order) =>
      order.orderStatus === "ready" &&
      !dismissedOrderNumbers.includes(order.orderNumber),
  ) || null;

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [readyPopup, setReadyPopup] = useState(null);
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [dismissedReadyOrders, setDismissedReadyOrders] = useState([]);

  const fetchOrders = useCallback(
    async (showLoader = true) => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      if (showLoader) {
        setLoading(true);
      }

      try {
        const res = await getUserOrders(user.id);
        if (res.success) {
          setOrders(sortOrdersByCreatedAt(res.data));
        }
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [user?.id],
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      fetchOrders(false);
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [fetchOrders, user?.id]);

  useEffect(() => {
    setReadyPopup(getLatestReadyOrder(orders, dismissedReadyOrders));
  }, [orders, dismissedReadyOrders]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user?.id) {
      return undefined;
    }

    const socket = getSocket(token);
    const handleOrderCreated = (order) => {
      if (order.userId !== user.id) {
        return;
      }

      setOrders((current) => upsertOrder(current, order));
    };

    const handleOrderUpdated = (order) => {
      if (order.userId !== user.id) {
        return;
      }

      setOrders((current) => upsertOrder(current, order));

      if (order.orderStatus !== "ready") {
        setDismissedReadyOrders((current) =>
          current.filter((item) => item !== order.orderNumber),
        );
      }
    };

    socket.on("order:created", handleOrderCreated);
    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("order:created", handleOrderCreated);
      socket.off("order:updated", handleOrderUpdated);
      disconnectSocket();
    };
  }, [user]);

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const handleConfirmPickup = async (orderNumber) => {
    setConfirmingOrder(orderNumber);
    try {
      const result = await confirmOrderPickup(orderNumber);
      if (!result.success) {
        throw new Error(result.message);
      }

      setOrders((current) => upsertOrder(current, result.data));
      setDismissedReadyOrders((current) =>
        current.filter((item) => item !== orderNumber),
      );
      setReadyPopup(null);
    } catch (error) {
      alert(error.message || "Failed to confirm pickup.");
    } finally {
      setConfirmingOrder(null);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <ListOrdered className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please Login
          </h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to view your orders.
          </p>
          <Link to="/login">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Login Now
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Orders
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Live updates arrive automatically while your order moves through
              the kitchen.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 self-start rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-700 sm:self-auto sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Auto Sync On
          </div>
        </div>

        {readyPopup && (
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-green-300 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-green-800 sm:text-lg">
                Your order is ready!
              </h3>
              <p className="mt-1 text-sm leading-6 text-green-900 sm:text-base">
                Please collect <span className="font-semibold">Order #{readyPopup.orderNumber}</span> from the counter.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                onClick={() => handleConfirmPickup(readyPopup.orderNumber)}
                className="min-h-[44px] w-full bg-green-600 px-4 text-sm text-white hover:bg-green-700 sm:w-auto sm:text-base"
                disabled={confirmingOrder === readyPopup.orderNumber}
              >
                {confirmingOrder === readyPopup.orderNumber
                  ? "Confirming..."
                  : "I Collected My Order"}
              </Button>
              <Button
                onClick={() => {
                  setDismissedReadyOrders((current) =>
                    current.includes(readyPopup.orderNumber)
                      ? current
                      : [...current, readyPopup.orderNumber],
                  );
                  setReadyPopup(null);
                }}
                variant="outline"
                className="min-h-[44px] w-full border-green-600 text-green-700 hover:bg-green-100 sm:w-auto"
              >
                Later
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-16 bg-secondary border-0 text-white shadow-lg">
            <CardContent>
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
              <p className="text-gray-400 mb-6">
                You haven't placed any orders yet. Let's fix that!
              </p>
              <Link to="/menu">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Browse Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status =
                statusConfig[order.orderStatus] || statusConfig.pending;
              const StatusIcon = status.icon;
              const isExpanded = expandedOrder === order.orderNumber;
              const currentRank = status.rank;

              return (
                <Card
                  key={order.orderNumber}
                  className="bg-secondary border-0 shadow-lg text-white overflow-hidden"
                >
                  <div
                    className="flex cursor-pointer flex-col gap-4 p-4 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                    onClick={() => toggleExpand(order.orderNumber)}
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className={`rounded-full p-3 ${status.bg}`}>
                        <StatusIcon className={`h-6 w-6 ${status.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-400 mb-1">
                          Order{" "}
                          <span className="text-white font-semibold">
                            #{order.orderNumber}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end sm:gap-6">
                      <div className="text-left sm:text-right">
                        <p className={`text-sm font-semibold ${status.color}`}>
                          {status.label}
                        </p>
                        <p className="text-lg font-bold text-orange-400">
                          ${parseFloat(order.totalPrice).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-gray-400">
                        {isExpanded ? (
                          <ChevronUp size={24} />
                        ) : (
                          <ChevronDown size={24} />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-700 bg-gray-900/50 p-4 sm:p-5">
                      {/* Status Timeline UI */}
                      {order.orderStatus !== "cancelled" &&
                        order.orderStatus !== "completed" && (
                          <div className="mb-8">
                            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                              Live Tracking
                            </h4>
                            <div className="relative mb-2 flex items-center justify-between gap-1.5 sm:gap-2">
                              {/* Line connecting milestones */}
                              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -z-10 -translate-y-1/2 rounded"></div>
                              <div
                                className="absolute top-1/2 left-0 h-1 bg-orange-500 -z-10 -translate-y-1/2 transition-all duration-500 rounded"
                                style={{
                                  width: `${(Math.max(0, currentRank) / (timelineStages.length - 1)) * 100}%`,
                                }}
                              ></div>

                              {timelineStages.map((stage, idx) => {
                                const stageConfig = statusConfig[stage];
                                const isCompleted = currentRank >= idx;
                                const StageIcon = stageConfig.icon;

                                return (
                                  <div
                                    key={stage}
                                    className="flex min-w-0 flex-1 flex-col items-center px-1"
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? "bg-orange-500 border-orange-500 text-white" : "bg-gray-800 border-gray-600 text-gray-500"}`}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle className="w-4 h-4" />
                                      ) : (
                                        <StageIcon className="w-4 h-4" />
                                      )}
                                    </div>
                                    <span
                                      className={`mt-2 text-[10px] font-medium leading-tight text-center sm:text-xs ${isCompleted ? "text-white" : "text-gray-500"}`}
                                    >
                                      {stageConfig.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {order.orderStatus === "ready" && (
                              <div className="mt-4 rounded border border-green-500/50 bg-green-500/20 p-3 text-center">
                                <p className="font-medium text-green-300">
                                  Your order is ready. Please collect it from
                                  the counter.
                                </p>
                                <Button
                                  onClick={() =>
                                    handleConfirmPickup(order.orderNumber)
                                  }
                                  className="mt-3 w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
                                  disabled={confirmingOrder === order.orderNumber}
                                >
                                  {confirmingOrder === order.orderNumber
                                    ? "Confirming..."
                                    : "Confirm Pickup"}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                      <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        Order Items
                      </h4>
                      <div className="space-y-3 mb-6">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between gap-4 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded flex items-center justify-center bg-gray-800 text-xs font-bold text-orange-400 border border-gray-700">
                                {item.quantity}x
                              </span>
                              <span className="text-gray-200">
                                {item.productName}
                              </span>
                            </div>
                            <span className="whitespace-nowrap text-gray-400">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        Customer Details
                      </h4>
                      <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 flex flex-col gap-1">
                        <p className="font-semibold text-white">
                          {order.customerName}
                        </p>
                        <p>{order.phone}</p>
                        <p>{order.email}</p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Orders;
