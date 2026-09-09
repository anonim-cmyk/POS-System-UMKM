import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { formatRupiah } from "../../utils";
import { getSalesReport } from "../../api/report.api";
import FullScreenLoader from "../shared/FullScreenLoader";
import { exportSalesReportToExcel } from "../../utils/excelExport.utils";

// ============= CONSTANTS =============

const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "sales", label: "Sales Analysis", icon: "💰" },
  { id: "products", label: "Products", icon: "🍱" },
  { id: "payments", label: "Payments", icon: "💳" },
];

const PERIODS = [
  { value: "", label: "All Time" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const PAYMENT_ICONS = {
  cash: "💵",
  qris: "📱",
  card: "💳",
  default: "💰",
};

const METRIC_COLORS = {
  green:
    "from-green-500/10 to-emerald-500/5 border-green-500/20 text-green-500",
  yellow:
    "from-yellow-500/10 to-amber-500/5 border-yellow-500/20 text-yellow-500",
  blue: "from-blue-500/10 to-cyan-500/5 border-blue-500/20 text-blue-500",
};

const PROGRESS_BAR_COLORS = ["bg-green-500", "bg-blue-500", "bg-purple-500"];

// ============= UTILITY FUNCTIONS =============

const calculatePercentage = (value, total) => {
  return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
};

const calculateAvgOrderValue = (revenue, orders) => {
  return orders > 0 ? Math.round(revenue / orders) : 0;
};

// const generateCSV = (data, periodLabel) => {
//   const { summary, revenueByMethod, topItems, range } = data;

//   let csv = `SALES REPORT - Pepes Hj. IKA\n`;
//   csv += `Period,${periodLabel}\n`;
//   csv += `Days Count,${range?.daysCount || "-"}\n\n`;

//   csv += "SUMMARY\n";
//   csv += "Metric,Value\n";
//   csv += `Gross Revenue,${summary.grossRevenue}\n`;
//   csv += `Tax Total,${summary.taxTotal}\n`;
//   csv += `Net Revenue,${summary.netRevenue}\n`;
//   csv += `Total Orders,${summary.totalOrders}\n`;
//   csv += `Completed Orders,${summary.completedOrders}\n`;
//   csv += `Average per Day,${summary.avgPerDay || 0}\n`;
//   csv += `Average per Order,${summary.avgPerOrder || 0}\n\n`;

//   csv += "PAYMENT METHODS\n";
//   csv += "Method,Gross Revenue\n";
//   revenueByMethod.forEach((m) => {
//     csv += `${m._id},${m.total}\n`;
//   });

//   csv += "\nTOP PRODUCTS\n";
//   csv += "Rank,Product,Quantity\n";
//   topItems.forEach((item, i) => {
//     csv += `${i + 1},${item._id},${item.qty}\n`;
//   });

//   return csv;
// };

// const handleExport = (reportData) => {
//   const csv = generateCSV(reportData);
//   const blob = new Blob([csv], { type: "text/csv" });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
//   a.click();
//   window.URL.revokeObjectURL(url);
// };

// ============= SHARED COMPONENTS =============

const KPICard = ({ title, value, icon, trend, trendUp, subtitle }) => (
  <div className="bg-[#262626] rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors">
    <div className="flex justify-between items-start mb-3">
      <p className="text-gray-400 text-sm">{title}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="text-2xl font-bold mb-2">{value}</h3>
    {trend && (
      <p
        className={`text-sm flex items-center gap-1 ${
          trendUp ? "text-green-500" : "text-red-500"
        }`}
      >
        <span>{trendUp ? "↗" : "↘"}</span>
        {trend}
      </p>
    )}
    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const MetricCard = ({ title, value, total, subtitle, color }) => {
  const percentage = calculatePercentage(value, total);

  return (
    <div
      className={`bg-gradient-to-br ${METRIC_COLORS[color]} border rounded-lg p-5`}
    >
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-3xl font-bold mb-1">
        {typeof value === "string" ? value : value.toLocaleString()}
      </h3>
      {total && <p className="text-sm text-gray-400">{percentage}% of total</p>}
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
};

const InsightItem = ({ label, value, description }) => (
  <div>
    <p className="text-gray-400 text-xs mb-1">{label}</p>
    <p className="text-xl font-bold mb-1">{value}</p>
    <p className="text-gray-500 text-xs">{description}</p>
  </div>
);

const ProgressBar = ({ percentage, colorClass = "bg-orange-500" }) => (
  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
    <div
      className={`${colorClass} h-2 rounded-full transition-all`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);

// ============= TAB COMPONENTS =============

const OverviewTab = ({ summary, netRevenue }) => {
  const completionRate = calculatePercentage(
    summary.completedOrders,
    summary.totalOrders
  );
  const avgOrderValue = calculateAvgOrderValue(
    netRevenue,
    summary.completedOrders
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatRupiah(netRevenue)}
          icon="💰"
          trend="+12.5%"
          trendUp={true}
        />
        <KPICard
          title="Total Orders"
          value={summary.totalOrders}
          icon="📦"
          trend="+8.3%"
          trendUp={true}
        />
        <KPICard
          title="Completed Orders"
          value={summary.completedOrders}
          icon="✅"
          subtitle={`${completionRate}% completion rate`}
        />
        <KPICard
          title="Avg Order Value"
          value={formatRupiah(avgOrderValue)}
          icon="📊"
          subtitle="Per completed order"
        />
      </div>

      <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span>💡</span>
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <InsightItem
            label="Success Rate"
            value={`${completionRate}%`}
            description="Orders completed successfully"
          />
          <InsightItem
            label="Avg Transaction"
            value={formatRupiah(avgOrderValue)}
            description="Per order revenue"
          />
          <InsightItem
            label="Total Transactions"
            value={summary.totalOrders}
            description="All orders processed"
          />
        </div>
      </div>
    </div>
  );
};

const SalesTab = ({
  summary,
  netRevenue,
  grossRevenue,
  taxTotal,
  avgPerDay,
  daysCount,
}) => {
  const cancelledOrders = summary.totalOrders - summary.completedOrders;
  const cancelRate = calculatePercentage(cancelledOrders, summary.totalOrders);
  const successRate = (100 - parseFloat(cancelRate)).toFixed(1);
  const avgPerOrder = calculateAvgOrderValue(
    netRevenue,
    summary.completedOrders
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Completed Sales"
          value={summary.completedOrders}
          total={summary.totalOrders}
          color="green"
        />
        <MetricCard
          title="Incompleted Orders"
          value={cancelledOrders}
          total={summary.totalOrders}
          color="yellow"
        />
        <MetricCard
          title="Success Rate"
          value={`${successRate}%`}
          subtitle="Order completion"
          color="blue"
        />
      </div>

      <div className="bg-[#1f1f1f] rounded-lg p-6">
        <h3 className="font-semibold mb-4">Revenue Analysis</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Gross Revenue</span>
            <span className="font-semibold text-lg">
              {formatRupiah(grossRevenue)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Tax Total</span>
            <span className="font-semibold text-lg text-yellow-500">
              -{formatRupiah(taxTotal)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Net Revenue</span>
            <span className="font-semibold text-lg text-green-500">
              {formatRupiah(netRevenue)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Average per Day</span>
            <span className="font-semibold">
              {daysCount ? formatRupiah(avgPerDay) : "-"}
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-400 font-medium">Average per Order</span>
            <span className="font-semibold">{formatRupiah(avgPerOrder)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsTab = ({ topItems }) => {
  const totalQty = topItems.reduce((sum, item) => sum + item.qty, 0);
  const top3Qty = topItems.slice(0, 3).reduce((sum, item) => sum + item.qty, 0);

  const getRankBadgeClass = (index) => {
    const badges = [
      "bg-yellow-500 text-black",
      "bg-gray-400 text-black",
      "bg-orange-600 text-white",
    ];
    return badges[index] || "bg-gray-700 text-gray-300";
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1f1f1f] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold">Top Selling Products</h3>
          <span className="text-sm text-gray-400">
            Total: {totalQty} pcs sold
          </span>
        </div>

        <div className="space-y-3">
          {topItems.map((item, index) => {
            const percentage = calculatePercentage(item.qty, totalQty);

            return (
              <div key={item._id} className="bg-[#262626] rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center font-bold ${getRankBadgeClass(
                        index
                      )}`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item._id}</p>
                      <p className="text-sm text-gray-400">
                        {item.qty} pcs sold
                      </p>
                    </div>
                  </div>
                  <span className="text-orange-500 font-semibold">
                    {percentage}%
                  </span>
                </div>
                <ProgressBar percentage={percentage} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Product Performance</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span>
              Best seller:{" "}
              <strong className="text-white">{topItems[0]?._id || "-"}</strong>{" "}
              with {topItems[0]?.qty || 0} units
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">📈</span>
            <span>
              Top 3 products account for{" "}
              <strong className="text-white">{top3Qty} units</strong>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-1">⭐</span>
            <span>
              Total product varieties sold:{" "}
              <strong className="text-white">{topItems.length}</strong>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const PaymentsTab = ({ revenueByMethod, grossRevenue }) => {
  const mostPopular = revenueByMethod[0];
  const mostPopularPercentage = mostPopular
    ? calculatePercentage(mostPopular.total, grossRevenue)
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-[#1f1f1f] rounded-lg p-6">
        <h3 className="font-semibold mb-6">Payment Method Distribution</h3>

        <div className="space-y-4">
          {revenueByMethod.map((method, index) => {
            const percentage = calculatePercentage(method.total, grossRevenue);
            const icon = PAYMENT_ICONS[method._id] || PAYMENT_ICONS.default;
            const progressColor =
              PROGRESS_BAR_COLORS[index] || PROGRESS_BAR_COLORS[2];

            return (
              <div
                key={method._id}
                className="bg-[#262626] rounded-lg p-5 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium capitalize truncate">
                        {method._id}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {percentage}% of total payment (gross)
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-semibold text-lg whitespace-nowrap">
                      {formatRupiah(method.total)}
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <ProgressBar
                    percentage={percentage}
                    colorClass={progressColor}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-lg p-6">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <span>🏆</span>
            Most Popular
          </h4>
          <p className="text-2xl font-bold text-green-500 capitalize mb-1">
            {mostPopular?._id || "-"}
          </p>
          <p className="text-sm text-gray-400">
            {mostPopular
              ? `${mostPopularPercentage}% of transactions`
              : "No data"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-lg p-6">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <span>💳</span>
            Payment Methods
          </h4>
          <p className="text-2xl font-bold text-blue-500 mb-1">
            {revenueByMethod.length}
          </p>
          <p className="text-sm text-gray-400">Active payment options</p>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN COMPONENT =============

const Reports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchParams, setSearchParams] = useSearchParams();

  const period = searchParams.get("period") || "";

  const handlePeriodChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("period", value);
    } else {
      params.delete("period");
    }

    setSearchParams(params);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sales-report", period],
    queryFn: () => getSalesReport(period),
  });

  if (isLoading) return <FullScreenLoader />;

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
          <p className="text-red-500 mb-4">Failed to load report</p>
          <button
            onClick={() => refetch()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    summary = {},
    revenueByMethod = [],
    topItems = [],
    range = {},
  } = data?.data?.data || {};
  const netRevenue = summary.netRevenue || 0;
  const grossRevenue = summary.grossRevenue || 0;
  const taxTotal = summary.taxTotal || 0;
  const avgPerDay =
    range?.daysCount && netRevenue ? netRevenue / range.daysCount : 0;

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Sales Report</h2>
          <p className="text-gray-400 text-sm">
            Pepes Hj. IKA - Performance Analytics
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={period}
            onChange={handlePeriodChange}
            className="bg-[#262626] px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-orange-500"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => exportSalesReportToExcel(data.data.data)}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center gap-2"
          >
            <span>📥</span>
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 flex items-center gap-2 font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-orange-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <OverviewTab summary={summary} netRevenue={netRevenue} />
        )}

        {activeTab === "sales" && (
          <SalesTab
            summary={summary}
            netRevenue={netRevenue}
            grossRevenue={grossRevenue}
            taxTotal={taxTotal}
            avgPerDay={avgPerDay}
            daysCount={range?.daysCount}
          />
        )}

        {activeTab === "products" && (
          <ProductsTab topItems={topItems} netRevenue={netRevenue} />
        )}

        {activeTab === "payments" && (
          <PaymentsTab
            revenueByMethod={revenueByMethod}
            grossRevenue={grossRevenue}
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
