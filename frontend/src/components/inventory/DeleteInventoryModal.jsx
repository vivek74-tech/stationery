import { useState } from "react";
import toast from "react-hot-toast";

import {
  deleteInventory,
} from "../../services/inventory.service";


function DeleteInventoryModal({
  isOpen,
  onClose,
  inventoryItem,
  onSuccess,
}) {

  const [loading, setLoading] = useState(false);



  if (!isOpen || !inventoryItem) {
    return null;
  }



  const handleDelete = async () => {

    try {

      setLoading(true);


      await deleteInventory(
        inventoryItem._id
      );


      toast.success(
        "Inventory deleted successfully"
      );


      onSuccess();

      onClose();



    } catch (error) {


      toast.error(

        error.response?.data?.message ||
        "Failed to delete inventory"

      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


      <div className="bg-white rounded-lg p-6 w-full max-w-sm">


        <h2 className="text-xl font-bold mb-4 text-red-600">

          Delete Inventory

        </h2>



        <p className="mb-5">

          Are you sure you want to delete this inventory record?

        </p>



        <div className="bg-gray-100 p-3 rounded mb-5 text-sm">


          <p>

            Product:
            <b>
              {" "}
              {inventoryItem.product?.productName}
            </b>

          </p>


          <p>

            Type:
            <b>
              {" "}
              {inventoryItem.type}
            </b>

          </p>


          <p>

            Quantity:
            <b>
              {" "}
              {inventoryItem.quantity}
            </b>

          </p>


        </div>




        <div className="flex justify-end gap-3">


          <button

            onClick={onClose}

            className="border px-4 py-2 rounded"

          >

            Cancel

          </button>




          <button

            onClick={handleDelete}

            disabled={loading}

            className={`px-4 py-2 rounded text-white ${
              loading
              ? "bg-gray-400"
              : "bg-red-600"
            }`}

          >

            {
              loading
              ? "Deleting..."
              : "Delete"
            }


          </button>


        </div>


      </div>


    </div>

  );

}


export default DeleteInventoryModal;