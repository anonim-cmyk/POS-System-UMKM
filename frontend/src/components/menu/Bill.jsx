import React, { useState, useEffect } from "react";
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlices";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { addOrder, updatedTable } from "../../https";
import { removeCustomer } from "../../redux/slices/customerSlices";
import { useNavigate } from "react-router-dom";
import Invoice from "../invoice/Invoice";

const Bill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);

  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null); // 🧾 Simpan data order

  // ===============================
  // 🔹 Load Midtrans Snap.js
  // ===============================
  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const midtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    const scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", midtransClientKey);
    scriptTag.async = true;
    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  // ===============================
  // 🔸 Mutasi Tambah Order
  // ===============================
  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (res) => {
      console.log("✅ Order created:", res.data.data);
      const { data } = res.data;
      enqueueSnackbar("Order placed successfully!", { variant: "success" });

      // simpan ke invoice
      setOrderInfo(data);
      setShowInvoice(true);

      // Update status meja
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
      };
      tableUpdateMutation.mutate(tableData);
    },
    onError: (err) => {
      console.error("❌ addOrder Error:", err.response?.data || err.message);
      enqueueSnackbar("Failed to place order", { variant: "error" });
    },
  });

  // ===============================
  // 🔸 Mutasi Update Table
  // ===============================
  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updatedTable(reqData),
    onSuccess: () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (err) => {
      console.error("❌ tableUpdate Error:", err.response?.data || err.message);
    },
  });

  // ===============================
  // 🔸 Handle Place Order
  // ===============================
  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "warning",
      });
      return;
    }

    const orderData = {
      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guests: customerData.guests,
      },
      orderStatus: "In Progress",
      bills: {
        total,
        tax,
        totalWithTax: totalPriceWithTax,
      },
      items: cartData,
      table: customerData.table.tableId,
      paymentMethod,
    };

    console.log("🚀 Sending order to backend:", orderData);
    // 💵 Cash
    if (paymentMethod === "Cash") {
      enqueueSnackbar("Processing cash order...", { variant: "info" });

      try {
        const order_id = "ORDER-" + new Date().getTime();

        // 🔹 Simpan data pembayaran cash ke backend
        await axios.post(
          "http://localhost:8000/api/payment/create-order",
          {
            order_id,
            gross_amount: totalPriceWithTax,
            customer_name: customerData.customerName || "Guest",
            customer_phone: customerData.customerPhone || "-",
            tableNo: customerData.table.tableNo,
            tableId: customerData.table.tableId,
            method: "cash", // penting!
          },
          { withCredentials: true }
        );

        // 🔹 Setelah payment cash tersimpan, lanjut buat order
        orderMutation.mutate({ ...orderData, order_id });
      } catch (err) {
        console.error("❌ Cash Payment Error:", err);
        enqueueSnackbar("Failed to record cash payment", { variant: "error" });
      }
    }

    // 💳 Online (Midtrans)
    if (paymentMethod === "Online") {
      try {
        const order_id = "ORDER-" + new Date().getTime();
        const { data } = await axios.post(
          "http://localhost:8000/api/payment/create-order",
          {
            order_id,
            gross_amount: totalPriceWithTax,
            customer_name: customerData.customerName || "Guest",
            customer_phone: customerData.customerPhone || "-",
            tableNo: customerData.table.tableNo,
            tableId: customerData.table.tableId,
          },
          { withCredentials: true }
        );

        const snapToken = data.token;

        // Jalankan popup Snap Midtrans
        window.snap.pay(snapToken, {
          onSuccess: async function (result) {
            enqueueSnackbar("Payment successful!", { variant: "success" });
            await verifyPayment(order_id);
          },
          onPending: async function () {
            enqueueSnackbar("Waiting for payment confirmation...", {
              variant: "info",
            });
            await verifyPayment(order_id);
          },
          onError: function () {
            enqueueSnackbar("Payment failed!", { variant: "error" });
          },
          onClose: async function () {
            enqueueSnackbar("Checking payment status...", { variant: "info" });
            await verifyPayment(order_id);
          },
        });

        // ✅ Cek status pembayaran
        // ✅ Cek status pembayaran
        async function verifyPayment(order_id) {
          try {
            const response = await axios.post(
              "http://localhost:8000/api/payment/verify-payment",
              { order_id },
              { withCredentials: true }
            );

            const status = response.data.data.transaction_status;

            if (status === "settlement" || status === "capture") {
              enqueueSnackbar("Payment confirmed by Midtrans!", {
                variant: "success",
              });

              // 🔹 Tambahkan stabilizer agar tidak kehilangan pesan sukses
              console.log("✅ Payment Success Detected:", order_id);
              enqueueSnackbar(`Payment Successful! Order ID: ${order_id}`, {
                variant: "success",
              });

              // 🔹 Tambahkan jeda kecil untuk memastikan data tersimpan di backend
              setTimeout(() => {
                orderMutation.mutate({ ...orderData, order_id });
              }, 800);
            } else if (status === "pending") {
              enqueueSnackbar("Payment is still pending.", {
                variant: "warning",
              });
              setTimeout(() => verifyPayment(order_id), 5000);
            } else {
              enqueueSnackbar("Payment not successful.", { variant: "error" });
            }
          } catch (err) {
            console.error("❌ Verify Payment Error:", err);
            enqueueSnackbar("Failed to verify payment.", { variant: "error" });
          }
        }
      } catch (error) {
        console.error("Midtrans Error:", error);
        enqueueSnackbar("Failed to create Midtrans transaction", {
          variant: "error",
        });
      }
    }
  };

  // ===============================
  // 🔸 UI
  // ===============================
  return (
    <>
      {/* Total Items */}
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Items ({cartData.length})
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(total)}
        </h1>
      </div>

      {/* Tax */}
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">Tax (5.25%)</p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(tax)}
        </h1>
      </div>

      {/* Total with Tax */}
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Total with Tax
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(totalPriceWithTax)}
        </h1>
      </div>

      {/* Payment Buttons */}
      <div className="flex items-center gap-3 px-5 mt-4">
        {["Cash", "Online"].map((method) => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`px-4 py-3 w-full rounded-lg font-semibold ${
              paymentMethod === method
                ? "bg-[#383737] text-white"
                : "bg-[#1f1f1f] text-[#ababab]"
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={() => setShowInvoice(true)}
          className="bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg"
        >
          Print Receipt
        </button>
        <button
          onClick={handlePlaceOrder}
          className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg"
        >
          Place Order
        </button>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </>
  );
};

export default Bill;
