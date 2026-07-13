import api from "../utils/axios";

// Get All Categories
export const getCategories = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const response = await api.get(
    `/categories?page=${page}&limit=${limit}&search=${search}`
  );

  return response.data;
};

// Get Category By ID
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create Category
export const createCategory = async (data) => {
  const response = await api.post("/categories", data);
  return response.data;
};

// Update Category
export const updateCategory = async (id, data) => {
  const response = await api.patch(`/categories/${id}`, data);
  return response.data;
};

// Delete Category
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};