import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaPrint, FaTimes, FaReceipt } from "react-icons/fa";
import { formatRupiah } from "../../utils";

const Invoice = ({ orderInfo, setShowInvoice, paymentInfo }) => {
  console.log("paymentInfo", paymentInfo);

  console.log("orderinfo", orderInfo);

  const navigate = useNavigate();
  const isModal = typeof setShowInvoice === "function";
  const invoiceRef = useRef(null);

  const handleClose = () => {
    if (isModal) {
      setShowInvoice(false);
    } else {
      // Untuk standalone page (PaymentResult)
      navigate("/tables");
    }
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
      <html>
        <head>
          <title>Order Receipt - ${orderInfo._id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              background: #fff;
              text: center;
            }
            .receipt-container { 
              max-width: 400px; 
              margin: 0 auto;
              border: 1px solid #ddd; 
              padding: 20px; 
            }
            h2, h3 { 
              text-align: center; 
              color: #333;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .total-row {
              font-weight: bold;
              font-size: 1.2em;
              margin-top: 16px;
              padding-top: 16px;
              border-top: 2px solid #333;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 500);
  };

  const paymentMethod = paymentInfo?.method || "CASH";
  const paymentStatus =
    paymentInfo?.status || (method === "cash" ? "PAID" : "PENDING");
  const paymentCode = paymentInfo?.paymentCode || "-";
  const midtrans = paymentInfo?.midtrans || null;

  // Determine payment status color
  const getStatusColor = () => {
    const status = paymentStatus.toLowerCase();
    if (status === "paid" || status === "settlement" || status === "success") {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }
    if (status === "pending") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  return (
    <div
      className={
        isModal
          ? "fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          : "min-h-screen bg-[#1f1f1f] flex justify-center items-start py-8 px-4"
      }
    >
      <div className="bg-[#2a2a2a] rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[90vh] flex flex-col border border-gray-700/50">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 bg-[#2a2a2a] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-orange-500 rounded-full flex items-center justify-center bg-orange-500/20 shadow-lg shadow-orange-500/20">
              <FaCheck className="text-orange-500 text-lg sm:text-xl" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Order Receipt
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Thank you for your order!
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-700/50 rounded-full transition-colors group"
            aria-label="Close invoice"
          >
            <FaTimes className="text-gray-400 group-hover:text-white text-lg sm:text-xl transition-colors" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          <div ref={invoiceRef}>
            {/* Order Info */}
            <div className="bg-[#1f1f1f] rounded-xl p-4 shadow-lg border border-gray-700/30 mb-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-orange-500 rounded"></span>
                Order Information
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Invoice ID:</span>
                  <span className="font-semibold text-white font-mono text-xs">
                    {orderInfo.orderCode?.slice(-8) || "-"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-semibold text-white">
                    {new Date(orderInfo.orderDate || Date.now()).toLocaleString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Name:</span>
                  <span className="font-semibold text-white">
                    {orderInfo.customer?.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Phone:</span>
                  <span className="font-semibold text-white">
                    {orderInfo.csutomer?.phone || "-"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Guests:</span>
                  <span className="font-semibold text-white">
                    {orderInfo.customer?.guests || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-[#1f1f1f] rounded-xl p-4 shadow-lg border border-gray-700/30 mb-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-green-500 rounded"></span>
                Items Ordered
              </h3>
              <div className="space-y-3">
                {orderInfo.items?.map((item, index) => (
                  <div
                    key={index}
                    className="pb-3 border-b border-gray-700/30 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <span className="text-xs sm:text-sm font-medium text-white">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          × {item.qty}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-orange-400 ml-2">
                        {formatRupiah(item.price * item.qty)}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500">
                      @{formatRupiah(item.price)} per item
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bills */}
            <div className="bg-[#1f1f1f] rounded-xl p-4 shadow-lg border border-gray-700/30 mb-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded"></span>
                Payment Summary
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-medium text-white">
                    {formatRupiah(orderInfo.bills?.total || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Tax (10%):</span>
                  <span className="font-medium text-white">
                    {formatRupiah(orderInfo.bills?.tax || 0)}
                  </span>
                </div>
                <div className="pt-3 mt-2 border-t-2 border-gray-700 flex justify-between">
                  <span className="font-bold text-white">Grand Total:</span>
                  <span className="text-base sm:text-lg font-bold text-orange-500">
                    {formatRupiah(orderInfo.bills?.totalWithTax || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-[#1f1f1f] rounded-xl p-4 shadow-lg border border-gray-700/30">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded"></span>
                Payment Details
              </h3>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Method:</span>
                  <span className="font-semibold text-white uppercase">
                    {paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}
                  >
                    {paymentStatus.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Payment Code:</span>
                  <span className="font-mono text-xs text-white bg-gray-700/50 px-2 py-1 rounded">
                    {paymentCode}
                  </span>
                </div>

                {midtrans?.transaction_id && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="font-mono text-xs text-white bg-gray-700/50 px-2 py-1 rounded">
                      {midtrans.transaction_id}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-700/50 bg-[#2a2a2a] rounded-b-2xl">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 text-sm sm:text-base"
          >
            <FaPrint className="text-sm sm:text-base" />
            Print
          </button>
          <button
            onClick={handleClose}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg text-sm sm:text-base"
          >
            <FaTimes className="text-sm sm:text-base" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
