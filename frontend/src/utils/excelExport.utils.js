import { format } from "date-fns";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const exportPaymentsToExcel = (payments) => {
  const exportData = payments.map((p) => ({
    "Order ID": p._id,
    Amount: p.grossAmount,
    Status: p.status,
    Method: p.paymentMethod,
    "Customer Name": p.customerName || "-",
    Phone: p.customerPhone || "-",
    "Created At": p.createdAt
      ? format(new Date(p.createdAt), "dd MMM yyyy HH:mm")
      : "-",
  }));

  const workSheet = XLSX.utils.json_to_sheet(exportData);
  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook, workSheet, "Payments");

  const excelBuffer = XLSX.write(workBook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Payments_${new Date().toISOString()}.xlsx`);
};

export const exportSalesReportToExcel = (reportData) => {
  const { summary, revenueByMethod, topItems, range } = reportData;

  // Determine period label
  const periodLabel = getPeriodLabel(range);

  // ========== SHEET 1: SUMMARY ==========
  const summaryData = [
    ["📄 SALES REPORT SUMMARY"],
    ["Pepes Hj. IKA"],
    [], // Empty row
    ["Metric", "Value"],
    ["Period", periodLabel],
    ["Gross Revenue", summary.grossRevenue || 0],
    ["Tax Total", summary.taxTotal || 0],
    ["Net Revenue", summary.netRevenue || 0],
    ["Total Orders", summary.totalOrders || 0],
    ["Completed Orders", summary.completedOrders || 0],
    [
      "Avg per Day",
      range?.daysCount && summary.netRevenue
        ? Math.round(summary.netRevenue / range.daysCount)
        : 0,
    ],
    [
      "Avg per Order",
      summary.completedOrders > 0
        ? Math.round(summary.netRevenue / summary.completedOrders)
        : 0,
    ],
  ];

  // ========== SHEET 2: PAYMENT METHODS ==========
  const paymentData = [
    ["📄 PAYMENT METHODS"],
    ["Distribution by Payment Type"],
    [], // Empty row
    ["Method", "Gross Revenue"],
    ...revenueByMethod.map((method) => [
      capitalizeFirst(method._id),
      method.total || 0,
    ]),
    [], // Empty row
    ["Total", revenueByMethod.reduce((sum, m) => sum + (m.total || 0), 0)],
  ];

  // ========== SHEET 3: TOP PRODUCTS ==========
  const productsData = [
    ["📄 TOP SELLING PRODUCTS"],
    ["Best Performers"],
    [], // Empty row
    ["Rank", "Product", "Qty Sold"],
    ...topItems.map((item, index) => [index + 1, item._id, item.qty || 0]),
    [], // Empty row
    [
      "Total Units Sold",
      "",
      topItems.reduce((sum, item) => sum + (item.qty || 0), 0),
    ],
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create worksheets
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  const wsPayment = XLSX.utils.aoa_to_sheet(paymentData);
  const wsProducts = XLSX.utils.aoa_to_sheet(productsData);

  // Set column widths
  wsSummary["!cols"] = [{ wch: 20 }, { wch: 20 }];
  wsPayment["!cols"] = [{ wch: 20 }, { wch: 20 }];
  wsProducts["!cols"] = [{ wch: 10 }, { wch: 30 }, { wch: 15 }];

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
  XLSX.utils.book_append_sheet(wb, wsPayment, "Payment Methods");
  XLSX.utils.book_append_sheet(wb, wsProducts, "Top Products");

  // Generate filename
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `Sales_Report_${periodLabel.replace(
    / /g,
    "_"
  )}_${timestamp}.xlsx`;

  // Export file
  XLSX.writeFile(wb, filename);
};

/**
 * Helper function to get period label
 */
const getPeriodLabel = (range) => {
  if (!range || !range.start) return "All_Time";

  const start = new Date(range.start);
  const end = range.end ? new Date(range.end) : new Date();

  // Check if it's current week
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (start >= weekAgo) return "This_Week";

  // Check if it's current month
  if (
    start.getMonth() === now.getMonth() &&
    start.getFullYear() === now.getFullYear()
  ) {
    return "This_Month";
  }

  // Check if it's current year
  if (start.getFullYear() === now.getFullYear()) {
    return "This_Year";
  }

  // Custom range
  const formatDate = (date) => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return `${formatDate(start)}_to_${formatDate(end)}`;
};

/**
 * Helper function to capitalize first letter
 */
const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
