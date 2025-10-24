import axios from "axios";
import { data } from "react-router-dom";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const login = (data) => api.post("/api/user/login", data);
export const register = (data) => api.post("/api/user/register", data);
export const getApiData = () => api.get("/api/user");
export const logout = () => api.post("/api/user/logout");

export const addTable = (data) => api.post("/api/table", data);
export const getTables = () => api.get("/api/table");
export const updatedTable = ({ tableId, ...tableData }) =>
  api.put(`/api/table/${tableId}`, tableData);

export const createOrderMidtrans = (data) =>
  api.post("/api/payment/create-order", data);

export const addOrder = (data) => api.post("/api/order", data);
export const verifyPaymentMidtrans = (data) =>
  api.post("/api/payment/verify-payment", data);
