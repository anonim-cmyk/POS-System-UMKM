import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { GrRadialSelected } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlices";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getDishes } from "../../https";

const MenuContainer = () => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState(null);

  // Fetch API
  const { data: categoryData, isLoading: catLoad } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: dishesData, isLoading: dishLoad } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  // ✅ Parse category safely
  const categories = Array.isArray(categoryData?.data?.data)
    ? categoryData.data.data
    : Array.isArray(categoryData?.data)
    ? categoryData.data
    : [];

  // ✅ Parse dishes safely
  const dishes = Array.isArray(dishesData?.data?.data)
    ? dishesData.data.data
    : Array.isArray(dishesData?.data)
    ? dishesData.data
    : [];

  // ✅ Merge category + dishes
  const menus = categories.map((cat) => ({
    ...cat,
    items: dishes.filter((dish) => dish?.category?._id === cat._id),
  }));

  // ✅ Auto select first category
  useEffect(() => {
    if (menus.length && !selected) setSelected(menus[0]);
  }, [menus]);

  // Quantity Logic
  const increment = (id) => {
    setItemId(id);
    if (itemCount < 4) setItemCount((prev) => prev + 1);
  };

  const decrement = (id) => {
    setItemId(id);
    if (itemCount > 0) setItemCount((prev) => prev - 1);
  };

  const handleAddToCart = (item) => {
    if (itemCount === 0) return;

    dispatch(
      addItems({
        dishId: item._id, // pastikan dari DB
        name: item.name,
        pricePerQuantity: item.price,
        quantity: itemCount,
        price: item.price * itemCount,
      })
    );

    setItemCount(0);
    setItemId(null);
  };

  // ✅ Skeleton Loading
  if (catLoad || dishLoad)
    return (
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#2a2a2a] animate-pulse h-[100px] rounded-lg"
          />
        ))}
      </div>
    );

  if (!menus.length) return <p className="text-white p-6">No menu data</p>;

  return (
    <>
      {/* Category Grid */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-full">
        {menus.map((menu) => (
          <div
            key={menu._id}
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer"
            style={{ backgroundColor: menu.bgColor || "#222" }}
            onClick={() => {
              setSelected(menu);
              setItemCount(0);
              setItemId(null);
            }}
          >
            <div className="flex items-center justify-between w-full">
              <h1 className="text-[#f5f5f5] text-lg font-semibold">
                {menu.icon} {menu.name}
              </h1>
              {selected?._id === menu._id && (
                <GrRadialSelected className="text-white" size={20} />
              )}
            </div>
            <p className="text-[#ababab] text-sm font-semibold">
              {menu.items.length} Items
            </p>
          </div>
        ))}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      {/* Items Grid */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-full">
        {selected?.items?.map((item) => (
          <div
            key={item._id}
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] bg-[#1a1a1a] hover:bg-[#2a2a2a]"
          >
            <div className="flex items-start justify-between w-full">
              <h1 className="text-[#f5f5f5] text-lg font-semibold">
                {item.name}
              </h1>
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg"
              >
                <FaShoppingCart size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between w-full">
              <p className="text-[#f5f5f5] text-xl font-bold">
                Rp. {item.price}
              </p>

              <div className="flex items-center bg-[#1f1f1f] px-4 py-3 rounded-lg gap-6 w-[50%]">
                <button
                  onClick={() => decrement(item._id)}
                  className="text-yellow-500 text-2xl"
                >
                  &minus;
                </button>
                <span className="text-white">
                  {itemId === item._id ? itemCount : 0}
                </span>
                <button
                  onClick={() => increment(item._id)}
                  className="text-yellow-500 text-2xl"
                >
                  &#43;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MenuContainer;
