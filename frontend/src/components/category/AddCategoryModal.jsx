import { useState } from "react";

function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    onSave({
      name,
      description,
    });

    setName("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-4">
          Add Category
        </h2>

        <input
          type="text"
          placeholder="Category Name"
          className="w-full border p-3 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          rows="4"
          className="w-full border p-3 rounded mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={() => {
              setName("");
              setDescription("");
              onClose();
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
}

export default AddCategoryModal;