import api from "../utils/axios";

// Dashboard Statistics
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};

// Monthly Sales
export const getMonthlySales = async () => {
  const res = await api.get("/dashboard/monthly-sales");
  return res.data;
};

// Recent Sales
export const getRecentSales = async () => {
  const res = await api.get("/dashboard/recent-sales");
  return res.data;
};

// Low Stock Products
export const getLowStockProducts = async () => {
  const res = await api.get("/dashboard/low-stock");
  return res.data;
};