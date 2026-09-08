import api from "../utils/axios";

// =====================================================
// DASHBOARD STATS
// =====================================================

export const getDashboardStats = async () => {
  const res = await api.get("/dashboard");

  console.log("Dashboard Stats Response:", res.data);

  return res.data;
};

// =====================================================
// MONTHLY SALES
// =====================================================

export const getMonthlySales = async () => {
  const res = await api.get("/dashboard/monthly-sales");

  console.log("Monthly Sales Response:", res.data);

  return res.data;
};

// =====================================================
// RECENT SALES
// =====================================================

export const getRecentSales = async () => {
  const res = await api.get("/dashboard/recent-sales");

  console.log("Recent Sales Response:", res.data);

  return res.data;
};

// =====================================================
// LOW STOCK PRODUCTS
// =====================================================

export const getLowStockProducts = async () => {
  const res = await api.get("/dashboard/low-stock");

  console.log("Low Stock Response:", res.data);

  return res.data;
};