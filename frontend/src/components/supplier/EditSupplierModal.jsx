import { useEffect, useState } from "react";

function EditSupplierModal({ isOpen, supplier, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name || "",
        companyName: supplier.companyName || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
      });
    }
  }, [supplier]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white p-6 rounded w-[500px]">

        <h2 className="text-xl font-bold mb-4">Edit Supplier</h2>

        <input
          className="border p-2 w-full mb-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <textarea
          className="border p-2 w-full mb-4"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditSupplierModal;