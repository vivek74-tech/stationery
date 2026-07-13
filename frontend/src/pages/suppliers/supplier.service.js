import api from "../utils/axios";

// GET ALL (pagination + search)
export const getSuppliers = async (page = 1, limit = 10, search = "") => {
  const res = await api.get(
    `/suppliers?page=${page}&limit=${limit}&search=${search}`
  );
  return res.data;
};

// GET BY ID
export const getSupplierById = async (id) => {
  const res = await api.get(`/suppliers/${id}`);
  return res.data;
};

// CREATE
export const createSupplier = async (data) => {
  const res = await api.post("/suppliers", data);
  return res.data;
};

// UPDATE
export const updateSupplier = async (id, data) => {
  const res = await api.patch(`/suppliers/${id}`, data);
  return res.data;
};

// DELETE
export const deleteSupplier = async (id) => {
  const res = await api.delete(`/suppliers/${id}`);
  return res.data;
};