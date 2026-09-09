import api from "./http";

export const login = async (data) => {
  console.time("login_api");
  const res = await api.post("/api/user/login", data);
  console.timeEnd("login_api");
  return res;
};

export const register = (data) => api.post("/api/user/register", data);
export const getApiData = () => api.get("/api/user");
export const logout = () => api.post("/api/user/logout");
