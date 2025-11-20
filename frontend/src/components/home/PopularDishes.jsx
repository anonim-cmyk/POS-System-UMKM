import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const PopularDishes = () => {
  const fetchDishes = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dishes`, {
      credentials: "include",
    });
    const data = await res.json();

    // Pastikan array
    return Array.isArray(data.data) ? data.data : [];
  };

  const fetchOrders = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order`, {
      credentials: "include",
    });

    const json = await res.json();

    console.log("RAW ORDER API:", json);

    const orders = Array.isArray(json.data) ? json.data : [];

    console.log("CLEANED orders:", orders);

    return orders;
  };

  const { data: dishes = [], isLoading: loadingDishes } = useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
    refetchInterval: 5000,
  });

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    select: (response) => {
      console.log("SELECT response:", response);
      return Array.isArray(response) ? response : [];
    },
    refetchInterval: 5000,
  });

  // Saat loading
  if (loadingDishes || loadingOrders)
    return <p className="text-white">Loading...</p>;

  // Hitung jumlah order per dish
  const dishOrdersCount = {};

  orders.forEach((order) => {
    order?.items?.forEach((item) => {
      const id = item.dishId;
      if (!dishOrdersCount[id]) dishOrdersCount[id] = 0;
      dishOrdersCount[id] += item.quantity;
    });
  });

  const combinedDishes = dishes.map((dish) => ({
    ...dish,
    numberOfOrders: dishOrdersCount[dish._id] || 0,
  }));

  return (
    <div className="mt-5 pr-6">
      <div className="bg-[#1a1a1a] w-full rounded-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Popular Dishes
          </h1>
          <a href="" className="text-[#025cca] text-sm font-semibold">
            View all
          </a>
        </div>

        <div className="overflow-y-scroll h-[680px] scrollbar-hide">
          {combinedDishes.map((dish, index) => (
            <div
              key={dish._id}
              className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mt-4 mx-6"
            >
              <h1 className="text-[#f5f5f5] font-bold text-xl mr-4">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </h1>

              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-[50px] h-[50px] rounded-full"
              />

              <div>
                <h1 className="text-[#f5f5f5] font-semibold tracking-wide">
                  {dish.name}
                </h1>
                <p className="text-[#f5f5f5] text-sm font-semibold mt-1">
                  <span className="text-[#ababab]">Orders: </span>
                  {dish.numberOfOrders}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
