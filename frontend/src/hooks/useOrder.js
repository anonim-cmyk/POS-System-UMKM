import { useState, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { buildOrderPayload, calculateTax } from "../utils/order.utils";
import { addOrder } from "../api/order.api";
import { createOrderMidtrans } from "../api/payment.api";

const PAYMENT_METHODS = {
  CASH: "cash",
  ONLINE: "online",
};

export const useOrder = ({ cartData, customerData, total }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const lockRef = useRef(false);

  const tax = calculateTax(total);
  const totalWithTax = total + tax;

  const createOrder = async () => {
    const payload = buildOrderPayload({
      customer: customerData,
      cart: cartData,
      total,
      tableId: customerData?.table?.tableId,
    });

    const response = await addOrder(payload);
    return response.data.data;
  };

  const handleCashPayment = async (orderCode) => {
    return await createOrderMidtrans({
      orderCode,
      paymentMethod: PAYMENT_METHODS.CASH,
    });
  };

  const handleOnlinePayment = async (orderCode) => {
    const payment = await createOrderMidtrans({
      orderCode,
      paymentMethod: PAYMENT_METHODS.ONLINE,
    });

    const snapToken = payment?.data?.snapToken || payment?.snapToken;

    if (!snapToken || !window.snap) {
      throw new Error("Payment gateway unavailable");
    }

    return new Promise((resolve) => {
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          enqueueSnackbar("Payment successful", { variant: "success" });
          window.location.href = `/payment-result?order_code=${orderCode}&transaction_status=settlement`;
        },
        onPending: (result) => {
          enqueueSnackbar("Payment pending", { variant: "warning" });
          window.location.href = `/payment-result?order_code=${orderCode}&transaction_status=pending`;
        },
        onError: () => {
          enqueueSnackbar("Payment failed", { variant: "error" });
          resolve(payment);
        },
        onClose: () => resolve(payment),
      });
    });
  };

  const placeOrder = async (paymentMethod) => {
    if (lockRef.current || !cartData?.length) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return null;
    }

    lockRef.current = true;
    setIsProcessing(true);

    try {
      const order = await createOrder();
      setOrderInfo(order);

      const payment =
        paymentMethod === PAYMENT_METHODS.CASH
          ? await handleCashPayment(order.orderCode)
          : await handleOnlinePayment(order.orderCode);

      setPaymentInfo(payment);

      if (paymentMethod === PAYMENT_METHODS.CASH) {
        enqueueSnackbar("Order placed successfully", { variant: "success" });
      }

      return { order, payment };
    } catch (err) {
      console.error("Order failed:", err);
      enqueueSnackbar(err.message || "Failed to place order", {
        variant: "error",
      });
      return null;
    } finally {
      setIsProcessing(false);
      lockRef.current = false;
    }
  };

  return {
    tax,
    totalWithTax,
    isProcessing,
    orderInfo,
    paymentInfo,
    placeOrder,
  };
};
