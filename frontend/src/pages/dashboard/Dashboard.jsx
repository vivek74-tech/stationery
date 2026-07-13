import { useEffect, useState, useContext } from "react";
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
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const statsRes = await getDashboardStats();
      const salesRes = await getMonthlySales();

      console.log("salesRes =", salesRes);
      console.log("salesRes.data =", salesRes.data);
      console.log("Array?", Array.isArray(salesRes.data));

      // console.log("Dashboard:", statsRes);
      // console.log("Monthly Sales:", salesRes);

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

      // Monthly Sales
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

      console.log("formattedChart =", formattedChart);

      setChartData(formattedChart);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load dashboard"
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
      <div className="text-center text-xl py-10">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Welcome,
          <span className="font-semibold text-blue-600">
            {" "}
            {user?.fullName}
          </span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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
          color="bg-yellow-500"
        />

        <StatCard
          title="Sales"
          value={stats.totalSales}
          icon="🛒"
          color="bg-purple-600"
        />

        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
          icon="💰"
          color="bg-red-600"
        />

        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon="⚠️"
          color="bg-orange-500"
        />

      </div>

      {/* Sales Chart */}
      <div className="mt-10">
        <SalesChart data={chartData} />
      </div>

      {/* Recent Activity */}
      <div className="mt-10">
        <RecentActivity />
      </div>

    </div>
  );
}

export default Dashboard;