function DeleteProductModal({

isOpen,

onClose,

onDelete,

}){

if(!isOpen) return null;

return(

<div className="fixed inset-0 bg-black/50 flex justify-center items-center">

<div className="bg-white p-6 rounded-lg w-96">

<h2 className="text-2xl font-bold">

Delete Product

</h2>

<p className="my-5">

Are you sure you want to delete this product?

</p>

<div className="flex justify-end gap-3">

<button

onClick={onClose}

className="bg-gray-500 text-white px-5 py-2 rounded"

>

Cancel

</button>

<button

onClick={onDelete}

className="bg-red-600 text-white px-5 py-2 rounded"

>

Delete

</button>

</div>

</div>

</div>

)

}

export default DeleteProductModal;