import { formatDateAndTime, formatRupiah, getAvatarName } from "../../utils";
import { FaCheckDouble, FaCircle, FaLongArrowAltRight } from "react-icons/fa";

const STATUS_CONFIG = {
  in_progress: {
    text: "text-amber-400",
    bg: "bg-amber-950/50",
    border: "border-amber-800/30",
    dot: "text-amber-400",
    label: "Preparing order",
    pulse: true,
    icon: "circle",
  },
  ready: {
    text: "text-emerald-400",
    bg: "bg-emerald-950/50",
    border: "border-emerald-800/30",
    dot: "text-emerald-400",
    label: "Ready to serve",
    pulse: false,
    icon: "check",
  },
  completed: {
    text: "text-blue-400",
    bg: "bg-blue-950/50",
    border: "border-blue-800/30",
    dot: "text-blue-400",
    label: "Completed",
    pulse: false,
    icon: "check",
  },
};

const OrdersCard = ({ order }) => {
  return (
    <section className="w-full max-w-[480px] bg-gradient-to-br from-[#2a2a2a] to-[#262626] rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#3a3a3a] hover:border-[#4a4a4a] hover:scale-[1.02]">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="bg-gradient-to-br from-[#f6b100] to-[#e09e00] px-4 py-3 rounded-xl text-black font-bold shadow-md flex items-center justify-center min-w-[56px] h-14">
            <span className="text-lg">
              {getAvatarName(order.customer.name)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-bold text-white font-poppins">
              {order.customer.name}
            </h1>
            <p className="text-xs font-semibold text-gray-400">
              #{order.orderCode.slice(-6)} • Dine in
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#ababab] text-xs">Table</span>
              <FaLongArrowAltRight className="text-[#f6b100] text-xs" />
              <span className="text-white text-sm font-semibold bg-[#3a3a3a] px-2 py-0.5 rounded">
                {order.table.tableNo}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {(() => {
            const config =
              STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Progress;

            return (
              <>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.text} ${config.bg} ${config.border}`}
                >
                  {config.icon === "check" ? (
                    <FaCheckDouble className="text-sm" />
                  ) : (
                    <FaCircle
                      className={`text-xs ${
                        config.pulse ? "animate-pulse" : ""
                      }`}
                    />
                  )}
                  <span className="text-sm font-semibold">
                    {order.orderStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#ababab] text-xs">
                  <FaCircle
                    className={`${config.dot} text-[6px] ${
                      config.pulse ? "animate-pulse" : ""
                    }`}
                  />
                  <span>{config.label}</span>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between bg-[#1f1f1f] rounded-lg p-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-400">Order Time</p>
          <p className="text-sm font-semibold text-white">
            {formatDateAndTime(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <p className="text-xs text-gray-400">Items</p>
          <p className="text-sm font-semibold text-white">
            {order.items.length} Items
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mt-4 mb-3" />

      <div className="flex items-center justify-between bg-gradient-to-r from-[#f6b100]/10 to-transparent rounded-lg p-3">
        <h1 className="text-base font-bold text-white font-poppins">
          Total Amount
        </h1>
        <p className="text-xl font-bold text-[#f6b100] font-poppins">
          {formatRupiah(order.bills.totalWithTax)}
        </p>
      </div>
    </section>
  );
};
export default OrdersCard;
