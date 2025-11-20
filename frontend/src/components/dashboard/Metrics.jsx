import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../../https";
import FullScreenLoader from "../shared/FullScreenLoader";
import { useState } from "react";

const Metrics = () => {
  const [filter, setFilter] = useState("30d");

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-metrics", filter],
    queryFn: () => getDashboardMetrics(filter),
  });
  if (isLoading) return <FullScreenLoader />;
  if (error) return <p className="text-red-500">Failed to load</p>;

  const res = data?.data?.data;
  const metrics = res?.metrics || {};
  const items = res?.items || {};

  const metricsData = [
    {
      title: "Total Revenue",
      value: `Rp ${(metrics.totalRevenue || 0).toLocaleString()}`,
      color: "#4c51bf",
      isIncrease: (metrics.revenueGrowth || 0) >= 0,
      percentage: `${metrics.revenueGrowth || 0}%`,
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders || 0,
      color: "#2d3748",
      isIncrease: (metrics.orderGrowth || 0) >= 0,
      percentage: `${metrics.orderGrowth || 0}%`,
    },
    {
      title: "Completed Orders",
      value: metrics.completedOrders || 0,
      color: "#2b6cb0",
      isIncrease: (metrics.completedGrowth || 0) >= 0,
      percentage: `${metrics.completedGrowth || 0}%`,
    },
    {
      title: "In-Progress Orders",
      value: metrics.inProgressOrders || 0,
      color: "#9b2c2c",
      isIncrease: (metrics.inProgressGrowth || 0) >= 0,
      percentage: `${metrics.inProgressGrowth || 0}%`,
    },
  ];

  const itemsData = [
    {
      title: "Categories",
      value: items.totalCategories || 0,
      color: "#1a202c",
    },
    { title: "Dishes", value: items.totalDishes || 0, color: "#2d3748" },
    {
      title: "Active Tables",
      value: items.activeTables || 0,
      color: "#4a5568",
    },
    { title: "Total Tables", value: items.totalTables || 0, color: "#718096" },
  ];

  return (
    <div className="container mx-auto py-2 px-6 md:px-4 overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-[#ababab]">
            Statistik performa bisnis restoran
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-md bg-[#1a1a1a] text-white"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <div
            key={index}
            className="shadow-sm rounded-lg p-4"
            style={{ backgroundColor: metric.color }}
          >
            <div className="flex justify-between items-center">
              <p className="font-medium text-xs text-[#f5f5f5]">
                {metric.title}
              </p>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                >
                  <path
                    d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
                <p
                  className="font-medium text-xs"
                  style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                >
                  {metric.percentage}
                </p>
              </div>
            </div>
            <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">Item Details</h2>
          <p className="text-sm text-[#ababab]">Detail menu & meja restoran</p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {itemsData.map((item, i) => (
            <div
              key={i}
              className="shadow-sm rounded-lg p-4"
              style={{ backgroundColor: item.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-[#f5f5f5]">
                  {item.title}
                </p>
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
