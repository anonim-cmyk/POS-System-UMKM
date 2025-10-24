import { BiCheckDouble } from "react-icons/bi";
import { FaCircle } from "react-icons/fa";

const OrdersCard = () => {
  return (
    <section className="w-[380px] bg-[#262626] rounded-md p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button className="bg-[#f6b100] px-4 py-2 rounded-md text-black font-bold">
            IS
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white font-poppins">
              Ilham Syahdan
            </h1>
            <p className="text-sm font-semibold text-gray-400">#101 Dine In</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-green-600 bg-[#2e4a40] px-2 rounded-md">
            <BiCheckDouble className="inline" size={30} /> Ready
          </p>
          <p className="text-sm text-white">
            <FaCircle className="inline mr-2 text-green-600" />
            Ready To Serve
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-md font-semibold text-white">
          January 18, 2025 08:32 PM
        </p>
        <p className="text-md font-semibold text-white">8 Items</p>
      </div>
      <hr className="w-full border-t-1 border-gray-500 mt-2" />
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-lg font-semibold text-white font-poppins">Total</h1>
        <p className="text-lg font-semibold text-white font-poppins">
          Rp. 250.000
        </p>
      </div>
    </section>
  );
};

export default OrdersCard;
