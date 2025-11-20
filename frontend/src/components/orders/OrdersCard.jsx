import { BiCheckDouble } from "react-icons/bi";
import { FaCheckDouble, FaCircle, FaLongArrowAltRight } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils";

const OrdersCard = ({ order }) => {
  return (
    <section className="w-[480px] bg-[#262626] rounded-md p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button className="bg-[#f6b100] px-4 py-2 rounded-md text-black font-bold">
            {getAvatarName(order.customerDetails.name)}
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white font-poppins">
              {order.customerDetails.name}
            </h1>
            <p className="text-sm font-semibold text-gray-400">
              #{Math.floor(new Date(order.orderDate).getTime())} / Dine in
            </p>
            <p className="text-[#ababab] text-sm">
              Table{" "}
              <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
              {order.table.tableNo}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {order.orderStatus === "Ready" ? (
            <>
              <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg">
                <FaCheckDouble className="inline mr-2" /> {order.orderStatus}
              </p>
              <p className="text-[#ababab] text-sm">
                <FaCircle className="inline mr-2 text-green-600" /> Ready to
                serve
              </p>
            </>
          ) : (
            <>
              <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg">
                <FaCircle className="inline mr-2" /> {order.orderStatus}
              </p>
              <p className="text-[#ababab] text-sm">
                <FaCircle className="inline mr-2 text-yellow-600" /> Preparing
                your order
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-md font-semibold text-white">
          {formatDateAndTime(order.createdAt)}
        </p>
        <p className="text-md font-semibold text-white">
          {order.items.length} Items
        </p>
      </div>
      <hr className="w-full border-t-1 border-gray-500 mt-2" />
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-lg font-semibold text-white font-poppins">Total</h1>
        <p className="text-lg font-semibold text-white font-poppins">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(order.bills.totalWithTax)}
        </p>
      </div>
    </section>
  );
};

export default OrdersCard;
