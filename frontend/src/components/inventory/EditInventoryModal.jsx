import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  updateInventory,
} from "../../services/inventory.service";


function EditInventoryModal({
  isOpen,
  onClose,
  inventoryItem,
  onSuccess,
}) {

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {

    if (inventoryItem) {

      setNote(
        inventoryItem.note || ""
      );

    }

  }, [inventoryItem]);



  if (!isOpen || !inventoryItem) {
    return null;
  }



  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      setLoading(true);


      await updateInventory(
        inventoryItem._id,
        {
          note,
        }
      );


      toast.success(
        "Inventory updated successfully"
      );


      onSuccess();

      onClose();



    } catch (error) {


      toast.error(

        error.response?.data?.message ||
        "Failed to update inventory"

      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


      <div className="bg-white w-full max-w-md rounded-lg p-6">


        <h2 className="text-xl font-bold mb-4">
          Edit Inventory
        </h2>



        <div className="mb-4 text-sm">


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




        <form onSubmit={handleSubmit}>


          <textarea

            className="border p-2 w-full rounded mb-4"

            placeholder="Update note"

            value={note}

            onChange={(e)=>
              setNote(e.target.value)
            }

          />



          <div className="flex justify-end gap-3">


            <button

              type="button"

              onClick={onClose}

              className="border px-4 py-2 rounded"

            >

              Cancel

            </button>




            <button

              type="submit"

              disabled={loading}

              className={`px-4 py-2 rounded text-white ${
                loading
                ? "bg-gray-400"
                : "bg-blue-600"
              }`}

            >

              {
                loading
                ? "Updating..."
                : "Update"
              }


            </button>


          </div>


        </form>


      </div>


    </div>

  );

}


export default EditInventoryModal;