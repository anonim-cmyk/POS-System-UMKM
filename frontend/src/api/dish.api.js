import api from "./http";

export const getDishes = async (params = {}) =>
  api.get("/api/dishes", { params });

export const addDish = (data) => api.post("/api/dishes", data);

export const updateDish = ({ dishId, ...dishData }) =>
  api.put(`/api/dishes/${dishId}`, dishData);

export const deleteDish = (dishId) => api.delete(`/api/dishes/${dishId}`);

export const getPopularDishes = async () => {
  const res = await api.get("/api/dishes/popular/list");
  return res.data?.data || res.data || [];
};

export const getLowStockDishes = async () => {
  const res = await api.get(`/api/dishes/low-stock?thresold=5`);
  return res.data.data;
};
