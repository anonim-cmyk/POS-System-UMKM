import { CiSearch } from "react-icons/ci";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../../https";
import { enqueueSnackbar } from "notistack";

const RecentOrders = () => {
  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }
  return (
    <div className="px-8 mt-8">
      <div className=" bg-[#1a1a1a] w-full h-[450px] rounded-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-poppins font-bold text-white tracking-wide">
            Recent Orders
          </h1>
          <a href="" className="font-semibold text-[#025cca]">
            View All
          </a>
        </div>
        <div className="flex items-center gap-2 bg-[#1f1f1f] rounded-md mx-6 px-5 py-2 text-white">
          <CiSearch size={32} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#1f1f1f] text-[#f5f5f5] px-2 py-1 rounded-md outline-none"
          />
        </div>

        {/* Order List */}
        <div className="overflow-y-scroll h-[350px] scrollbar-hide">
          {resData?.data?.data?.length > 0 ? (
            resData.data.data.map((order) => (
              <OrderList key={order._id} order={order} />
            ))
          ) : (
            <p className="col-span-3 text-gray-500 flex items-center justify-center h-full">
              No order available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
