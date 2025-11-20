import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDishes, deleteDish } from "../https";
import { enqueueSnackbar } from "notistack";

export const useDishes = () => {
  const queryClient = useQueryClient();

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dishes"],
    queryFn: async () => {
      const res = await getDishes();
      return res?.data || res; // backend bisa return {data:[]} atau []
    },
  });

  // ✅ Normalisasi supaya SELALU array
  const dishes = Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
    ? res.data
    : [];

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteDish(id),
    onSuccess: () => {
      enqueueSnackbar("Dish deleted successfully", { variant: "success" });
      queryClient.invalidateQueries(["dishes"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete dish", { variant: "error" });
    },
  });

  return {
    dishes,
    isLoading,
    isError,
    deleteDish: deleteMutation.mutate,
  };
};
