// hooks/useLowStockNotifications.js
import { useQuery } from "@tanstack/react-query";
import { getLowStockDishes } from "../api/dish.api";

export const useLowStockNotifications = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["low-stock-dishes"],
    queryFn: getLowStockDishes,
    // refetchInterval: 60 * 1000, // 🔁 cek tiap 1 menit
    staleTime: 30 * 1000,
  });

  return {
    lowStockItems: data,
    count: data.length,
    isLoading,
  };
};
