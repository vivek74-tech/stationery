import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getRecentSales } from "../../services/dashboard.service";

function RecentActivity() {

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentSales = async () => {
    try {
      setLoading(true);

      const response = await getRecentSales();

      setSales(response?.data || []);

    } catch (error) {
     

      toast.error(
        error.response?.data?.message ||
        "Failed to load recent sales"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentSales();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">
          Recent Activity
        </h2>

        <p className="text-gray-500 text-center py-8">
          Loading recent sales...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">

      <h2 className="text-2xl font-bold mb-6">
        Recent Activity
      </h2>

      {sales.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No recent sales available
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b text-left">
                <th className="py-3 px-2">
                  Product
                </th>

                <th className="py-3 px-2">
                  Customer
                </th>

                <th className="py-3 px-2">
                  Quantity
                </th>

                <th className="py-3 px-2">
                  Amount
                </th>

                <th className="py-3 px-2">
                  Payment
                </th>

                <th className="py-3 px-2">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {sales.map((sale) => (

                <tr
                  key={sale._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3 px-2 font-medium">
                    {sale.product?.productName || "Product deleted"}
                  </td>

                  <td className="py-3 px-2">
                    {sale.customerName || "Walk-in Customer"}
                  </td>

                  <td className="py-3 px-2">
                    {sale.quantity}
                  </td>

                  <td className="py-3 px-2 font-semibold">
                    ₹{sale.totalAmount}
                  </td>

                  <td className="py-3 px-2">

                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        sale.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {sale.paymentStatus}
                    </span>

                  </td>

                  <td className="py-3 px-2 text-gray-500">
                    {new Date(
                      sale.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default RecentActivity;