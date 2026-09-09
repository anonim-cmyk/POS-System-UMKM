import { usePopularDishes } from "../../hooks/usePopularDishes";

const PopularDishes = () => {
  const { data: dishes = [], isLoading, error } = usePopularDishes();

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="mt-5 pr-6">
        <div className="bg-[#1a1a1a] w-full rounded-lg p-6">
          <p className="text-white opacity-60 animate-pulse">
            Loading popular dishes...
          </p>
        </div>
      </div>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <div className="mt-5 pr-6">
        <div className="bg-[#1a1a1a] w-full rounded-lg p-6">
          <p className="text-red-400">
            Error loading popular dishes: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 pr-6">
      <div className="bg-[#1a1a1a] w-full rounded-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Popular Dishes
          </h1>
          {/* <a href="#" className="text-[#025cca] text-sm font-semibold">
            View all
          </a> */}
        </div>

        <div className="overflow-y-scroll h-[680px] scrollbar-hide pb-12">
          {dishes.length === 0 ? (
            <p className="text-white/60 text-center py-8">No popular dishes</p>
          ) : (
            dishes.map((dish, index) => (
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
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />

                <div>
                  <h1 className="text-[#f5f5f5] font-semibold tracking-wide">
                    {dish.name}
                  </h1>
                  <p className="text-[#f5f5f5] text-sm font-semibold mt-1">
                    <span className="text-[#ababab]">Orders: </span>
                    {dish.totalQty}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
