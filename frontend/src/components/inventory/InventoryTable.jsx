import React from "react";

function InventoryTable({
  inventory = [],
  loading = false,
}) {

  // DEBUG
  console.log("Inventory Data:", inventory);

  return (
    <div className="bg-white p-4 rounded shadow">

      <h2 className="text-xl font-semibold mb-4">
        Inventory History
      </h2>

      {loading ? (

        <div className="text-center py-5">
          Loading inventory...
        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full border-collapse border">

            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">SKU</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Previous Stock</th>
                <th className="border p-2">Current Stock</th>
                <th className="border p-2">Note</th>
                <th className="border p-2">Created By</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>

            <tbody>

              {inventory.length > 0 ? (

                inventory.map((item) => {

                  // DEBUG
                  console.log("Inventory Item:", item);
                  console.log("Created By:", item.createdBy);

                  return (

                    <tr key={item._id}>

                      <td className="border p-2">
                        {item.product?.productName || "-"}
                      </td>

                      <td className="border p-2">
                        {item.product?.sku || "-"}
                      </td>

                      <td className="border p-2">
                        {item.type === "IN" ? (
                          <span className="text-green-600 font-semibold">
                            ⬆ IN
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            ⬇ OUT
                          </span>
                        )}
                      </td>

                      <td className="border p-2">
                        {item.quantity}
                      </td>

                      <td className="border p-2">
                        {item.previousStock}
                      </td>

                      <td className="border p-2">
                        {item.currentStock}
                      </td>

                      <td className="border p-2">
                        {item.note || "-"}
                      </td>

                      <td className="border p-2">
                        {item.createdBy?.fullName || "No User"}
                      </td>

                      <td className="border p-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>

                    </tr>

                  );
                })

              ) : (

                <tr>
                  <td colSpan="9" className="text-center p-5">
                    No Inventory Records Found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default InventoryTable;