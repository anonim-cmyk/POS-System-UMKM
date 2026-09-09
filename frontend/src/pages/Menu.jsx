import { MdRestaurantMenu } from "react-icons/md";
import BackButton from "../components/shared/BackButton";
import BottomNav from "../components/shared/BottomNav";
import MenuContainer from "../components/menu/MenuContainer";
import CartInfo from "../components/menu/CartInfo";
import CustomerInfo from "../components/menu/CustomerInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
const Menu = () => {
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const [showMobileCart, setShowMobileCart] = useState(false);

  return (
    <>
      <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
        {/* Left content */}
        <div className="flex-[3]">
          <div className="flex items-center justify-between px-10 py-4">
            <div className="flex items-center gap-4">
              <BackButton />
              <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
                Menu
              </h1>
            </div>
            <div className="hidden lg:flex items-center justify-around gap-4">
              <div className="flex items-center gap-3 cursor-pointer">
                <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />
                <div className="flex flex-col items-start">
                  <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
                    {customerData.customerName || "Customer Name"}
                  </h1>
                  <p className="text-xs text-[#ababab] font-medium">
                    Table: {customerData.table?.tableNo || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMobileCart(true)}
              className="lg:hidden relative bg-[#2e4a40] text-[#02ca3a] p-3 rounded-lg hover:bg-[#3e5a50] transition-colors"
            >
              <FaShoppingCart size={20} />
              {cartData.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartData.length}
                </span>
              )}
            </button>
          </div>
          <div className="overflow-y-scroll h-[calc(90vh-5rem-5rem)] scrollbar-hide">
            <MenuContainer />
          </div>
        </div>

        {/* Right Content */}
        <div className="hidden lg:flex-[1] lg:flex flex-col bg-[#1a1a1a] mt-4 mr-3 rounded-lg pt-2 overflow-y-scroll h-[calc(90vh-5rem-5rem)] scrollbar-hide">
          {/* Customer Info */}
          <div className="flex-shrink-0">
            <CustomerInfo />
            <hr className="border-[#2a2a2a] border-t-2" />
          </div>
          {/* Cart Items */}
          <div>
            <CartInfo />
          </div>
          <hr className="border-[#2a2a2a] border-t-2" />
          {/* Bills */}
          <div className="flex-shrink-0 pb-4 max-h-[300px] overflow-y-auto scrollbar-hide">
            <Bill />
          </div>
        </div>
        <BottomNav />
      </section>

      {showMobileCart && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setShowMobileCart(false)}
          />

          {/* Slide Panel */}
          <div className="lg:hidden fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-[#1a1a1a] z-50 flex flex-col shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-[#f5f5f5] text-xl font-bold">Your Order</h2>
              <button
                onClick={() => setShowMobileCart(false)}
                className="text-[#f5f5f5] text-3xl font-bold w-10 h-10 flex items-center justify-center hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            {/* Customer Info */}
            <div className="flex-shrink-0">
              <CustomerInfo />
              <hr className="border-[#2a2a2a] border-t-2" />
            </div>

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <CartInfo />
            </div>

            <hr className="border-[#2a2a2a] border-t-2" />

            {/* Bills */}
            <div className="flex-shrink-0 pb-4">
              <Bill />
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Menu;
