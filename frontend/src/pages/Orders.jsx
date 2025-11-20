import { useState } from "react";
import OrdersCard from "../components/orders/OrdersCard";
import BackButton from "../components/shared/BackButton";
import BottomNav from "../components/shared/BottomNav";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";

const Orders = () => {
  const [status, setStatus] = useState("all");
  const { data: resData, isError } = useQuery({
    queryKey: ["Orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-y-scroll">
      <div className="mt-4 flex justify-between items-start text-white w-full px-8">
        <div className="flex items-center justify-center gap-2">
          <BackButton />
          <h1 className="text-2xl font-poppins text-white font-bold">Orders</h1>
        </div>
        <div className="flex gap-4 items-center justify-around">
          <button
            className={`${
              status === "all" && "bg-[#343434]"
            } px-4 py-2 rounded-md`}
            onClick={() => setStatus("all")}
          >
            All
          </button>
          <button
            className={`${
              status === "progress" && "bg-[#343434]"
            } px-4 py-2 rounded-md`}
            onClick={() => setStatus("progress")}
          >
            In Progress
          </button>
          <button
            className={`${
              status === "ready" && "bg-[#343434]"
            } px-4 py-2 rounded-md`}
            onClick={() => setStatus("ready")}
          >
            Ready
          </button>
          <button
            className={`${
              status === "completed" && "bg-[#343434]"
            } px-4 py-2 rounded-md`}
            onClick={() => setStatus("completed")}
          >
            Completed
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-start overflow-y-scroll scrollbar-hide mt-7 px-8">
        {resData?.data.data.length > 0 ? (
          resData.data.data.map((order) => (
            <OrdersCard key={order._id} order={order} />
          ))
        ) : (
          <p className="col-span-3 text-gray-500">No order available</p>
        )}
      </div>
      <BottomNav />
    </section>
  );
};

export default Orders;
