import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getSalesReport,
  getInventoryReport,
} from "../../services/report.service";

function Reports() {
  const [salesReport, setSalesReport] = useState([]);
  const [inventoryReport, setInventoryReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const salesRes = await getSalesReport();
      const inventoryRes = await getInventoryReport();

      console.log("Sales Response:", salesRes);
      console.log("Inventory Response:", inventoryRes);

      // ✅ Correct
      setSalesReport(salesRes.data?.sales || []);

      // ✅ Inventory API should return data.products
      setInventoryReport(
        inventoryRes.data?.products ||
        inventoryRes.data?.inventory ||
        []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-xl">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Reports
      </h1>

      {/* Sales Report */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Sales Report
        </h2>

        <table className="w-full border border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-3">#</th>
              <th className="border p-3">Product</th>
              <th className="border p-3">Quantity</th>
              <th className="border p-3">Amount</th>
            </tr>
          </thead>

          <tbody>
            {salesReport.length > 0 ? (
              salesReport.map((sale, index) => (
                <tr key={sale._id}>
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3">
                    {sale.product?.productName}
                  </td>
                  <td className="border p-3">
                    {sale.quantity}
                  </td>
                  <td className="border p-3">
                    ₹{sale.totalAmount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-5">
                  No Sales Data
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* Inventory Report */}
      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-2xl font-semibold mb-4">
          Inventory Report
        </h2>

        <table className="w-full border border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-3">#</th>
              <th className="border p-3">Product</th>
              <th className="border p-3">Stock</th>
            </tr>
          </thead>

          <tbody>
            {inventoryReport.length > 0 ? (
              inventoryReport.map((item, index) => (
                <tr key={item._id}>
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3">
                    {item.productName}
                  </td>
                  <td className="border p-3">
                    {item.stock}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-5">
                  No Inventory Data
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Reports;