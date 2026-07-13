function ProductCard({
  products = [],
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="text-center py-10">
        Loading Products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">

        <div className="text-6xl mb-4">📦</div>

        <h2 className="text-2xl font-bold text-gray-700">
          No Products Found
        </h2>

        <p className="text-gray-500 mt-2">
          Click <span className="font-semibold">"+ Add Product"</span> to create your first product.
        </p>

      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

      {products.map((product) => {

        const image =
          product.productImage ||
          product.image?.url ||
          product.image ||
          "";

        return (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
          >

            {/* Product Image */}
            <div className="h-52 bg-gray-100">

              {image ? (
                <img
                  src={image}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center text-gray-400">
                  No Image
                </div>
              )}

            </div>

            {/* Body */}

            <div className="p-4">

              <h2 className="text-lg font-bold">
                {product.productName}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                SKU : {product.sku}
              </p>

              <p className="text-sm mt-2">
                Category :
                <span className="font-semibold">
                  {" "}
                  {product.category?.name || "-"}
                </span>
              </p>

              <p className="text-sm">
                Supplier :
                <span className="font-semibold">
                  {" "}
                  {product.supplier?.supplierName || "-"}
                </span>
              </p>

              <div className="flex justify-between mt-4">

                <div>
                  <p className="text-gray-500 text-sm">
                    Cost
                  </p>

                  <p className="font-bold">
                    ₹{product.costPrice}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Selling
                  </p>

                  <p className="font-bold text-green-600">
                    ₹{product.sellingPrice}
                  </p>
                </div>

              </div>

              <div className="mt-4">

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

              </div>

              <div className="flex gap-3 mt-5">

                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(product)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}

export default ProductCard;