import api from "./http";

export const getCategories = async () => {
  const res = await api.get("/api/categories");
  return res.data?.data || res.data || [];
};

export const addCategory = (data) => api.post("/api/categories", data);

export const updateCategory = ({ categoryId, ...categoryData }) =>
  api.patch(`/api/categories/${categoryId}`, categoryData);

export const deleteCategory = (categoryId) =>
  api.delete(`/api/categories/${categoryId}`);
