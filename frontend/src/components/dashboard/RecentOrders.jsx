import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { formatDateAndTime } from "../../utils";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus, updateTableStatus } from "../../https";

const RecentOrders = () => {
  const queryClient = useQueryClient();

  const orderStatusUpdateMutation = useMutation({
    mutationFn: async ({ orderId, orderStatus, tableId }) => {
      await updateOrderStatus({ orderId, orderStatus });

      // ✅ hanya ubah status meja jika order sudah selesai
      if (orderStatus === "Completed" && tableId) {
        await updateTableStatus({ tableId, status: "Available" });
      }
    },
    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar("Failed to update order status", { variant: "error" });
    },
  });

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => getOrders(),
    placeholderData: keepPreviousData,
  });

  console.log("🧠 resData:", resData);

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const handleStatusChange = ({ orderId, orderStatus, tableId }) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus, tableId });
  };

  const orders = resData?.data?.data || [];

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
        Recent Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-600 hover:bg-[#333]"
                >
                  <td className="p-4">
                    #{Math.floor(new Date(order.orderDate).getTime())}
                  </td>
                  <td className="p-4">{order.customerDetails.name}</td>
                  <td className="p-4">
                    <select
                      className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none ${
                        order.orderStatus === "Completed"
                          ? "text-blue-400"
                          : order.orderStatus === "Ready"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange({
                          orderId: order._id,
                          orderStatus: e.target.value,
                          tableId: order.table._id,
                        })
                      }
                    >
                      <option className="text-yellow-500" value="In Progress">
                        In Progress
                      </option>
                      <option className="text-green-500" value="Ready">
                        Ready
                      </option>
                      <option className="text-blue-400" value="Completed">
                        Completed
                      </option>
                    </select>
                  </td>
                  <td className="p-4">{formatDateAndTime(order.orderDate)}</td>
                  <td className="p-4">{order.items.length} Items</td>
                  <td className="p-4">Table - {order.table.tableNo}</td>
                  <td className="p-4">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(order.bills.totalWithTax)}
                  </td>
                  <td className="p-4">{order.paymentMethod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center text-white py-4 font-semibold"
                >
                  No Orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
