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

      // Flexible unwrapping for API array response
      const salesList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      setSales(salesList);
    } catch (error) {
      console.error("Fetch Recent Sales Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load recent sales"
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
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800">
          Recent Activity
        </h2>
        <p className="text-slate-400 text-center py-8 text-sm font-medium animate-pulse">
          Loading recent sales...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-2 sm:p-4">
      <h2 className="text-xl font-bold mb-4 text-slate-800">
        Recent Activity
      </h2>

      {sales.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm font-medium">
          No recent sales available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sales.map((sale) => {
                // Support single product & multi-item schemas
                const productName =
                  sale.product?.productName ||
                  sale.items?.[0]?.product?.productName ||
                  "Product Item";

                const quantity =
                  sale.quantity ||
                  sale.items?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) ||
                  1;

                return (
                  <tr
                    key={sale._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {productName}
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {sale.customerName || "Walk-in Customer"}
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {quantity}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">
                      ₹{sale.totalAmount ?? 0}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          sale.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {sale.paymentStatus || "PAID"}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-400 text-xs">
                      {sale.createdAt
                        ? new Date(sale.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentActivity;