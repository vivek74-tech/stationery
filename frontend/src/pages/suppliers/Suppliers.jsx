import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../services/supplier.service";

import SupplierTable from "../../components/supplier/SupplierTable";
import AddSupplierModal from "../../components/supplier/AddSupplierModal";
import EditSupplierModal from "../../components/supplier/EditSupplierModal";
import DeleteSupplierModal from "../../components/supplier/DeleteSupplierModal";

function Suppliers() {
   
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const res = await getSuppliers(page, limit, search);

      console.log("Suppliers Response:", res);
      console.log(res);
      console.log(res.data);
      console.log(res.data.suppliers);
      setSuppliers(res.data?.suppliers || []);
      setTotalPages(res.data?.totalPages || 1);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load suppliers");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, search]);

  // CREATE
  const handleCreate = async (data) => {
    try {
      await createSupplier(data);
      toast.success("Supplier Created");
      setShowAdd(false);
      fetchSuppliers();
    } catch (err) {
      toast.error("Create failed");
    }
  };

  // UPDATE
  const handleUpdate = async (data) => {
    try {
      await updateSupplier(selected._id, data);
      toast.success("Supplier Updated");
      setShowEdit(false);
      fetchSuppliers();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      await deleteSupplier(selected._id);
      toast.success("Supplier Deleted");
      setShowDelete(false);
      fetchSuppliers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between mb-6">

        <input
          className="border p-2 w-80"
          placeholder="Search supplier..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Supplier
        </button>

      </div>

      {/* Table */}
      <SupplierTable
        suppliers={suppliers}
        loading={loading}
        onEdit={(s) => {
          setSelected(s);
          setShowEdit(true);
        }}
        onDelete={(id) => {
          const s = suppliers.find((x) => x._id === id);
          setSelected(s);
          setShowDelete(true);
        }}
      />

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>

      </div>

      {/* Modals */}
      <AddSupplierModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleCreate}
      />

      <EditSupplierModal
        isOpen={showEdit}
        supplier={selected}
        onClose={() => setShowEdit(false)}
        onSave={handleUpdate}
      />

      <DeleteSupplierModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onDelete={handleDelete}
      />

    </div>
  );
}

export default Suppliers;