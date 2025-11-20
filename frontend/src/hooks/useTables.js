import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTables, deleteTable } from "../https";
import { enqueueSnackbar } from "notistack";

export const useTables = () => {
  const queryClient = useQueryClient();

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await getTables();
      return res?.data || res; // fallback kalau backend return array langsung
    },
  });

  const tables = Array.isArray(res) ? res : res?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTable(id),
    onSuccess: () => {
      enqueueSnackbar("Table deleted successfully", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete table", { variant: "error" });
    },
  });

  return {
    tables,
    isLoading,
    isError,
    deleteTable: deleteMutation.mutate,
  };
};
