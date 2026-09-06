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


      // ================================================
      // EMPLOYEE STATS
      // ================================================

      setStats({

        totalProducts:
          statsRes?.data?.totalProducts || 0,

        mySales:
          statsRes?.data?.mySales || 0,

        lowStock:
          statsRes?.data?.lowStock || 0,

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


      const formattedChart =
        (salesRes?.data || []).map((item) => ({

          month:
            `${months[item._id.month]} ${item._id.year}`,

          totalSales:
            item.totalSales,

        }));


      setChartData(formattedChart);

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load employee dashboard"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {

    fetchDashboard();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="text-center text-xl py-10">
        Loading Dashboard...
      </div>
    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="p-6">


      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Employee Dashboard
        </h1>

        <p className="text-gray-600 mt-2">

          Welcome,

          <span className="font-semibold text-blue-600">
            {" "}
            {user?.fullName}
          </span>

        </p>

      </div>


      {/* ============================================= */}
      {/* EMPLOYEE STATS */}
      {/* ============================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


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
          color="bg-green-600"
        />


        {/* LOW STOCK */}

        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon="⚠️"
          color="bg-orange-500"
        />

      </div>


      {/* ============================================= */}
      {/* MY SALES CHART */}
      {/* ============================================= */}

      <div className="mt-10">

        <h2 className="text-xl font-semibold mb-4">
          My Monthly Sales
        </h2>

        <SalesChart data={chartData} />

      </div>


      {/* ============================================= */}
      {/* RECENT ACTIVITY */}
      {/* ============================================= */}

      <div className="mt-10">

        <h2 className="text-xl font-semibold mb-4">
          My Recent Sales
        </h2>

        <RecentActivity />

      </div>


    </div>

  );
}


export default EmployeeDashboard;