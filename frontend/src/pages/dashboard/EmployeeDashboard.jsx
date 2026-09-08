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

      // Debugging
      console.log("Stats API Response:", statsRes);
      console.log("Sales API Response:", salesRes);

      // =====================================================
      // EXTRACT API DATA
      // =====================================================

      const statsData = statsRes?.data?.data || statsRes?.data || {};
      const salesData = salesRes?.data?.data || salesRes?.data || [];

      console.log("Employee Stats Data:", statsData);
      console.log("Employee Sales Data:", salesData);

      // =====================================================
      // EMPLOYEE STATS
      // Backend employee response:
      //
      // {
      //   totalProducts,
      //   mySales,
      //   lowStock
      // }
      // =====================================================

      setStats({
        totalProducts: statsData?.totalProducts ?? 0,
        mySales: statsData?.mySales ?? 0,
        lowStock: statsData?.lowStock ?? 0,
      });

      // =====================================================
      // MONTHLY SALES CHART
      // =====================================================

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
            const monthIndex = item?._id?.month || 0;
            const year = item?._id?.year || "";

            return {
              month:
                monthIndex > 0 && monthIndex <= 12
                  ? `${months[monthIndex]} ${year}`
                  : "Unknown",

              totalSales: item?.totalSales ?? 0,
            };
          })
        : [];

      setChartData(formattedChart);
    } catch (error) {
      console.error("Dashboard Load Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load employee dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center font-medium text-slate-500 animate-pulse">
          Loading Dashboard Data...
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="p-4 sm:p-6 space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

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

      {/* =====================================================
          EMPLOYEE STATS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* PRODUCTS */}

        <StatCard
          title="Available Products"
          value={stats.totalProducts}
          icon="📦"
          color="bg-blue-600"
        />

        {/* MY SALES */}

        <StatCard
          title="My Sales"
          value={stats.mySales}
          icon="🛒"
          color="bg-purple-600"
        />

        {/* LOW STOCK */}

        <StatCard
          title="Low Stock Warning"
          value={stats.lowStock}
          icon="⚠️"
          color="bg-orange-500"
        />

      </div>

      {/* =====================================================
          MONTHLY SALES CHART
      ===================================================== */}

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">

        <h2 className="text-lg font-bold text-slate-800 mb-4">
          My Monthly Sales
        </h2>

        {chartData.length > 0 ? (
          <SalesChart data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-500">
            No sales data available
          </div>
        )}

      </div>

      {/* =====================================================
          RECENT SALES
      ===================================================== */}

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