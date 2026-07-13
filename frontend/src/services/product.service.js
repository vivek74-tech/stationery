import api from "../utils/axios";

export const getProducts = ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  supplier = "",
  sort = "-createdAt",
}) => {
  return api.get("/products", {
    params: {
      page,
      limit,
      search,
      category,
      supplier,
      sort,
    },
  });
};

export const getProductById = (id) => api.get(`/products/${id}`);

export const createProduct = (data) =>
  api.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateProduct = (id, data) =>
  api.patch(`/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteProduct = (id) => api.delete(`/products/${id}`);