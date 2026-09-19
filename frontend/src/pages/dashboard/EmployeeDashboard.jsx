import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Package,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import StatCard from "../../components/dashboard/StatCard";
import SalesChart from "../../components/dashboard/SalesChart";
import RecentActivity from "../../components/dashboard/RecentActivity";

import {
  getDashboardStats,
  getMonthlySales,
} from "../../services/dashboard.service";

// =====================================================
// EMPLOYEE DASHBOARD CACHE
// =====================================================

let dashboardCache = null;
let dashboardRequest = null;

const CACHE_TIME = 10000; // 10 seconds

// =====================================================
// EMPLOYEE DASHBOARD
// =====================================================

function EmployeeDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    mySales: 0,
    myRevenue: 0,
    lowStock: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ===================================================
  // LOAD DASHBOARD
  // ===================================================

  const loadDashboard = async (isRefresh = false) => {
    try {
      // ------------------------------------------------
      // USE CACHE
      // ------------------------------------------------

      if (!isRefresh && dashboardCache) {
        const cacheAge =
          Date.now() - dashboardCache.timestamp;

        if (cacheAge < CACHE_TIME) {
          setStats(dashboardCache.stats);
          setSalesData(dashboardCache.salesData);
          setLoading(false);

          console.log(
            "✅ Employee Dashboard: Using cached data"
          );

          return;
        }
      }

      // ------------------------------------------------
      // SAME REQUEST ALREADY RUNNING
      // ------------------------------------------------

      if (!isRefresh && dashboardRequest) {
        console.log(
          "⏳ Employee Dashboard: Waiting for existing request"
        );

        const result = await dashboardRequest;

        setStats(result.stats);
        setSalesData(result.salesData);
        setLoading(false);

        return;
      }

      // ------------------------------------------------
      // LOADING STATE
      // ------------------------------------------------

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // ------------------------------------------------
      // CREATE ONLY ONE REQUEST
      // ------------------------------------------------

      dashboardRequest = (async () => {
        const [
          statsResponse,
          monthlyResponse,
        ] = await Promise.all([
          getDashboardStats(),
          getMonthlySales(),
        ]);

        // ------------------------------------------------
        // DEBUG
        // ------------------------------------------------

        console.log(
          "Dashboard Stats Response:",
          statsResponse
        );

        console.log(
          "Monthly Sales Response:",
          monthlyResponse
        );

        // ------------------------------------------------
        // IMPORTANT
        // API RESPONSE:
        //
        // {
        //   statusCode: 200,
        //   data: {...},
        //   message: "...",
        //   success: true
        // }
        // ------------------------------------------------

        const statsData =
          statsResponse?.data || {};

        const monthlySales =
          Array.isArray(monthlyResponse?.data)
            ? monthlyResponse.data
            : [];

        // ------------------------------------------------
        // STATS
        // ------------------------------------------------

        const newStats = {
          totalProducts: Number(
            statsData?.totalProducts || 0
          ),

          mySales: Number(
            statsData?.mySales || 0
          ),

          myRevenue: Number(
            statsData?.myRevenue || 0
          ),

          lowStock: Number(
            statsData?.lowStock || 0
          ),
        };

        // ------------------------------------------------
        // MONTHS
        // ------------------------------------------------

        const months = [
          "",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // ------------------------------------------------
        // FORMAT MONTHLY SALES
        // ------------------------------------------------

        const formattedData = monthlySales
          .map((item) => {
            const month = Number(
              item?._id?.month
            );

            const year = item?._id?.year;

            if (
              !month ||
              month < 1 ||
              month > 12
            ) {
              return null;
            }

            return {
              month: `${months[month]} ${year}`,
              totalSales: Number(
                item?.totalSales || 0
              ),
            };
          })
          .filter(Boolean);

        // ------------------------------------------------
        // RESULT
        // ------------------------------------------------

        const result = {
          stats: newStats,
          salesData: formattedData,
        };

        // ------------------------------------------------
        // SAVE CACHE
        // ------------------------------------------------

        dashboardCache = {
          ...result,
          timestamp: Date.now(),
        };

        return result;
      })();

      // ------------------------------------------------
      // WAIT FOR REQUEST
      // ------------------------------------------------

      const result = await dashboardRequest;

      setStats(result.stats);
      setSalesData(result.salesData);

      if (isRefresh) {
        toast.success("Dashboard updated");
      }
    } catch (error) {
      console.error(
        "Employee Dashboard Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      // ------------------------------------------------
      // CLEAR ACTIVE REQUEST
      // ------------------------------------------------

      dashboardRequest = null;

      setLoading(false);
      setRefreshing(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadDashboard();

    // IMPORTANT:
    // Cache ko cleanup mein clear MAT karna.
    return () => {
      console.log(
        "EmployeeDashboard unmounted"
      );
    };
  }, []);

  // ===================================================
  // LOADING UI
  // ===================================================

  if (loading) {
    return (
     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">

          <div className="h-28 bg-white rounded-2xl" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 bg-white rounded-2xl"
              />
            ))}
          </div>

          <div className="h-[400px] bg-white rounded-2xl" />

          <div className="h-72 bg-white rounded-2xl" />
        </div>
      </div>
    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ============================================
            WELCOME HEADER
        ============================================ */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <div className="flex items-center gap-2 mb-2">

                <TrendingUp className="w-6 h-6 text-blue-600" />

                <span className="text-sm font-semibold text-blue-600">
                  Employee Panel
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Welcome back,{" "}
                {user?.fullName ||
                  user?.name ||
                  "Employee"}{" "}
                👋
              </h1>

              <p className="text-slate-500 mt-2">
                Here's your sales and inventory overview.
              </p>
            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </div>

        {/* ============================================
            STATS
        ============================================ */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <StatCard
            title="Available Products"
            value={stats.totalProducts}
            icon={
              <Package className="w-6 h-6 text-blue-600" />
            }
            gradient="from-blue-500/10 to-indigo-500/10"
            borderColor="border-blue-200"
          />

          <StatCard
            title="My Sales"
            value={stats.mySales}
            icon={
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            }
            gradient="from-purple-500/10 to-pink-500/10"
            borderColor="border-purple-200"
          />

          <StatCard
            title="My Revenue"
            value={`₹${stats.myRevenue.toLocaleString(
              "en-IN"
            )}`}
            icon={
              <IndianRupee className="w-6 h-6 text-emerald-600" />
            }
            gradient="from-emerald-500/10 to-green-500/10"
            borderColor="border-emerald-200"
          />

          <StatCard
            title="Low Stock"
            value={stats.lowStock}
            icon={
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            }
            gradient="from-orange-500/10 to-red-500/10"
            borderColor="border-orange-200"
          />

        </div>

        {/* ============================================
            SALES ANALYTICS
        ============================================ */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                My Sales
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Monthly sales performance
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">

              <TrendingUp className="w-4 h-4 text-blue-600" />

              <span className="text-xs font-semibold text-blue-600">
                Sales Analytics
              </span>

            </div>

          </div>

          {salesData.length > 0 ? (
            <SalesChart data={salesData} />
          ) : (
            <div className="h-72 flex items-center justify-center">

              <div className="text-center">

                <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 mb-3" />

                <p className="font-semibold text-slate-500">
                  No sales data available
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Your monthly sales will appear here.
                </p>

              </div>

            </div>
          )}

        </div>

        {/* ============================================
            RECENT SALES
        ============================================ */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">

          <div className="mb-5">

            <h2 className="text-xl font-bold text-slate-800">
              Recent Sales
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your latest sales activity
            </p>

          </div>

          <RecentActivity />

        </div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;