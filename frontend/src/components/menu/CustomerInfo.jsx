import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate, getAvatarName } from "../../utils";

const CustomerInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const customerData = useSelector((state) => state.customer);

  return (
    <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-3">
      <div className="flex flex-col items-start flex-1 min-w-0 pr-3">
        <h1 className="text-sm sm:text-base md:text-lg text-[#f5f5f5] font-semibold tracking-wide truncate w-full">
          {customerData.customerName || "Customer Name"}
        </h1>
        <p className="text-xs text-[#ababab] font-medium mt-1 truncate w-full">
          #{customerData.orderId || "N/A"} / Dine in
        </p>
        <p className="text-xs text-[#ababab] font-medium mt-2">
          {formatDate(dateTime)}
        </p>
      </div>
      <button className="bg-[#f6b100] p-2 sm:p-3 text-lg sm:text-xl font-bold rounded-lg flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
        {getAvatarName(customerData.customerName) || "CN"}
      </button>
    </div>
  );
};

export default CustomerInfo;
