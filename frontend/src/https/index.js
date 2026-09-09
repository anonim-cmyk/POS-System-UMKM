import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🧍 User
// export const login = (data) => api.post("/api/user/login", data);
// export const register = (data) => api.post("/api/user/register", data);
// export const getApiData = () => api.get("/api/user");
// export const logout = () => api.post("/api/user/logout");

// 🍽️ Table
// export const addTable = (data) => api.post("/api/table", data);
// export const getTables = () => api.get("/api/table");
// export const updatedTable = ({ tableId, ...tableData }) =>
//   api.put(`/api/table/${tableId}`, tableData);
// export const updateTableStatus = ({ tableId, status }) =>
//   api.patch(`/api/table/${tableId}/status`, { status });
// export const deleteTable = (tableId) => api.delete(`/api/table/${tableId}`);

// 💳 Payment (Midtrans)
// export const createOrderMidtrans = (data) =>
//   api.post("/api/payment/create-order", data);
// export const verifyPaymentMidtrans = (data) =>
//   api.post("/api/payment/verify-payment", data);

// 🧾 Orders
// export const addOrder = (data) => api.post("/api/order", data);
// export const getOrders = () => api.get("/api/order");
// export const updateOrderStatus = ({ orderId, orderStatus }) =>
//   api.patch(`/api/order/${orderId}`, { orderStatus });
// export const getOrderById = (orderId) => api.get(`/api/order/${orderId}`);

// 🗂️ Category
// export const addCategory = (data) => api.post("/api/categories", data);
// export const getCategories = () => api.get("/api/categories");
// export const updateCategory = ({ categoryId, ...categoryData }) =>
//   api.patch(`/api/categories/${categoryId}`, categoryData);
// export const deleteCategory = (categoryId) =>
//   api.delete(`/api/categories/${categoryId}`);

// 🍛 Dishes
// export const addDish = (data) => api.post("/api/dishes", data);
// export const getDishes = () => api.get("/api/dishes");
// export const updateDish = ({ dishId, ...dishData }) =>
//   api.put(`/api/dishes/${dishId}`, dishData);
// export const deleteDish = (dishId) => api.delete(`/api/dishes/${dishId}`);
// export const getPopularDishes = () => api.get("/api/dishes/popular/list");

// 📊 Dashboard
// export const getDashboardMetrics = (filter = "30d") =>
//   api.get(`/api/dashboard/metrics?range=${filter}`);

// 💰 Payment (Custom Query with Pagination & Filter)
// export const getPayments = ({
//   page = 1,
//   limit = 10,
//   status = "",
//   period = "",
// } = {}) => {
//   const params = new URLSearchParams();
//   params.append("page", page);
//   params.append("limit", limit);
//   if (status) params.append("status", status);
//   if (period) params.append("period", period);

//   return api.get(`/api/payment/filtered?${params.toString()}`);
// };
