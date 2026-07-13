import api from "../utils/axios";

// Get All Suppliers
export const getSuppliers = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const response = await api.get(
    `/suppliers?page=${page}&limit=${limit}&search=${search}`
  );

  return response.data;
};

// Get Supplier By ID
export const getSupplierById = async (id) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

// Create Supplier
export const createSupplier = async (data) => {
  const response = await api.post("/suppliers", data);
  return response.data;
};

// Update Supplier
export const updateSupplier = async (id, data) => {
  const response = await api.patch(`/suppliers/${id}`, data);
  return response.data;
};

// Delete Supplier
export const deleteSupplier = async (id) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};