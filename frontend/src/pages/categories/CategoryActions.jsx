function CategoryActions({
  category,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex justify-center gap-2">
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
    </div>
  );
}

export default CategoryActions;