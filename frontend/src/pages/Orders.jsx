import { useState } from "react";
import OrdersCard from "../components/orders/OrdersCard";
import BackButton from "../components/shared/BackButton";
import BottomNav from "../components/shared/BottomNav";

const Orders = () => {
  const [status, setStatus] = useState("all");
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
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
      <div className="mt-7 flex flex-wrap gap-4 items-center justify-center overflow-y-scroll scrollbar-hide h-[calc(100vh-5rem-5rem)]">
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
        <OrdersCard />
      </div>
      <BottomNav />
    </section>
  );
};

export default Orders;
