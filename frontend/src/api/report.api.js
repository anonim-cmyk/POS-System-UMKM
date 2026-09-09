import api from "./http";

export const getSalesReport = (period) =>
  api.get(`/api/sales`, { params: { period } });
