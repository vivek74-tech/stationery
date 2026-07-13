import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getInventory } from "../../services/inventory.service";
import api from "../../utils/axios";

import InventoryTable from "../../components/inventory/InventoryTable";
import AddInventoryModal from "../../components/inventory/AddInventoryModal";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // ==========================
  // GET INVENTORY
  // ==========================

  const fetchInventory = async () => {
  try {
    setLoading(true);

    const res = await getInventory();

    console.log("Inventory Response:", res);
    console.log("Inventory Array:", res.data.inventory);

    setInventory(res.data.inventory || []);

  } catch (error) {
    console.error(error);
    toast.error("Failed to load inventory");
    setInventory([]);
  } finally {
    setLoading(false);
  }
};

  // ==========================
  // GET PRODUCTS
  // ==========================

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products?limit=1000");

      console.log("Products Response:", res.data);
      console.log("Products:", res.data?.data?.products);

      setProducts(res.data?.data?.products || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">
          Inventory Management
        </h1>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Stock
        </button>
      </div>

      <InventoryTable
        inventory={inventory}
        loading={loading}
      />

      <AddInventoryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        products={products}
        onSuccess={fetchInventory}
      />
    </div>
  );
}

export default Inventory;