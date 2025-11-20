import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, deleteCategory } from "../https";
import { enqueueSnackbar } from "notistack";

export const useCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res?.data || res;
    },
  });

  const categories = Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
    ? res.data
    : [];

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      queryClient.invalidateQueries(["categories"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete category", { variant: "error" });
    },
  });

  return {
    categories,
    isLoading,
    isError,
    deleteCategory: deleteMutation.mutate,
  };
};
