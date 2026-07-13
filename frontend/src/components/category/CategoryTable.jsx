function CategoryTable({
  categories = [],
  loading = false,
  onEdit,
  onDelete,
}) {
  return (
    <table className="w-full border border-collapse bg-white">

      <thead className="bg-gray-200">
        <tr>
          <th className="border p-3">Sr.</th>
          <th className="border p-3">Name</th>
          <th className="border p-3">Description</th>
          <th className="border p-3">Created By</th>
          <th className="border p-3">Created Date</th>
          <th className="border p-3">Actions</th>
        </tr>
      </thead>

      <tbody>

        {loading ? (

          <tr>
            <td
              colSpan="6"
              className="text-center p-6 text-blue-600 font-semibold"
            >
              Loading Categories...
            </td>
          </tr>

        ) : categories.length > 0 ? (

          categories.map((category, index) => (
            <tr key={category._id}>

              <td className="border p-3">
                {index + 1}
              </td>

              <td className="border p-3">
                {category.name}
              </td>

              <td className="border p-3">
                {category.description}
              </td>

              <td className="border p-3">
                {console.log(category.createdBy)}
                {category.createdBy?.fullName || "N/A"}
              </td>

              <td className="border p-3">
                {new Date(
                  category.createdAt
                ).toLocaleDateString()}
              </td>

              <td className="border p-3 space-x-2">

                <button
                  onClick={() => onEdit(category)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(category._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))

        ) : (

          <tr>
            <td
              colSpan="6"
              className="text-center p-6 text-gray-500"
            >
              No Categories Found
            </td>
          </tr>

        )}

      </tbody>

    </table>
  );
}

export default CategoryTable;