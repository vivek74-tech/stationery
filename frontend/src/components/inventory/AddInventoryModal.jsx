import { useState } from "react";
import toast from "react-hot-toast";

import {
  stockIn,
  stockOut,
} from "../../services/inventory.service";


function AddInventoryModal({
  isOpen,
  onClose,
  products = [],
  onSuccess,
}) {

  const [form, setForm] = useState({
    productId: "",
    type: "IN",
    quantity: "",
    note: "",
  });


  const [loading, setLoading] = useState(false);



  if (!isOpen) return null;



  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();


    if (
      !form.productId ||
      !form.quantity
    ) {

      return toast.error(
        "Please fill all required fields"
      );

    }


    const qty = Number(form.quantity);


    if (qty <= 0) {

      return toast.error(
        "Quantity must be greater than 0"
      );

    }



    try {

      setLoading(true);



      const payload = {

        productId: form.productId,

        quantity: qty,

        note: form.note,

      };



      if (form.type === "IN") {

        await stockIn(payload);

      } else {

        await stockOut(payload);

      }



      toast.success(
        "Inventory updated successfully"
      );


      setForm({

        productId: "",
        type: "IN",
        quantity: "",
        note: "",

      });


      onSuccess();


      onClose();



    } catch (error) {


      toast.error(

        error.response?.data?.message ||
        "Inventory update failed"

      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


      <div className="bg-white w-full max-w-md rounded-lg p-6">


        <h2 className="text-xl font-bold mb-4">
          Add Inventory
        </h2>



        <form onSubmit={handleSubmit}>


          {/* PRODUCT */}

          <select

            name="productId"

            value={form.productId}

            onChange={handleChange}

            className="border p-2 w-full mb-3 rounded"

          >

            <option value="">
              Select Product
            </option>


            {products.map((product)=>(

              <option
                key={product._id}
                value={product._id}
              >

                {product.productName}

              </option>

            ))}


          </select>




          {/* TYPE */}

          <select

            name="type"

            value={form.type}

            onChange={handleChange}

            className="border p-2 w-full mb-3 rounded"

          >

            <option value="IN">
              Stock IN
            </option>

            <option value="OUT">
              Stock OUT
            </option>


          </select>




          {/* QUANTITY */}

          <input

            type="number"

            name="quantity"

            placeholder="Quantity"

            value={form.quantity}

            onChange={handleChange}

            className="border p-2 w-full mb-3 rounded"

          />




          {/* NOTE */}

          <textarea

            name="note"

            placeholder="Note"

            value={form.note}

            onChange={handleChange}

            className="border p-2 w-full mb-4 rounded"

          />





          <div className="flex justify-end gap-3">


            <button

              type="button"

              onClick={onClose}

              className="px-4 py-2 border rounded"

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

              {loading
                ? "Saving..."
                : "Save"
              }


            </button>


          </div>


        </form>


      </div>


    </div>

  );

}


export default AddInventoryModal;