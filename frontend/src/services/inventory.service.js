import api from "../utils/axios";


// ==============================
// GET INVENTORY HISTORY
// ==============================

export const getInventory = async (params = {}) => {

  const res = await api.get(
    "/inventory/history",
    {
      params,
    }
  );

  return res.data;
};



// ==============================
// STOCK IN
// ==============================

export const stockIn = async (data) => {

  const res = await api.post(
    "/inventory/stock-in",
    data
  );

  return res.data;
};



// ==============================
// STOCK OUT
// ==============================

export const stockOut = async (data) => {

  const res = await api.post(
    "/inventory/stock-out",
    data
  );

  return res.data;
};



// ==============================
// GET PRODUCT INVENTORY HISTORY
// ==============================

export const getInventoryByProduct = async (
  productId
) => {

  const res = await api.get(
    `/inventory/product/${productId}`
  );

  return res.data;
};



// ==============================
// UPDATE INVENTORY NOTE
// ==============================

export const updateInventory = async (
  id,
  data
) => {

  const res = await api.patch(
    `/inventory/${id}`,
    data
  );

  return res.data;
};



// ==============================
// DELETE INVENTORY
// ==============================

export const deleteInventory = async (
  id
) => {

  const res = await api.delete(
    `/inventory/${id}`
  );

  return res.data;
};