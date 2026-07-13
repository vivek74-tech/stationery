import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/axios";

function EditProductModal({ isOpen, onClose, onSave, product }) {

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
  // LOAD PRODUCT
  // ===============================
  useEffect(() => {
    if (!product) return;

    setForm({
      productName: product.productName || "",
      description: product.description || "",
      category: product.category?._id || "",
      supplier: product.supplier?._id || "",
      sku: product.sku || "",
      costPrice: product.costPrice || "",
      sellingPrice: product.sellingPrice || "",
      stock: product.stock || "",
      image: null,
    });

    setPreview(product.image?.url || product.image || "");
  }, [product]);

  // ===============================
  // FETCH DROPDOWNS (FIXED HERE)
  // ===============================
  useEffect(() => {
    if (!isOpen) return;

    fetchCategories();
    fetchSuppliers();
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      console.log(res.data);
      setCategories(
        res.data?.data?.categories || []   // ✅ FIXED
      );

    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      console.log("SUPPLIERS API RESPONSE:", res.data);
      setSuppliers(
        res.data?.data?.suppliers || []    // ✅ FIXED
      );

    } catch {
      toast.error("Failed to load suppliers");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, image: file });

    setPreview(URL.createObjectURL(file));
  };

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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-[550px] rounded-lg p-6">

        <h2 className="text-2xl font-bold mb-5">Edit Product</h2>

        <input
          name="productName"
          value={form.productName}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Product Name"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Description"
        />

        {/* CATEGORY */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SUPPLIER */}
        <select
          name="supplier"
          value={form.supplier}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.supplierName}
            </option>
          ))}
        </select>

        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="SKU"
        />

        <input
          type="number"
          name="costPrice"
          value={form.costPrice}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Cost Price"
        />

        <input
          type="number"
          name="sellingPrice"
          value={form.sellingPrice}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Selling Price"
        />

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          placeholder="Stock"
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
            className="w-32 h-32 object-cover border mb-3"
            alt="preview"
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditProductModal;