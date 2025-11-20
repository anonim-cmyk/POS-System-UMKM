import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../../https";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useState } from "react";

const PaymentTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const itemsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["payments", currentPage, statusFilter, periodFilter],
    queryFn: async () => {
      const res = await getPayments({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter,
        period: periodFilter,
      });
      return res.data;
    },
  });

  const payments = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // Export Excel
  const handleExportExcel = () => {
    const exportData = payments.map((p) => ({
      "Order ID": p.orderId,
      Amount: p.amount,
      Status: p.status,
      Method: p.method,
      "Customer Name": p.customerName || "-",
      Phone: p.customerPhone || "-",
      "Created At": p.createdAt
        ? format(new Date(p.createdAt), "dd MMM yyyy HH:mm")
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Payments_${new Date().toISOString()}.xlsx`);
  };

  if (isLoading) return <p>Loading payments...</p>;
  if (error) return <p>Error loading payments: {error.message}</p>;

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Payments</h2>

        <div className="flex gap-3">
          {/* Filter status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Filter periode */}
          <select
            value={periodFilter}
            onChange={(e) => {
              setPeriodFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg"
          >
            <option value="">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          {/* Export */}
          <button
            onClick={handleExportExcel}
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
            <th className="p-3">Order ID</th>
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
                <td className="p-3">{p.orderId}</td>
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
                <td className="p-3">{p.method}</td>
                <td className="p-3">{p.customerName || "-"}</td>
                <td className="p-3">{p.customerPhone || "-"}</td>
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
        Total Amount: Rp {data?.totalAmount?.toLocaleString("id-ID") || 0}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentTable;
