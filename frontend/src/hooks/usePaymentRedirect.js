// import { useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { getOrderByCode } from "../api/order.api";
// import { useEffect } from "react";

// export const usePaymentRedirect = () => {
//   const [order, setOrder] = useState(null);
//   const [searchParams] = useSearchParams();

//   const orderId = searchParams.get("order_id");
//   const status = searchParams.get("transaction_status");

//   useEffect(() => {
//     if (!orderId || !status) return;

//     let isMounted = true;

//     const fetchOrder = async () => {
//       try {
//         const res = await getOrderByCode(orderId);
//         if (isMounted) {
//           setOrder({
//             ...res.data,
//             paymentStatus: status,
//           });
//         }
//       } catch (err) {
//         console.error("Failed to fetch order:", err);
//       }
//     };

//     fetchOrder();

//     return () => {
//       isMounted = false;
//     };
//   }, [orderId, status]);

//   return order;
// };
