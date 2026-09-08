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
    mySales: 0,
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

      // Safe Data Unwrapping (Supports both Service return types)
      const statsData = statsRes?.data || statsRes || {};
      const rawSalesArray = Array.isArray(salesRes?.data)
        ? salesRes.data
        : Array.isArray(salesRes)
        ? salesRes
        : [];

      // Update Stats
      setStats({
        totalProducts: Number(statsData?.totalProducts ?? 0),
        mySales: Number(statsData?.mySales ?? 0),
        lowStock: Number(statsData?.lowStock ?? 0),
      });

      // Months Array
      const months = [
        "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      // Format Chart Data
      const formattedChart = rawSalesArray.map((item) => {
        const monthIndex = Number(item?._id?.month ?? 0);
        const year = item?._id?.year ?? "";

        return {
          month:
            monthIndex >= 1 && monthIndex <= 12
              ? `${months[monthIndex]} ${year}`
              : "Unknown",
          totalSales: Number(item?.totalSales ?? item?.amount ?? 0),
        };
      });

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
            {user?.fullName || user?.name || "Employee"}
          </span>
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Available Products"
          value={stats.totalProducts}
          icon="📦"
          color="bg-blue-600"
        />

        <StatCard
          title="My Sales"
          value={stats.mySales}
          icon="🛒"
          color="bg-purple-600"
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

        {chartData.length > 0 ? (
          <SalesChart data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm font-medium">
            No sales data available
          </div>
        )}
      </div>

      {/* RECENT SALES */}
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