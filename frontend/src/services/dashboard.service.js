import api from "../utils/axios";

// =====================================================
// DASHBOARD REQUEST CACHE
// =====================================================

const CACHE_TIME = 5000; // 5 seconds

const cache = new Map();
const pendingRequests = new Map();

const getCached = async (key, requestFn, forceRefresh = false) => {
  const now = Date.now();
  const cached = cache.get(key);

  // Use recent cached response
  if (!forceRefresh && cached && now - cached.time < CACHE_TIME) {
    return cached.data;
  }

  // If same request is already running, reuse it
  if (!forceRefresh && pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const request = requestFn()
    .then((response) => {
      cache.set(key, {
        data: response.data,
        time: Date.now(),
      });

      return response.data;
    })
    .finally(() => {
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, request);

  return request;
};

// =====================================================
// DASHBOARD STATS
// =====================================================

export const getDashboardStats = async (forceRefresh = false) => {
  return getCached(
    "dashboard-stats",
    () => api.get("/dashboard"),
    forceRefresh
  );
};

// =====================================================
// MONTHLY SALES
// =====================================================

export const getMonthlySales = async (forceRefresh = false) => {
  return getCached(
    "dashboard-monthly-sales",
    () => api.get("/dashboard/monthly-sales"),
    forceRefresh
  );
};

// =====================================================
// RECENT SALES
// =====================================================

export const getRecentSales = async (forceRefresh = false) => {
  return getCached(
    "dashboard-recent-sales",
    () => api.get("/dashboard/recent-sales"),
    forceRefresh
  );
};

// =====================================================
// LOW STOCK
// =====================================================

export const getLowStockProducts = async (forceRefresh = false) => {
  return getCached(
    "dashboard-low-stock",
    () => api.get("/dashboard/low-stock"),
    forceRefresh
  );
};

// =====================================================
// CLEAR DASHBOARD CACHE
// =====================================================

export const clearDashboardCache = () => {
  cache.clear();
};