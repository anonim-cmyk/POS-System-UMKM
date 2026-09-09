import api from "./http";

export const getDashboardMetrics = (filter = "30d") =>
  api.get(`/api/dashboard/metrics?range=${filter}`);
