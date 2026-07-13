import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/axios";

function AddProductModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    productName: "",
    description: "",
    category: "",
    supplier: "",
    sku: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [preview, setPreview] = useState("");

  // ===============================
  // LOAD DATA WHEN MODAL OPENS
  // ===============================
  useEffect(() => {
    if (!isOpen) return;

    fetchCategories();
    fetchSuppliers();

    setForm({
      productName: "",
      description: "",
      category: "",
      supplier: "",
      sku: "",
      costPrice: "",
      sellingPrice: "",
      stock: "",
      image: null,
    });

    setPreview("");
  }, [isOpen]);

  // ===============================
  // FETCH CATEGORIES
  // ===============================
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");

      console.log("Categories API:", res.data);

      setCategories(res.data?.data?.categories || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    }
  };

  // ===============================
  // FETCH SUPPLIERS
  // ===============================
  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");

      console.log("Suppliers API:", res.data);

      setSuppliers(res.data?.data?.suppliers || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suppliers");
    }
  };

  // ===============================
  // INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // IMAGE CHANGE
  // ===============================
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm({
      ...form,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = () => {
    // Required fields
    if (!form.productName.trim()) {
      return toast.error("Product Name is required");
    }

    if (!form.category) {
      return toast.error("Please select a category");
    }

    if (!form.supplier) {
      return toast.error("Please select a supplier");
    }

    if (!form.sku.trim()) {
      return toast.error("SKU is required");
    }

    if (Number(form.costPrice) <= 0) {
      return toast.error("Cost Price must be greater than 0");
    }

    if (Number(form.sellingPrice) <= 0) {
      return toast.error("Selling Price must be greater than 0");
    }

    if (Number(form.sellingPrice) < Number(form.costPrice)) {
      return toast.error(
        "Selling Price cannot be less than Cost Price"
      );
    }

    if (Number(form.stock) < 0) {
      return toast.error("Stock cannot be negative");
    }

    const data = new FormData();

    data.append("productName", form.productName);
    data.append("description", form.description);
    data.append("category", form.category);
    data.append("supplier", form.supplier);
    data.append("sku", form.sku);
    data.append("costPrice", form.costPrice);
    data.append("sellingPrice", form.sellingPrice);
    data.append("stock", form.stock);

    if (form.image) {
      data.append("image", form.image);
    }

    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[550px] rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-5">
          Add Product
        </h2>

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={form.productName}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="supplier"
          value={form.supplier}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Select Supplier</option>

          {suppliers.map((supplier) => (
            <option
              key={supplier._id}
              value={supplier._id}
            >
              {supplier.supplierName}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="number"
          name="costPrice"
          placeholder="Cost Price"
          value={form.costPrice}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="number"
          name="sellingPrice"
          placeholder="Selling Price"
          value={form.sellingPrice}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mb-3"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border mb-3"
          />
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;