import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlices";

const CartInfo = () => {
  const scrolLRef = useRef();
  const cartData = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrolLRef.current) {
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  };

  return (
    <div className="px-3 sm:px-4 md:px-5 py-2">
      <h1 className="text-base sm:text-lg text-[#e4e4e4] font-semibold tracking-wide">
        Order Details
      </h1>
      <div
        className="mt-4 overflow-y-scroll scrollbar-hide h-[300px] sm:h-[350px] md:h-[380px]"
        ref={scrolLRef}
      >
        {cartData.length === 0 ? (
          <p className="text-[#ababab] text-sm flex justify-center items-center h-full text-center px-4">
            Your cart is empty. Start adding items!
          </p>
        ) : (
          cartData.map((item) => {
            return (
              <div
                key={item.dishId}
                className="bg-[#1f1f1f] rounded-lg px-3 sm:px-4 py-3 sm:py-4 mb-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h1 className="text-[#ababab] font-semibold tracking-wide text-sm sm:text-base flex-1 min-w-0 truncate">
                    {item.name}
                  </h1>
                  <p className="text-[#ababab] font-semibold text-sm sm:text-base flex-shrink-0">
                    x{item.quantity}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <RiDeleteBin2Fill
                      onClick={() => handleRemove(item.dishId)}
                      className="text-[#ababab] cursor-pointer flex-shrink-0"
                      size={18}
                    />
                    <FaNotesMedical
                      className="text-[#ababab] cursor-pointer flex-shrink-0"
                      size={18}
                    />
                  </div>
                  <p className="text-[#f5f5f5] text-sm sm:text-base font-bold whitespace-nowrap">
                    Rp. {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CartInfo;
