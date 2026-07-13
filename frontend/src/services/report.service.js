import api from "../utils/axios";

// Sales Report
export const getSalesReport = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const res = await api.get("/reports/sales", {
    params: {
      page,
      limit,
      search,
    },
  });

  return res.data;
};

// Inventory Report
export const getInventoryReport = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const res = await api.get("/reports/inventory", {
    params: {
      page,
      limit,
      search,
    },
  });

  return res.data;
};

// Excel Download
export const exportSalesReport = async () => {
  const res = await api.get("/reports/sales-excel", {
    responseType: "blob",
  });

  return res.data;
};

// Invoice PDF
export const downloadInvoice = async (saleId) => {
  const res = await api.get(`/reports/invoice/${saleId}`, {
    responseType: "blob",
  });

  return res.data;
};