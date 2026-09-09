import React, { useState, useEffect, useMemo } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { GrRadialSelected } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlices";
import { useCategories } from "../../hooks/useCategories";
import { useDishes } from "../../hooks/useDishes";
import { formatRupiah } from "../../utils";

const MenuContainer = () => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  const [qty, setQty] = useState({});

  const { categories, isLoading: catLoad, isError: catError } = useCategories();
  const {
    dishes,
    isLoading: dishLoad,
    isError: dishError,
  } = useDishes({ all: true });

  // Merge dengan useMemo (supaya tidak recreate terus)
  const menus = useMemo(() => {
    if (categories.length === 0) return [];

    return categories.map((cat) => ({
      ...cat,
      items: dishes.filter((dish) => dish?.category?._id === cat._id),
    }));
  }, [categories, dishes]);

  const selected = useMemo(() => {
    return menus.find((menu) => menu._id === selectedId);
  }, [menus, selectedId]);

  // Auto select first category (hanya sekali)
  useEffect(() => {
    if (!selectedId && menus.length > 0) {
      setSelectedId(menus[0]._id);
    }
  }, [menus.length, selectedId]);

  // Quantity Logic
  const increment = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] || 0) + 1, 4),
    }));
  };

  const decrement = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const handleAddToCart = (item) => {
    const dishQty = qty[item._id] || 0;
    if (dishQty === 0) return;

    dispatch(
      addItems({
        dishId: item._id,
        name: item.name,
        pricePerQuantity: item.price,
        quantity: dishQty,
        price: item.price * dishQty,
      })
    );

    setQty((prev) => ({ ...prev, [item._id]: 0 }));
  };

  // ✅ Loading State
  if (catLoad || dishLoad) {
    return (
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 w-full mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#2a2a2a] animate-pulse h-[100px] rounded-lg"
            />
          ))}
        </div>
        <p className="text-white/60 text-center">Loading menu...</p>
      </div>
    );
  }

  // ✅ Error State
  if (catError || dishError) {
    return (
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 sm:p-6">
          <p className="text-red-400 font-semibold mb-2">Failed to load menu</p>
          <p className="text-red-300/70 text-sm">
            {catError?.message || dishError?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ✅ Empty State
  if (categories.length === 0) {
    return (
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4">
        <p className="text-white/60 text-center">No categories available</p>
      </div>
    );
  }

  return (
    <>
      {/* Category Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 lg:px-10 py-4 w-full">
        {menus.map((menu) => (
          <div
            key={menu._id}
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer transition-all"
            style={{ backgroundColor: menu.bgColor || "#222" }}
            onClick={() => {
              setSelectedId(menu._id);
            }}
          >
            <div className="flex items-center justify-between w-full">
              <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold truncate pr-2">
                {menu.icon} {menu.name}
              </h1>
              {selected?._id === menu._id && (
                <GrRadialSelected
                  className="text-white flex-shrink-0"
                  size={20}
                />
              )}
            </div>
            <p className="text-[#ababab] text-sm font-semibold">
              {dishLoad ? "Loading..." : `${menu.items.length} Items`}
            </p>
          </div>
        ))}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      {/* Items Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 lg:px-10 py-4 w-full">
        {!selected ? (
          <p className="text-white/60 col-span-full text-center">
            Select a category
          </p>
        ) : selected.items.length === 0 ? (
          <p className="text-white/60 col-span-full text-center">
            No items in this category
          </p>
        ) : (
          selected.items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors gap-4"
            >
              {/* Header Section */}
              <div className="flex items-start justify-between w-full gap-2">
                <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold flex-1 line-clamp-2">
                  {item.name}
                </h1>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg hover:bg-[#3e5a50] transition-colors disabled:opacity-50 flex-shrink-0"
                  disabled={!qty[item._id] || qty[item._id] === 0}
                >
                  <FaShoppingCart size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Price & Quantity Section */}
              <div className="flex flex-col gap-3">
                <p className="text-[#f5f5f5] text-lg sm:text-xl font-bold">
                  {formatRupiah(item.price)}
                </p>

                <div className="flex items-center justify-center bg-[#1f1f1f] px-4 py-2 rounded-lg gap-6">
                  <button
                    onClick={() => decrement(item._id)}
                    className="text-yellow-500 text-2xl hover:text-yellow-400 disabled:opacity-30 min-w-[30px] text-center"
                    disabled={!qty[item._id] || qty[item._id] === 0}
                  >
                    &minus;
                  </button>
                  <span className="text-white font-semibold text-base min-w-[24px] text-center">
                    {qty[item._id] || 0}
                  </span>
                  <button
                    onClick={() => increment(item._id)}
                    className="text-yellow-500 text-2xl hover:text-yellow-400 disabled:opacity-30 min-w-[30px] text-center"
                    disabled={qty[item._id] >= 4}
                  >
                    &#43;
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MenuContainer;
