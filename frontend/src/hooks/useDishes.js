import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteDish, getDishes } from "../api";
import { enqueueSnackbar } from "notistack";

export const useDishes = ({
  page = 1,
  limit = 10,
  all = false,
  search,
} = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: all ? ["dishes", "all"] : ["dishes", { page, limit, search }],
    queryFn: () => getDishes({ page, limit: all ? 1000 : limit, search }),
    placeholderData: keepPreviousData,
    staleTime: 5000,
    select: (res) => res.data,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      enqueueSnackbar("Dish deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
    onError: () => {
      enqueueSnackbar("Failed to delete dish!", { variant: "error" });
    },
  });

  return {
    dishes: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError,
    deleteDish: deleteMutation.mutate,
    isFetching,
  };
};
