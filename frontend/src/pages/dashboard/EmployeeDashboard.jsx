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

function EmployeeDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    mySales: 0,
    myRevenue: 0,
    lowStock: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, salesRes] = await Promise.all([
        getDashboardStats(),
        getMonthlySales(),
      ]);

      // Debugging ke liye browser console check karein
      console.log("Stats API Response:", statsRes);
      console.log("Sales API Response:", salesRes);

      // Safe extraction for nested response structures
      const statsData = statsRes?.data?.data || statsRes?.data || {};
      const salesData = salesRes?.data?.data || salesRes?.data || [];

      // ================================================
      // EMPLOYEE STATS WITH FALLBACK KEYS
      // ================================================
      setStats({
        totalProducts: statsData?.totalProducts ?? statsData?.products ?? 0,
        totalCategories: statsData?.totalCategories ?? statsData?.categories ?? 0,
        totalSuppliers: statsData?.totalSuppliers ?? statsData?.suppliers ?? 0,
        mySales: statsData?.mySales ?? statsData?.totalSales ?? statsData?.sales ?? 0,
        myRevenue: statsData?.myRevenue ?? statsData?.totalRevenue ?? statsData?.revenue ?? 0,
        lowStock: statsData?.lowStock ?? statsData?.lowStockItems ?? 0,
      });

      // ================================================
      // MONTHLY SALES CHART
      // ================================================
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

      const formattedChart = Array.isArray(salesData)
        ? salesData.map((item) => {
            const mIndex = item?._id?.month || 0;
            const year = item?._id?.year || "";
            return {
              month: mIndex > 0 && mIndex <= 12 ? `${months[mIndex]} ${year}` : "Unknown",
              totalSales: item?.totalSales || item?.amount || 0,
            };
          })
        : [];

      setChartData(formattedChart);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load employee dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center font-medium text-slate-500 animate-pulse">
          Loading Dashboard Data...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Employee Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back,{" "}
          <span className="font-semibold text-blue-600 capitalize">
            {user?.name || user?.fullName || "Employee"}
          </span>
        </p>
      </div>

      {/* EMPLOYEE STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Available Products"
          value={stats.totalProducts}
          icon="📦"
          color="bg-blue-600"
        />

        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon="📁"
          color="bg-emerald-600"
        />

        <StatCard
          title="Suppliers"
          value={stats.totalSuppliers}
          icon="🚚"
          color="bg-amber-500"
        />

        <StatCard
          title="My Sales"
          value={stats.mySales}
          icon="🛒"
          color="bg-purple-600"
        />

        <StatCard
          title="My Revenue"
          value={`₹${(Number(stats.myRevenue) || 0).toLocaleString("en-IN")}`}
          icon="💰"
          color="bg-red-600"
        />

        <StatCard
          title="Low Stock Warning"
          value={stats.lowStock}
          icon="⚠️"
          color="bg-orange-500"
        />
      </div>

      {/* MONTHLY SALES CHART */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          My Monthly Sales
        </h2>
        <SalesChart data={chartData} />
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          My Recent Sales
        </h2>
        <RecentActivity />
      </div>
    </div>
  );
}

export default EmployeeDashboard;