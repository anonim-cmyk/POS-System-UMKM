import api from "./http";

export const addOrder = (data) => api.post("/api/order", data);
export const getOrders = (params = {}) => api.get("/api/order", { params });

export const updateOrderStatus = ({ orderId, orderStatus }) =>
  api.patch(`/api/order/${orderId}`, { orderStatus });
export const getOrderById = (orderId) => api.get(`/api/order/${orderId}`);

// export const getOrderByCode = (orderCode) =>
//   api.get(`/api/order/code/${orderCode}`);
