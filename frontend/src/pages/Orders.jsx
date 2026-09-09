import { FaClipboardList } from "react-icons/fa";
import OrdersCard from "../components/orders/OrdersCard";
import BackButton from "../components/shared/BackButton";
import BottomNav from "../components/shared/BottomNav";
import { useOrderDetail } from "../hooks/useOrderDetail";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";

const ORDER_STATUS = {
  ALL: "all",
  PROGRESS: "in_progress",
  READY: "ready",
  COMPLETED: "completed",
};

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  const debouncedSearch = useDebounce(search, 400);

  const handleStatusChange = (value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (value === "all") {
        params.delete("status");
      } else {
        params.set("status", value);
      }

      return params;
    });
  };

  const { orders } = useOrderDetail({
    status: status === "all" ? undefined : status,
    search: debouncedSearch,
  });

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hide">
      <div className="mt-4 flex justify-between items-start text-white w-full px-8 flex-wrap">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        <div className="flex gap-2 bg-[#2a2a2a] p-1.5 rounded-xl shadow-inner">
          {Object.values(ORDER_STATUS).map((value) => (
            <button
              key={value}
              onClick={() => handleStatusChange(value)}
              className={`px-4 py-2 rounded-md ${
                status === value ? "bg-[#343434]" : ""
              }`}
            >
              {value === "all" ? "All" : value}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 mt-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.length > 0 ? (
            orders.map((order) => <OrdersCard key={order._id} order={order} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="bg-[#262626] rounded-full p-8 mb-4">
                <FaClipboardList className="text-6xl text-gray-600" />
              </div>
              <p className="text-xl text-gray-500 font-semibold">
                No orders available
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Orders will appear here when customers place them
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
