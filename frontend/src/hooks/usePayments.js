import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPayments } from "../api";

export const usePayments = ({
  page,
  statusFilter,
  periodFilter,
  itemsPerPage = 10,
  search,
}) => {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [
      "payments",
      page,
      statusFilter,
      periodFilter,
      itemsPerPage,
      search,
    ],
    queryFn: () =>
      getPayments({
        page,
        limit: itemsPerPage,
        status: statusFilter,
        period: periodFilter,
        search,
      }),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
    staleTime: 30000,
  });

  return {
    payments: data?.data || [],
    totalPages: data?.totalPages || 1,
    totalAmount: data?.totalAmount || 0,
    isLoading,
    isFetching,
    error,
  };
};
