function SalesReportTable({ sales = [], loading }) {
  if (loading) {
    return (
      <div className="text-center py-8 text-lg">
        Loading Sales Report...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-collapse bg-white">

        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3">#</th>
            <th className="border p-3">Product</th>
            <th className="border p-3">Quantity</th>
            <th className="border p-3">Price</th>
            <th className="border p-3">Total</th>
            <th className="border p-3">Customer</th>
            <th className="border p-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {sales.length > 0 ? (
            sales.map((sale, index) => (
              <tr key={sale._id}>
                <td className="border p-3">{index + 1}</td>

                <td className="border p-3">
                  {sale.product?.productName || "-"}
                </td>

                <td className="border p-3">
                  {sale.quantity}
                </td>

                <td className="border p-3">
                  ₹{sale.price}
                </td>

                <td className="border p-3 font-semibold">
                  ₹{sale.totalAmount}
                </td>

                <td className="border p-3">
                  {sale.customerName || "-"}
                </td>

                <td className="border p-3">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center p-5"
              >
                No Sales Report Available
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}

export default SalesReportTable;