function InventoryReportTable({
  inventory = [],
  loading,
}) {
  if (loading) {
    return (
      <div className="text-center py-8 text-lg">
        Loading Inventory Report...
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
            <th className="border p-3">Type</th>
            <th className="border p-3">Quantity</th>
            <th className="border p-3">Remark</th>
            <th className="border p-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {inventory.length > 0 ? (
            inventory.map((item, index) => (
              <tr key={item._id}>
                <td className="border p-3">
                  {index + 1}
                </td>

                <td className="border p-3">
                  {item.product?.productName || "-"}
                </td>

                <td className="border p-3">
                  {item.type === "IN"
                    ? "⬆ Stock In"
                    : "⬇ Stock Out"}
                </td>

                <td className="border p-3">
                  {item.quantity}
                </td>

                <td className="border p-3">
                  {item.remark || "-"}
                </td>

                <td className="border p-3">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center p-5"
              >
                No Inventory Report Available
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}

export default InventoryReportTable;