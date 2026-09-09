import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/order.api";

export const useOrderDetail = ({
  status,
  period,
  page = 1,
  limit = 10,
  search,
} = {}) => {
  const query = useQuery({
    queryKey: ["orders", status, period, search, page, limit],
    queryFn: () => getOrders({ status, period, search, page, limit }),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  return {
    orders: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
  };
};
