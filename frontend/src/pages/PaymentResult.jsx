import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import Invoice from "../components/invoice/Invoice";
import { getInvoiceByOrderCode } from "../api/invoice.api";
import FullScreenLoader from "../components/shared/FullScreenLoader";

const PaymentResult = () => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderCode = searchParams.get("order_code");
  const status = searchParams.get("transaction_status");

  useEffect(() => {
    console.log("🔍 Debug PaymentResult:", {
      orderCode,
      status,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    if (!orderCode) {
      console.error("❌ No order_id found in URL");
      enqueueSnackbar("Order ID not found", { variant: "error" });
      setTimeout(() => navigate("/tables"), 2000);
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("📡 Fetching order:", orderCode);
        const res = await getInvoiceByOrderCode(orderCode);

        console.log("✅ Order fetched:", res.data);

        if (!res?.data?.data) {
          throw new Error("Invalid response format");
        }

        const orderData = {
          ...res.data.data,
          paymentStatus: status || res.data.data.payment?.status || "success",
        };

        setOrder(orderData);
        setIsLoading(false);
      } catch (err) {
        console.error("❌ Error fetching order:", err);

        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load receipt";

        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });
        setTimeout(() => navigate("/tables"), 3000);
      }
    };

    fetchOrder();
  }, [orderCode, status]);

  // Loading state
  if (isLoading) return <FullScreenLoader />;

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1f1f1f] p-4">
        <div className="max-w-md w-full">
          {/* Error card */}
          <div className="bg-[#2a2a2a] border border-red-500/20 rounded-2xl p-8 shadow-2xl">
            {/* Error icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error message */}
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-white">
                Oops! Something went wrong
              </h2>
              <p className="text-red-400 font-medium">{error}</p>
              <p className="text-gray-400 text-sm">
                Redirecting to tables in a moment...
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-6 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-progress"></div>
            </div>

            {/* Manual redirect button */}
            <button
              onClick={() => navigate("/tables")}
              className="mt-6 w-full bg-[#1f1f1f] hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-700"
            >
              Go Back Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f] py-8">
      <Invoice orderInfo={order} paymentInfo={order.payment} />
    </div>
  );
};

export default PaymentResult;
