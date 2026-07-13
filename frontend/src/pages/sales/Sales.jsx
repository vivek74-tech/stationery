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

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api/v1";

  const fetchSales = async () => {
    try {
      setLoading(true);

      const res = await getSales(page, 10, search);

      setSales(res.data?.sales || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load sales"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");

      setProducts(
        res.data?.data?.products ||
          res.data?.products ||
          []
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load products"
      );
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
      await createSale({
        ...form,
        quantity: Number(form.quantity),
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
      toast.error(
        err.response?.data?.message ||
          "Failed to create sale"
      );
    }
  };

  const downloadInvoice = (id) => {
    window.open(
      `${API_URL}/sales/${id}/invoice`,
      "_blank"
    );
  };

  const deleteSale = async (id) => {
    if (!window.confirm("Delete this sale?")) return;

    try {
      await api.delete(`/sales/${id}`);

      toast.success("Sale Deleted Successfully");

      fetchSales();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete sale"
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">
        Sales / Billing
      </h1>

      {/* Search */}

      <input
        className="border p-2 w-80 mb-5 rounded"
        placeholder="Search Customer..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* Create Sale */}

      <div className="bg-white shadow rounded p-5 mb-6">
        <select
          className="border p-2 w-full mb-3 rounded"
          value={form.productId}
          onChange={(e) =>
            setForm({
              ...form,
              productId: e.target.value,
            })
          }
        >
          <option value="">Select Product</option>

          {products.map((p) => (
            <option
              key={p._id}
              value={p._id}
            >
              {p.productName}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border p-2 w-full mb-3 rounded"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm({
              ...form,
              quantity: e.target.value,
            })
          }
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={(e) =>
            setForm({
              ...form,
              customerName: e.target.value,
            })
          }
        />

        <select
          className="border p-2 w-full mb-4 rounded"
          value={form.paymentStatus}
          onChange={(e) =>
            setForm({
              ...form,
              paymentStatus: e.target.value,
            })
          }
        >
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
        >
          Create Sale
        </button>
      </div>

      {/* Sales Table */}

      <div className="bg-white shadow rounded p-5">
        <h2 className="text-xl font-semibold mb-4">
          Sales History
        </h2>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-5"
                >
                  Loading...
                </td>
              </tr>
            ) : sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale._id}>
                  <td className="border p-2">
                    {sale.product?.productName}
                  </td>

                  <td className="border p-2">
                    {sale.customerName}
                  </td>

                  <td className="border p-2">
                    {sale.quantity}
                  </td>

                  <td className="border p-2">
                    ₹{sale.sellingPrice}
                  </td>

                  <td className="border p-2 font-semibold">
                    ₹{sale.totalAmount}
                  </td>

                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        sale.paymentStatus === "PAID"
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </td>

                  <td className="border p-2">
                    {new Date(
                      sale.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="border p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          downloadInvoice(sale._id)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Invoice
                      </button>

                      <button
                        onClick={() =>
                          deleteSale(sale._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-5"
                >
                  No Sales Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}

        <div className="flex justify-center gap-4 mt-5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="flex items-center font-semibold">
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sales;