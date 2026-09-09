import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../api/order.api";
import { enqueueSnackbar } from "notistack";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      enqueueSnackbar("Order updated", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};
