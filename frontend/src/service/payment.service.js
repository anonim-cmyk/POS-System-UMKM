import { createOrderMidtrans } from "../api/payment.api";

export const processPayment = async ({
  orderCode,
  amount,
  customer,
  table,
  method,
}) => {
  const res = await createOrderMidtrans({
    order_id: orderCode,
    gross_amount: amount,
    method,
    customer_name: customer.name,
    customer_phone: customer.phone,
    tableNo: table.tableNo,
    tableId: table.tableId,
  });

  console.log("res: ", res.data.data);

  // Cash payment langsung return
  if (method === "cash") {
    return { status: "success", ...res.data.data };
  }

  // Online payment - tunggu Midtrans callback
  if (method === "online") {
    const token = res.data.data.snapToken;

    if (!token) throw new Error("Snap token is missing!");

    return new Promise((resolve, reject) => {
      window.snap.pay(token, {
        onSuccess: (result) => {
          console.log("✅ Payment success:", result);
          resolve({ status: "success", ...result });
        },

        onPending: (result) => {
          console.log("⏳ Payment pending:", result);
          // OPSI 1: Reject pending (invoice hanya muncul kalau berhasil)
          reject(new Error("Payment is pending. Please complete the payment."));
        },

        onError: (error) => {
          console.error("❌ Payment error:", error);
          reject(new Error(error?.status_message || "Payment failed"));
        },

        onClose: () => {
          console.log("🚪 Payment popup closed");
          reject(new Error("Payment cancelled by user"));
        },
      });
    });
  }

  return res.data.data;
};
