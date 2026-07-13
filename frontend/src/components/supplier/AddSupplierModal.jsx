import { useState } from "react";

function AddSupplierModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    supplierName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(form);

    setForm({
      supplierName: "",
      companyName: "",
      email: "",
      phone: "",
      address: "",
      gstNumber: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-[500px]">

        <h2 className="text-xl font-bold mb-4">Add Supplier</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Supplier Name"
          value={form.supplierName}
          onChange={(e) =>
            setForm({ ...form, supplierName: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Company Name"
          value={form.companyName}
          onChange={(e) =>
            setForm({ ...form, companyName: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-4"
          placeholder="GST Number (Optional)"
          value={form.gstNumber}
          onChange={(e) =>
            setForm({ ...form, gstNumber: e.target.value })
          }
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddSupplierModal;