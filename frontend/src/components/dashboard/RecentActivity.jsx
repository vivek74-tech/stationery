import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createSale, getSales } from "../services/sale.service";
import { getProducts } from "../services/product.service";

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    productId: "",
    quantity: 1,
    customerName: "",
    paymentStatus: "PAID",
  });

  // Selected Product Details (for UI stock calculation)
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch Initial Data (Products & Sales)
  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesRes, productsRes] = await Promise.all([
        getSales(1, 20, ""),
        getProducts(1, 100, ""), // Fetch available products list
      ]);

      // Safe Data Extraction
      const salesList =
        salesRes?.data?.sales ||
        salesRes?.sales ||
        salesRes?.data ||
        [];

      const productsList =
        productsRes?.data?.products ||
        productsRes?.products ||
        productsRes?.data ||
        [];

      setSales(Array.isArray(salesList) ? salesList : []);
      setProducts(Array.isArray(productsList) ? productsList : []);
    } catch (error) {
      console.error("Sales Fetch Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load sales data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Product Selection Change
  const handleProductChange = (e) => {
    const pId = e.target.value;
    const prod = products.find((p) => p._id === pId);
    setSelectedProduct(prod || null);
    setForm((prev) => ({ ...prev, productId: pId }));
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId) {
      return toast.error("Please select a product");
    }

    const qty = Number(form.quantity);
    if (!qty || qty <= 0) {
      return toast.error("Please enter a valid quantity (> 0)");
    }

    if (selectedProduct && selectedProduct.stock < qty) {
      return toast.error(
        `Insufficient stock! Only ${selectedProduct.stock} available.`
      );
    }

    try {
      setSubmitting(true);

      // Create Sale API Call
      await createSale({
        productId: form.productId,
        product: form.productId, // Fallback alias
        quantity: qty,
        customerName: form.customerName?.trim() || "Walk-in Customer",
        paymentStatus: form.paymentStatus || "PAID",
      });

      toast.success("Sale created successfully!");

      // Reset Form
      setForm({
        productId: "",
        quantity: 1,
        customerName: "",
        paymentStatus: "PAID",
      });
      setSelectedProduct(null);

      // Refresh Sales & Updated Stock
      fetchData();
    } catch (error) {
      console.error("Create Sale Error Details:", error?.response?.data);
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        "Failed to create sale";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 font-medium animate-pulse">
          Loading Sales Module...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Sales Management
        </h1>
        <p className="text-slate-500 mt-1">
          Create new sales orders and view transaction history
        </p>
      </div>

      {/* CREATE SALE FORM */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Create New Sale
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SELECT PRODUCT */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Select Product *
            </label>
            <select
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.productId}
              onChange={handleProductChange}
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id} disabled={p.stock <= 0}>
                  {p.productName || p.name} ({p.stock > 0 ? `Stock: ${p.stock}` : "Out of Stock"})
                </option>
              ))}
            </select>
          </div>

          {/* QUANTITY */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Quantity *
            </label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.stock || 9999}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 2"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
              required
            />
          </div>

          {/* CUSTOMER NAME */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Customer Name
            </label>
            <input
              type="text"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Walk-in Customer"
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors disabled:bg-slate-400"
            >
              {submitting ? "Processing..." : "Create Sale"}
            </button>
          </div>
        </form>
      </div>

      {/* SALES HISTORY TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Sales Records
        </h2>

        {sales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Quantity</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {sales.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {item.product?.productName || item.product?.name || "N/A"}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.customerName || "Walk-in Customer"}
                    </td>
                    <td className="py-3 px-3">{item.quantity}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      ₹{item.totalAmount}
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-400">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">
            No sales recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default Sales;