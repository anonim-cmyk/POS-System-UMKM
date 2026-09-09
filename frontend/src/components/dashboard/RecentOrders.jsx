import { formatDateAndTime, formatRupiah } from "../../utils";
import { enqueueSnackbar } from "notistack";
import { useOrderDetail } from "../../hooks/useOrderDetail";
import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";
import { useTableFilters } from "../../hooks/useTableFilters";
import { useDebounce } from "../../hooks/useDebounce";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useMemo, useCallback, useState } from "react";
import { format } from "date-fns";

// Constants
const ITEMS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 400;

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  {
    value: "in_progress",
    label: "In Progress",
    color: "text-yellow-500 border-yellow-500",
  },
  { value: "ready", label: "Ready", color: "text-green-500 border-green-500" },
  {
    value: "completed",
    label: "Completed",
    color: "text-blue-400 border-blue-400",
  },
];

const PERIOD_OPTIONS = [
  { value: "", label: "All Time" },
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
  { value: "yearly", label: "This Year" },
];

const PAYMENT_STATUS_BADGE = {
  success: {
    label: "Success",
    class: "bg-green-900/30 text-green-400 border-green-500",
  },
  pending: {
    label: "Pending",
    class: "bg-yellow-900/30 text-yellow-400 border-yellow-500",
  },
  failed: {
    label: "Failed",
    class: "bg-red-900/30 text-red-400 border-red-500",
  },
};

