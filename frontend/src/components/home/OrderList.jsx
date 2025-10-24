import { BiCheckDouble } from "react-icons/bi";
import { FaCircle } from "react-icons/fa";

const OrderList = () => {
  return (
    <div className="flex items-center gap-2 text-white px-8 mt-5">
      <button className="bg-[#f6b100] py-3 px-5 rounded-lg">IL</button>
      <div className="flex justify-between w-[100%] items-center">
        <div className="flex flex-col items-start">
          <p>Ilham Syahdan</p>
          <p>8 items</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-green-600">
            <BiCheckDouble className="inline" size={30} /> Ready
          </p>
          <p className="text-green-600">
            <FaCircle className="inline mr-2" />
            Ready To Serve
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
