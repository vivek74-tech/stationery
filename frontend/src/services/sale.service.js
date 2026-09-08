import api from "../utils/axios";

export const getSales = async (page = 1, limit = 10, search = "") => {
  const res = await api.get(`/sales?page=${page}&limit=${limit}&search=${search}`);
  return res.data;
};

export const createSale = async (data) => {
  const res = await api.post("/sales", data);
  return res.data;
};

export const getSaleById = async (id) => {
  const res = await api.get(`/sales/${id}`);
  return res.data;
};

// Fixed: Router endpoint mismatch resolved
export const getSalesSummary = async () => {
  const res = await api.get("/sales/summary/dashboard");
  return res.data;
};

// Fixed: Router endpoint mismatch resolved
export const getTopSellingProducts = async (limit = 5) => {
  const res = await api.get(`/sales/analytics/top-products?limit=${limit}`);
  return res.data;
};

export const downloadInvoice = async (id) => {
  const res = await api.get(`/sales/${id}/invoice`, { responseType: "blob" });
  return res.data;
};

export const deleteSale = async (id) => {
  const res = await api.get(`/sales/${id}`);
  return res.data;
};