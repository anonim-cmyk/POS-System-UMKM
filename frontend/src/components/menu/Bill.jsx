import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlices";
import { removeCustomer } from "../../redux/slices/customerSlices";
import Invoice from "../invoice/Invoice";
import { useOrder } from "../../hooks/useOrder";
import { formatRupiah } from "../../utils";
import { useQueryClient } from "@tanstack/react-query";

const Bill = () => {
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart);
  const customerData = useSelector((state) => state.customer);
  const total = useSelector(getTotalPrice);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);

  const {
    tax,
    totalWithTax,
    isProcessing,
    orderInfo,
    paymentInfo,
    placeOrder,
  } = useOrder({ cartData, customerData, total });

  const queryClient = useQueryClient();

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return;

    const result = await placeOrder(paymentMethod);

    if (!result) return;

    queryClient.invalidateQueries({ queryKey: ["dishes", "popular"] });
    queryClient.invalidateQueries({ queryKey: ["low-stock-dishes"] });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["sales-report"] });

    // Only show invoice for cash payment
    if (result && paymentMethod === "cash") {
      setShowInvoice(true);
    }
  };

  const handlePrintReceipt = () => {
    if (!orderInfo) return;

    if (paymentMethod === "cash") {
      setShowInvoice(true);
    } else {
      window.location.href = `/payment-result?order_id=${orderInfo._id}`;
    }
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    dispatch(removeCustomer());
    dispatch(removeAllItems());
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY
    );
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <>
      {/* Totals */}
      <div className="px-3 sm:px-4 md:px-5 space-y-2 mt-2">
        <div className="flex justify-between">
          <p className="text-xs sm:text-sm text-[#ababab]">
            Items ({cartData.length})
          </p>
          <h1 className="text-sm sm:text-base text-[#f5f5f5] font-bold">
            {formatRupiah(total)}
          </h1>
        </div>
        <div className="flex justify-between">
          <p className="text-xs sm:text-sm text-[#ababab]">Tax (10%)</p>
          <h1 className="text-sm sm:text-base text-[#f5f5f5] font-bold">
            {formatRupiah(tax)}
          </h1>
        </div>
        <div className="flex justify-between">
          <p className="text-xs sm:text-sm text-[#ababab]">Total</p>
          <h1 className="text-sm sm:text-base text-[#f5f5f5] font-bold">
            {formatRupiah(totalWithTax)}
          </h1>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 mt-4">
        {["Cash", "Online"].map((method) => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method.toLowerCase())}
            disabled={isProcessing}
            className={`px-4 py-3 w-full rounded-lg font-semibold text-sm transition-colors ${
              paymentMethod === method.toLowerCase()
                ? "bg-[#383737] text-white"
                : "bg-[#1f1f1f] text-[#ababab]"
            } disabled:opacity-50`}
          >
            {method}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 mt-4">
        <button
          onClick={handlePrintReceipt}
          disabled={!orderInfo || isProcessing}
          className="bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-sm disabled:opacity-50"
        >
          Print Receipt
        </button>

        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing || !paymentMethod}
          className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-sm disabled:opacity-50 flex items-center justify-center"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            "Place Order"
          )}
        </button>
      </div>

      {/* Invoice Modal */}
      {showInvoice && orderInfo && (
        <Invoice
          orderInfo={orderInfo}
          paymentInfo={paymentInfo}
          setShowInvoice={handleCloseInvoice}
        />
      )}
    </>
  );
};

export default Bill;
