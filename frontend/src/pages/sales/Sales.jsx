import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../utils/axios";
import { getSales, createSale } from "../../services/sale.service";

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    customerName: "",
    paymentStatus: "PAID",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await getSales(page, 10, search);

      const salesList =
        res?.data?.sales ||
        res?.sales ||
        res?.data ||
        [];

      setSales(Array.isArray(salesList) ? salesList : []);
      setTotalPages(res?.data?.totalPages || res?.totalPages || 1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const productList =
        res?.data?.data?.products ||
        res?.data?.products ||
        res?.data ||
        [];

      setProducts(Array.isArray(productList) ? productList : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchSales();
  }, [page, search]);

  const handleSubmit = async () => {
    if (!form.productId) {
      return toast.error("Please select a product");
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      return toast.error("Enter valid quantity");
    }

    try {
      // Sending both product and productId to cover backend schema aliases
      await createSale({
        product: form.productId,
        productId: form.productId,
        quantity: Number(form.quantity),
        customerName: form.customerName,
        paymentStatus: form.paymentStatus,
      });

      toast.success("Sale Created Successfully");

      setForm({
        productId: "",
        quantity: "",
        customerName: "",
        paymentStatus: "PAID",
      });

      fetchSales();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create sale");
    }
  };

  const downloadInvoice = (id) => {
    window.open(`${API_URL}/sales/${id}/invoice`, "_blank");
  };

  const deleteSale = async (id) => {
    if (!window.confirm("Delete this sale?")) return;

    try {
      await api.delete(`/sales/${id}`);
      toast.success("Sale Deleted Successfully");
      fetchSales();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete sale");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5 text-slate-800">Sales / Billing</h1>

      {/* Search */}
      <input
        className="border border-slate-300 p-2 w-80 mb-5 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search Customer..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* Create Sale */}
      <div className="bg-white shadow rounded-lg p-5 mb-6 border border-slate-100">
        <select
          className="border border-slate-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.productId}
          onChange={(e) => setForm({ ...form, productId: e.target.value })}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.productName || p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border border-slate-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <input
          className="border border-slate-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        />

        <select
          className="border border-slate-300 p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.paymentStatus}
          onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
        >
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2 rounded transition-colors"
        >
          Create Sale
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow rounded-lg p-5 border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Sales History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                <th className="p-3">Product</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Price</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-5 text-slate-400">
                    Loading sales...
                  </td>
                </tr>
              ) : sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium text-slate-800">
                      {sale.product?.productName || sale.product?.name || "Product Item"}
                    </td>

                    <td className="p-3 text-slate-600">
                      {sale.customerName || "Walk-in Customer"}
                    </td>

                    <td className="p-3 text-slate-600">{sale.quantity || 1}</td>

                    <td className="p-3 text-slate-600">
                      ₹{sale.sellingPrice ?? sale.price ?? 0}
                    </td>

                    <td className="p-3 font-semibold text-slate-800">
                      ₹{sale.totalAmount ?? 0}
                    </td>

                    <td className="p-3">
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

                    <td className="p-3 text-slate-400 text-xs">
                      {sale.createdAt
                        ? new Date(sale.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => downloadInvoice(sale._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Invoice
                        </button>

                        <button
                          onClick={() => deleteSale(sale._id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-5 text-slate-400">
                    No Sales Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded text-sm disabled:opacity-50 hover:bg-slate-300 transition-colors"
          >
            Prev
          </button>

          <span className="text-sm font-medium text-slate-600">
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded text-sm disabled:opacity-50 hover:bg-slate-300 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sales;