const RecentOrders = () => {
  const { page, search, filters, setFilter, setSearch, setPage, clearFilters } =
    useTableFilters(["status", "period"]);

  const { status, period } = filters;

  const debouncedSearch = useDebounce(search, 400);

  const updateStatus = useUpdateOrderStatus();
  const [expandedItems, setExpandedItems] = useState({});

  const { orders, meta, isLoading, error } = useOrderDetail({
    status,
    period,
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  // Memoized helpers
  const getStatusColor = useCallback((orderStatus) => {
    const statusOption = STATUS_OPTIONS.find(
      (opt) => opt.value === orderStatus
    );
    return statusOption?.color || "text-gray-500 border-gray-500";
  }, []);

  const getPaymentStatusBadge = useCallback((paymentStatus) => {
    return PAYMENT_STATUS_BADGE[paymentStatus] || PAYMENT_STATUS_BADGE.pending;
  }, []);

  const totalPages = useMemo(() => meta?.totalPages || 1, [meta?.totalPages]);
  const hasOrders = useMemo(() => orders && orders.length > 0, [orders]);

  // Handlers
  const handleStatusChange = useCallback(
    ({ orderId, orderStatus, tableId }) => {
      if (!orderId || !orderStatus) {
        console.error("❌ Missing required fields:", { orderId, orderStatus });
        enqueueSnackbar("Invalid order data", { variant: "error" });
        return;
      }

      updateStatus.mutate({ orderId, orderStatus, tableId });
    },
    [updateStatus]
  );

  const handleFilterChange = useCallback(
    (filterKey, value) => {
      setFilter(filterKey, value);
    },
    [setFilter, setPage]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;
      setPage(newPage);
    },
    [setPage, totalPages]
  );

  const handleExportExcel = useCallback(() => {
    enqueueSnackbar("Excel export coming soon", { variant: "info" });
  }, []);

  const toggleItemsExpand = useCallback((orderId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }, []);

  const handleViewDetail = useCallback((orderId) => {
    // TODO: Navigate to order detail page or open modal
    console.log("View detail for order:", orderId);
    enqueueSnackbar("Opening order detail...", { variant: "info" });
  }, []);

  const handlePrintReceipt = useCallback((orderId) => {
    // TODO: Implement print receipt
    console.log("Print receipt for order:", orderId);
    enqueueSnackbar("Print receipt coming soon", { variant: "info" });
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div
        className="container mx-auto bg-[#262626] p-4 rounded-lg"
        role="status"
        aria-live="polite"
      >
        <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
          Recent Orders
        </h2>
        <div className="animate-pulse space-y-3" aria-label="Loading orders">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#333] rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        className="container mx-auto bg-[#262626] p-4 rounded-lg"
        role="alert"
      >
        <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
          Recent Orders
        </h2>
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading orders</p>
          <p className="text-sm mt-1">
            {error?.message || "Something went wrong. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 rounded-lg">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-[#f5f5f5] text-xl font-semibold">
          Recent Orders ({orders?.length || 0})
        </h2>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <select
            value={status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => handleFilterChange("period", e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            aria-label="Filter by period"
          >
            {PERIOD_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Export to Excel"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-left text-[#f5f5f5]" role="table">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3 whitespace-nowrap" scope="col">
                Order Code
              </th>
              <th className="p-3 whitespace-nowrap" scope="col">
                Customer
              </th>
              <th className="p-3 whitespace-nowrap" scope="col">
                Table
              </th>
              <th className="p-3 whitespace-nowrap" scope="col">
                Items
              </th>
              <th className="p-3 whitespace-nowrap" scope="col">
                Total
              </th>
              <th className="p-3 whitespace-nowrap" scope="col">
                Payment
              </th>
              <th className="p-3 whitespace-nowrap" scope="col">
                Order Status
              </th>
              <th className="p-3 whitespace-nowrap" scope="col">
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody>
            {hasOrders ? (
              orders.map((order) => {
                const orderId = order._id;
                const orderCode = order.orderCode || `#${orderId.slice(-6)}`;
                const customerName = order.customer?.name || "Unknown";
                const customerPhone = order.customer?.phone || "-";
                const orderStatus = order.orderStatus;
                const tableId = order.table?._id || order.table;
                const tableNo = order.table?.tableNo || "-";
                const items = order.items || [];
                const itemsCount = items.length;
                const totalAmount = order.bills?.totalWithTax || 0;
                const orderDateTime = order.createdAt;
                const paymentStatus = order.payment?.status || "pending";
                const paymentMethod = order.payment?.paymentMethod || "-";
                const isExpanded = expandedItems[orderId];

                return (
                  <tr
                    key={orderId}
                    className="border-b border-gray-600 hover:bg-[#333] transition-colors"
                  >
                    <td className="p-4 font-mono text-sm font-semibold text-blue-400">
                      {orderCode}
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-semibold">{customerName}</div>
                        <div className="text-xs text-gray-400">
                          {customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap border border-purple-500/30">
                        Table {tableNo}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => toggleItemsExpand(orderId)}
                          className="bg-[#1a1a1a] hover:bg-[#252525] px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors text-left"
                        >
                          {itemsCount} Items {isExpanded ? "▲" : "▼"}
                        </button>
                        {isExpanded && items.length > 0 && (
                          <div className="mt-2 text-xs space-y-1 bg-[#1a1a1a] p-2 rounded border border-gray-700">
                            {items.map((item, idx) => (
                              <div key={idx} className="text-gray-300">
                                • {item.dish?.name || item.name} ({item.qty}x)
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-semibold whitespace-nowrap text-green-400">
                      {formatRupiah(totalAmount)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${
                            getPaymentStatusBadge(paymentStatus).class
                          }`}
                        >
                          {getPaymentStatusBadge(paymentStatus).label}
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">
                          {paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        className={`bg-[#1a1a1a] text-[#f5f5f5] border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all text-sm ${getStatusColor(
                          orderStatus
                        )}`}
                        value={orderStatus}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          console.log("📝 Status dropdown changed:", {
                            from: orderStatus,
                            to: newStatus,
                            orderId,
                          });
                          handleStatusChange({
                            orderId,
                            orderStatus: newStatus,
                            tableId,
                          });
                        }}
                        disabled={updateStatus.isPending}
                        aria-label={`Update status for order ${orderCode}`}
                      >
                        {STATUS_OPTIONS.filter((opt) => opt.value).map(
                          ({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap text-gray-300">
                      {orderDateTime
                        ? format(new Date(orderDateTime), "dd MMM yyyy HH:mm")
                        : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center text-white/60 py-8 font-semibold"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {hasOrders && totalPages > 1 && (
        <nav
          className="flex justify-center items-center gap-2 mt-4"
          role="navigation"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous page"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === page;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={isActive}
                className={`px-3 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold cursor-default"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}

      {/* Loading Overlay */}
      {updateStatus.isPending && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="alert"
          aria-live="assertive"
          aria-busy="true"
        >
          <div className="bg-[#262626] p-6 rounded-lg shadow-xl">
            <div className="flex items-center gap-3">
              <svg
                className="animate-spin h-6 w-6 text-blue-400"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-white font-semibold">
                Updating order status...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
