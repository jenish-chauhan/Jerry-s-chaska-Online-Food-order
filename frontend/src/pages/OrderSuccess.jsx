import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle,
  ChefHat,
  Clock,
  ListOrdered,
  Loader2,
  Package,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import MainLayout from "../layout/MainLayout";
import { getOrderById } from "../services/api";
import { disconnectSocket, getSocket } from "../services/socket";

const statusMeta = {
  pending: {
    label: "Pending",
    badgeClass: "bg-yellow-500/20 text-yellow-500",
    icon: Clock,
    title: "Your order is in queue",
    message: "We received your order and the kitchen will review it shortly.",
  },
  accepted: {
    label: "Accepted",
    badgeClass: "bg-blue-500/20 text-blue-400",
    icon: CheckCircle,
    title: "Your order has been accepted",
    message: "The team has accepted your order and will start preparing it.",
  },
  preparing: {
    label: "Preparing",
    badgeClass: "bg-purple-500/20 text-purple-400",
    icon: ChefHat,
    title: "The kitchen is preparing your order",
    message: "Your food is actively being prepared right now.",
  },
  ready: {
    label: "Ready",
    badgeClass: "bg-green-500/20 text-green-400",
    icon: Package,
    title: "Your order is ready for pickup",
    message: "Please collect your order from the counter when you arrive.",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-slate-500/20 text-slate-300",
    icon: CheckCircle,
    title: "Order completed",
    message: "This order has been marked as collected. Enjoy your meal.",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-red-500/20 text-red-400",
    icon: Clock,
    title: "This order was cancelled",
    message: "Please contact the restaurant if you need help with this order.",
  },
};

const activeStatuses = new Set(["pending", "accepted", "preparing", "ready"]);

const OrderSuccess = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(
    location.state?.orderDetails || null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const orderNumber =
    searchParams.get("order") || location.state?.orderDetails?.orderNumber || "";
  const hasSeedOrderDetails = Boolean(location.state?.orderDetails);
  const status = statusMeta[orderDetails?.orderStatus] || statusMeta.pending;
  const StatusIcon = status.icon;
  const currentOrderStatus = orderDetails?.orderStatus;

  const fetchLatestOrder = useCallback(
    async (showSpinner = false) => {
      if (!orderNumber) {
        return;
      }

      if (showSpinner) {
        setIsRefreshing(true);
      }

      const result = await getOrderById(orderNumber);

      if (result.success) {
        setOrderDetails(result.data);
        setLoadError("");
      } else {
        setLoadError(result.message || "Unable to load order details.");
      }

      if (showSpinner) {
        setIsRefreshing(false);
      }
    },
    [orderNumber],
  );

  useEffect(() => {
    if (location.state?.orderDetails?.orderNumber && !searchParams.get("order")) {
      const nextParams = new URLSearchParams(location.search);
      nextParams.set("order", location.state.orderDetails.orderNumber);
      const nextUrl = `${location.pathname}?${nextParams.toString()}`;
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [location, searchParams]);

  useEffect(() => {
    if (!orderNumber) {
      return;
    }

    fetchLatestOrder(!hasSeedOrderDetails);
  }, [fetchLatestOrder, hasSeedOrderDetails, orderNumber]);

  useEffect(() => {
    if (!orderNumber) {
      return undefined;
    }

    const token = localStorage.getItem("token");
    const socket = token ? getSocket(token) : null;

    const handleOrderEvent = (incomingOrder) => {
      if (incomingOrder.orderNumber !== orderNumber) {
        return;
      }

      setOrderDetails(incomingOrder);
      setLoadError("");
    };

    if (socket) {
      socket.on("order:created", handleOrderEvent);
      socket.on("order:updated", handleOrderEvent);
    }

    return () => {
      if (socket) {
        socket.off("order:created", handleOrderEvent);
        socket.off("order:updated", handleOrderEvent);
        disconnectSocket();
      }
    };
  }, [orderNumber]);

  useEffect(() => {
    if (!orderNumber || !activeStatuses.has(currentOrderStatus || "pending")) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      fetchLatestOrder();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [currentOrderStatus, fetchLatestOrder, orderNumber]);

  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-6 sm:py-12">
        <div className="w-full max-w-3xl text-center">
          <div className="mx-auto mb-4 mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 sm:mb-5 sm:mt-6 sm:h-28 sm:w-28">
            <CheckCircle className="h-10 w-10 text-green-600 sm:h-14 sm:w-14" />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-4xl">
            Order Placed Successfully!
          </h1>
          <p className="mb-2 text-sm font-semibold text-orange-600 sm:text-lg">
            {status.title}
          </p>
          <p className="mx-auto mb-5 max-w-xl text-sm leading-6 text-gray-500 sm:mb-8 sm:text-base">
            {status.message}
          </p>

          <div className="mx-auto mb-6 flex max-w-lg flex-col items-center gap-2 rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 text-sm shadow-sm sm:flex-row sm:justify-between sm:gap-3">
            <div className="flex items-center gap-2 text-center text-gray-600 sm:text-left">
              <RefreshCw className="h-4 w-4 text-orange-500" />
              Status updates automatically on this page.
            </div>
            {isRefreshing && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing
              </div>
            )}
          </div>

          {orderDetails ? (
            <div className="mx-auto mb-8 w-full max-w-lg rounded-2xl border border-gray-700 bg-secondary p-4 text-left shadow-lg sm:p-6">
              <div className="mb-5 flex flex-col gap-4 border-b border-gray-700 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-white">
                  <div className="rounded-full bg-white/10 p-2.5 sm:p-3">
                    <ListOrdered className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                      Order Number
                    </p>
                    <p className="text-xl font-bold sm:text-2xl">
                      {orderDetails.orderNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className={`rounded-full p-2 ${status.badgeClass}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${status.badgeClass}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white/5 p-3.5 sm:p-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-gray-400">
                    Customer
                  </p>
                  <p className="font-semibold text-white">
                    {orderDetails.customerName || "Guest"}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {orderDetails.email}
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-3.5 sm:p-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-gray-400">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold text-orange-400">
                    ${parseFloat(orderDetails.totalPrice || 0).toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {orderDetails.itemCount || orderDetails.items?.length || 0} item
                    {(orderDetails.itemCount || orderDetails.items?.length || 0) === 1
                      ? ""
                      : "s"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto mb-8 w-full max-w-lg rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center shadow-sm">
              <p className="text-base font-semibold text-gray-900">
                We could not find the latest order details.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {loadError || "Open your orders page to continue tracking your order."}
              </p>
            </div>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link to="/orders" className="w-full sm:w-auto">
              <Button
                className="min-h-[46px] w-full bg-orange-500 px-5 text-sm text-white shadow-md transition-all hover:scale-[1.01] hover:bg-orange-600 sm:min-h-[48px] sm:px-8 sm:text-base"
              >
                Track Order Status
              </Button>
            </Link>
            <Link to="/menu" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="min-h-[46px] w-full border-gray-300 px-5 text-sm text-gray-900 shadow-sm transition-all hover:bg-gray-100 sm:min-h-[48px] sm:px-8 sm:text-base"
              >
                Back to Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderSuccess;
