import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Package,
  Folder,
  Truck,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import SalesChart from "../../components/dashboard/SalesChart";
import RecentActivity from "../../components/dashboard/RecentActivity";

import { useAuth } from "../../context/AuthContext";

import {
  getDashboardStats,
  getMonthlySales,
} from "../../services/dashboard.service";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStock: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState([]);

  const [timeRange, setTimeRange] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [statsResponse, monthlyResponse] = await Promise.all([
        getDashboardStats(),
        getMonthlySales(),
      ]);

      const statsData = statsResponse?.data || {};

      setStats({
        totalProducts: Number(statsData?.totalProducts || 0),
        totalCategories: Number(statsData?.totalCategories || 0),
        totalSuppliers: Number(statsData?.totalSuppliers || 0),
        totalSales: Number(statsData?.totalSales || 0),
        totalRevenue: Number(statsData?.totalRevenue || 0),
        lowStock: Number(statsData?.lowStock || 0),
      });

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

      const monthlySales = Array.isArray(monthlyResponse?.data)
        ? monthlyResponse.data
        : [];

      const formattedChart = monthlySales
        .map((item) => {
          const month = Number(item?._id?.month);
          const year = item?._id?.year;

          if (!month || month < 1 || month > 12) {
            return null;
          }

          return {
            month: `${months[month]} ${year}`,
            totalSales: Number(item?.totalSales || 0),
          };
        })
        .filter(Boolean);

      setChartData(formattedChart);

      if (timeRange === "6m") {
        setFilteredChartData(formattedChart.slice(-6));
      } else if (timeRange === "1y") {
        setFilteredChartData(formattedChart.slice(-12));
      } else {
        setFilteredChartData(formattedChart);
      }

      if (isRefresh) {
        toast.success("Dashboard updated");
      }
    } catch (error) {
      console.error("Dashboard Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);

    if (range === "6m") {
      setFilteredChartData(chartData.slice(-6));
    } else if (range === "1y") {
      setFilteredChartData(chartData.slice(-12));
    } else {
      setFilteredChartData(chartData);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50  p-4 sm:p-6 md:p-8 transition-colors">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">

          <div className="h-28 bg-white dark:bg-slate-800 rounded-2xl" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-32 bg-white dark:bg-slate-800 rounded-2xl"
              />
            ))}
          </div>

          <div className="h-[420px] bg-white dark:bg-slate-800 rounded-2xl" />

          <div className="h-72 bg-white dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  // ================= DASHBOARD =================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 md:p-8 transition-colors">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Dashboard
            </h1>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Welcome back,{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {user?.fullName || user?.name || "Admin"}
              </span>{" "}
              👋
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all rounded-xl border border-slate-200 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                refreshing ? "animate-spin text-blue-600" : ""
              }`}
            />

            {refreshing ? "Updating..." : "Refresh"}
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">

          <StatCard
            title="Products"
            value={stats.totalProducts}
            icon={<Package className="w-6 h-6 text-blue-600" />}
            gradient="from-blue-500/10 to-indigo-500/10"
            borderColor="border-blue-200"
          />

          <StatCard
            title="Categories"
            value={stats.totalCategories}
            icon={<Folder className="w-6 h-6 text-emerald-600" />}
            gradient="from-emerald-500/10 to-teal-500/10"
            borderColor="border-emerald-200"
          />

          <StatCard
            title="Suppliers"
            value={stats.totalSuppliers}
            icon={<Truck className="w-6 h-6 text-amber-600" />}
            gradient="from-amber-500/10 to-orange-500/10"
            borderColor="border-amber-200"
          />

          <StatCard
            title="Sales"
            value={stats.totalSales}
            icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
            gradient="from-purple-500/10 to-pink-500/10"
            borderColor="border-purple-200"
          />

          <StatCard
            title="Revenue"
            value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
            icon={<IndianRupee className="w-6 h-6 text-emerald-700" />}
            gradient="from-emerald-600/10 to-green-500/10"
            borderColor="border-emerald-300"
          />

          <StatCard
            title="Low Stock"
            value={stats.lowStock}
            icon={<AlertTriangle className="w-6 h-6 text-rose-600" />}
            gradient="from-rose-500/10 to-red-500/10"
            borderColor="border-rose-200"
          />

        </div>

        {/* SALES ANALYTICS */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Sales Analytics
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
                Monthly breakdown of items sold
              </p>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">

              {[
                { label: "All Time", key: "all" },
                { label: "1 Year", key: "1y" },
                { label: "6 Months", key: "6m" },
              ].map((tab) => (

                <button
                  key={tab.key}
                  type="button"
                  onClick={() =>
                    handleTimeRangeChange(tab.key)
                  }
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    timeRange === tab.key
                      ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>

              ))}

            </div>
          </div>

          <SalesChart data={filteredChartData} />

        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">

          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5">
            Recent Sales
          </h2>

          <RecentActivity />

        </div>

      </div>
    </div>
  );
}

export default Dashboard;