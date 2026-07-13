function SupplierTable({
  suppliers = [],
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading Suppliers...
      </div>
    );
  }

  return (
    <table className="w-full border border-collapse bg-white">
      <thead className="bg-gray-200">
        <tr>
          <th className="border p-3">#</th>
          <th className="border p-3">Supplier Name</th>
          <th className="border p-3">Company</th>
          <th className="border p-3">Email</th>
          <th className="border p-3">Phone</th>
          <th className="border p-3">GST Number</th>
          <th className="border p-3">Address</th>
          <th className="border p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {suppliers.length > 0 ? (
          suppliers.map((supplier, index) => (
            <tr key={supplier._id}>
              <td className="border p-3">{index + 1}</td>

              <td className="border p-3">
                {supplier.supplierName}
              </td>

              <td className="border p-3">
                {supplier.companyName}
              </td>

              <td className="border p-3">
                {supplier.email}
              </td>

              <td className="border p-3">
                {supplier.phone}
              </td>

              <td className="border p-3">
                {supplier.gstNumber}
              </td>

              <td className="border p-3">
                {supplier.address}
              </td>

              <td className="border p-3 space-x-2">
                <button
                  onClick={() => onEdit(supplier)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(supplier._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="8"
              className="text-center p-5"
            >
              No Suppliers Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default SupplierTable;