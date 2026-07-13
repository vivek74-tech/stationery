function DeleteSupplierModal({
  isOpen,
  onClose,
  onDelete,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">

        <h2 className="text-2xl font-bold mb-4">
          Delete Supplier
        </h2>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this supplier?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeleteSupplierModal;