import { format } from "date-fns";
import { exportPaymentsToExcel } from "../../utils/excelExport.utils";
import { usePayments } from "../../hooks/usePayments";
import { useTableFilters } from "../../hooks/useTableFilters";
import { formatRupiah } from "../../utils";
import { useDebounce } from "../../hooks/useDebounce";

const PaymentTable = () => {
  const {
    page,
    setPage,
    filters: { status, period },
    setFilter,
    setSearch,
    clearFilters,
    search,
  } = useTableFilters(["status", "period"]);

  const debouncedSearch = useDebounce(search, 400);

  const { payments, totalPages, totalAmount, isLoading, error } = usePayments({
    page,
    statusFilter: status,
    periodFilter: period,
    itemsPerPage: 10,
    search: debouncedSearch,
  });

  console.log("payment: ", payments);

  if (isLoading) {
    return (
      <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
        <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Payments</h2>
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#333] rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Payments</h2>

        <div className="flex gap-3">
          {/* Filter status */}
          <select
            value={status}
            onChange={(e) => setFilter("status", e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Filter periode */}
          <select
            value={period}
            onChange={(e) => setFilter("period", e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg"
          >
            <option value="">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          {/* Export */}
          <button
            onClick={() => exportPaymentsToExcel(payments)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#2a2a2a] text-left">
            <th className="p-3">Order Code</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Method</th>
            <th className="p-3">Customer Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((p) => (
              <tr
                key={p._id}
                className="border-b border-[#333] hover:bg-[#1e1e1e]"
              >
                <td className="p-3">{p.order.orderCode}</td>
                <td className="p-3">Rp {p.amount.toLocaleString("id-ID")}</td>
                <td
                  className={`p-3 capitalize ${
                    p.status === "success"
                      ? "text-green-400"
                      : p.status === "pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {p.status}
                </td>
                <td className="p-3">{p.paymentMethod}</td>
                <td className="p-3">{p.order.customer.name || "-"}</td>
                <td className="p-3">{p.order.customer.phone || "-"}</td>
                <td className="p-3">
                  {p.createdAt
                    ? format(new Date(p.createdAt), "dd MMM yyyy HH:mm")
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">
                <p className="text-center text-white py-4 font-semibold">
                  No payments found.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 text-right text-lg font-semibold">
        Total Amount: {formatRupiah(totalAmount)}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page <= 1}
          className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          const isActive = p === page;

          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded transition ${
                isActive
                  ? "bg-blue-600 text-white font-semibold cursor-default"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentTable;
