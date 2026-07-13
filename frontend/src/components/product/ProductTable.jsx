import QRCode from "react-qr-code";
import { forwardRef } from "react";
const ProductTable = forwardRef(({ products = [], loading, onEdit, onDelete }, ref) => {

  console.log("ProductTable Products:", products);
  if (loading) {
    return (

      
      <div  className="bg-white rounded-lg shadow p-10 text-center">
        Loading Products...
      </div>
    );
  }

  return (
    <div ref={ref} className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">

        {/* ================= TABLE HEADER ================= */}
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3">Image</th>
            <th className="border p-3">Product</th>
            <th className="border p-3">SKU</th>
            <th className="border p-3">QR Code</th>
            <th className="border p-3">Category</th>
            <th className="border p-3">Supplier</th>
            <th className="border p-3">Cost</th>
            <th className="border p-3">Selling</th>
            <th className="border p-3">Stock</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>

        {/* ================= TABLE BODY ================= */}
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="text-center py-10"
              >

                <div className="text-5xl mb-2">📦</div>

                <h2 className="text-xl font-bold text-gray-700">
                  No Products Found
                </h2>

                <p className="text-gray-500 mt-2">
                  Try changing your search or add a new product.
                </p>

              </td>
            </tr>
          ) : (
            products.map((product) => {
              const image =
                product.productImage ||
                product.image?.url ||
                product.image ||
                "";

              return (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 text-center"
                >
                  {/* IMAGE */}
                  <td className="border p-2">
                    {image ? (
                      <img
                        src={image}
                        alt={product.productName}
                        className="w-16 h-16 rounded object-cover mx-auto border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center mx-auto text-xs">
                        No Image
                      </div>
                    )}
                  </td>

                  {/* PRODUCT */}
                  <td className="border p-2 font-medium">
                    {product.productName}
                  </td>

                  {/* SKU */}
                  <td className="border p-2">
                    {product.sku}
                  </td>

                  {/* QR CODE */}
                  <td className="border p-2">
                    <div className="flex justify-center">
                      <QRCode
                        value={JSON.stringify({
                          id: product._id,
                          sku: product.sku,
                          name: product.productName,
                          stock: product.stock,
                        })}
                        size={60}
                      />
                    </div>
                  </td>



                  {/* CATEGORY */}
                  <td className="border p-2">
                    {product.category?.name || "-"}
                  </td>

                  {/* SUPPLIER */}
                  <td className="border p-2">
                    {product.supplier?.supplierName || "-"}
                  </td>

                  {/* COST */}
                  <td className="border p-2">
                    ₹{product.costPrice}
                  </td>

                  {/* SELLING */}
                  <td className="border p-2 text-green-600 font-semibold">
                    ₹{product.sellingPrice}
                  </td>

                  {/* STOCK */}
                  {/* <div className="mt-4">

                    {product.stock === 0 ? (

                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                        🔴 Out of Stock
                      </span>

                    ) : product.stock <= 5 ? (

                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                        🟡 Low Stock ({product.stock})
                      </span>

                    ) : (

                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        🟢 In Stock ({product.stock})
                      </span>

                    )}

                  </div> */}

                  {/* STOCK */}
                  <td className="border p-2">

                    {product.stock === 0 ? (

                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                        🔴 Out of Stock
                      </span>

                    ) : product.stock <= 5 ? (

                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                        🟡 Low Stock ({product.stock})
                      </span>

                    ) : (

                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        🟢 In Stock ({product.stock})
                      </span>

                    )}

                  </td>
                  {/* ACTIONS */}
                  <td className="border p-2">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => onEdit(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      {/* ✅ FIXED */}
                      <button
                        onClick={() => onDelete(product)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>

      </table>
    </div>
  );

});



export default ProductTable;