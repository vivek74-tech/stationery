import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const [timeRange, setTimeRange] = useState("all"); // Interactive Filter state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch Data Function
  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [statsRes, salesRes] = await Promise.all([
        getDashboardStats(),
        getMonthlySales(),
      ]);

      // Dashboard Stats
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

      // Monthly Sales Formatting
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

      const formattedChart = (salesRes?.data || []).map((item) => ({
        month: `${months[item._id.month]} ${item._id.year}`,
        totalSales: item.totalSales,
      }));

      setChartData(formattedChart);
      setFilteredChartData(formattedChart);

      if (isRefresh) {
        toast.success("Dashboard updated!");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Filter Chart Data Interactively
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

  // Modern Skeleton Loader for Responsive Layout
  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-md w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl mt-6"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Welcome back,{" "}
            <span className="font-semibold text-blue-600">
              {user?.fullName || "User"}
            </span>
            !
          </p>
        </div>

        {/* Refresh & Quick Actions Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className={`text-base ${refreshing ? "animate-spin" : ""}`}>
              🔄
            </span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Interactive Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon="📦"
          color="bg-blue-600"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon="📂"
          color="bg-green-600"
        />
        <StatCard
          title="Suppliers"
          value={stats.totalSuppliers}
          icon="🚚"
          color="bg-amber-500"
        />
        <StatCard
          title="Sales"
          value={stats.totalSales}
          icon="🛒"
          color="bg-purple-600"
        />
        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          icon="💰"
          color="bg-emerald-600"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon="⚠️"
          color="bg-rose-500"
        />
      </div>

      {/* Sales Chart with Interactive Filters */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Sales Overview</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Monthly revenue performance
            </p>
          </div>

          {/* Interactive Chart Filter Buttons */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
            {["all", "1y", "6m"].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  timeRange === range
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range === "all" ? "All Time" : range === "1y" ? "Last 1 Year" : "Last 6 Months"}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Component */}
        <div className="w-full overflow-x-auto">
          <SalesChart data={filteredChartData} />
        </div>
      </div>

      {/* Recent Activity Container */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <RecentActivity />
      </div>

    </div>
  );
}

export default Dashboard;

