import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Optional: Modern SVG Icons (agar lucide-react installed hai)
// npm install lucide-react
import { 
  Package, 
  Folder, 
  Truck, 
  ShoppingCart, 
  IndianRupee, 
  AlertTriangle, 
  RefreshCw 
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
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [statsRes, salesRes] = await Promise.all([
        getDashboardStats(),
        getMonthlySales(),
      ]);

      setStats(
        statsRes?.data || {
          totalProducts: 0,
          totalCategories: 0,
          totalSuppliers: 0,
          totalSales: 0,
          totalRevenue: 0,
          lowStock: 0,
        }
      );

      const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const formattedChart = (salesRes?.data || []).map((item) => ({
        month: `${months[item._id.month]} ${item._id.year}`,
        totalSales: item.totalSales,
      }));

      setChartData(formattedChart);
      setFilteredChartData(formattedChart);

      if (isRefresh) toast.success("Dashboard updated!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load dashboard");
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
    if (range === "6m") setFilteredChartData(chartData.slice(-6));
    else if (range === "1y") setFilteredChartData(chartData.slice(-12));
    else setFilteredChartData(chartData);
  };

  // Skeleton Loader with Shimmer effect
  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded-2xl mt-6"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Welcome back,{" "}
            <span className="font-semibold text-blue-600">
              {user?.fullName || "User"}
            </span> 👋
          </p>
        </div>

        {/* Refresh Action */}
        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all rounded-xl border border-slate-200/60 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
          {refreshing ? "Updating..." : "Refresh"}
        </button>
      </div>

      {/* Modern Stat Cards Grid */}
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

      {/* Chart Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Sales Analytics</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Monthly breakdown of items sold
            </p>
          </div>

          {/* Pill Tabs for Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {[
              { label: "All Time", key: "all" },
              { label: "1 Year", key: "1y" },
              { label: "6 Months", key: "6m" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTimeRangeChange(tab.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  timeRange === tab.key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full">
          <SalesChart data={filteredChartData} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <RecentActivity />
      </div>

    </div>
  );
}

export default Dashboard;