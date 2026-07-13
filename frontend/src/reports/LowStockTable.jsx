function LowStockTable({
  products = [],
  loading,
}) {
  if (loading) {
    return (
      <div className="text-center py-8 text-lg">
        Loading Low Stock Products...
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
            <th className="border p-3">SKU</th>
            <th className="border p-3">Category</th>
            <th className="border p-3">Current Stock</th>
            <th className="border p-3">Selling Price</th>
            <th className="border p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product._id}>
                <td className="border p-3">
                  {index + 1}
                </td>

                <td className="border p-3">
                  {product.productName}
                </td>

                <td className="border p-3">
                  {product.sku}
                </td>

                <td className="border p-3">
                  {product.category?.categoryName || "-"}
                </td>

                <td className="border p-3 font-semibold text-red-600">
                  {product.stock}
                </td>

                <td className="border p-3">
                  ₹{product.sellingPrice}
                </td>

                <td className="border p-3">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    Low Stock
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center p-5"
              >
                No Low Stock Products Found
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}

export default LowStockTable;