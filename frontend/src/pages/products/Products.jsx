import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";

import toast from "react-hot-toast";
import ProductCard from "../../components/product/ProductCard";
import Pagination from "../../components/common/Pagination";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/product.service";
import { getSuppliers } from "../../services/supplier.service";

import api from "../../utils/axios";
import ProductTable from "../../components/product/ProductTable";
import AddProductModal from "../../components/product/AddProductModal";
import EditProductModal from "../../components/product/EditProductModal";
import DeleteProductModal from "../../components/product/DeleteProductModal";
import { getCategories } from "../../services/category.service";
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sort, setSort] = useState("-createdAt");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const [view, setView] = useState("table");
  // const [products, setProducts] = useState([]);
  // =============================
  // FETCH PRODUCTS
  // =============================
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Product QR Codes",
  });
  const fetchSuppliers = async () => {
    try {
      const response = await getSuppliers(1, 1000);

      console.log(response);

      setSuppliers(response.data.suppliers || []);
      console.log("Suppliers:", response);
      console.log("response.data:", response.data);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load suppliers");
    }
  };



  const fetchProducts = async () => {
    try {
      console.log("fetchProducts called");
      setLoading(true);

      const res = await getProducts({
        page,
        limit,
        search,
        category: selectedCategory,
        supplier: selectedSupplier,
        sort,
      });

      console.log(res.data);

      setProducts(res.data.data.products);

      setTotalPages(res.data.data.pagination.totalPages);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch products"
      );

    } finally {
      setLoading(false);
    }
  };



  const fetchCategories = async () => {
    try {
      const response = await getCategories(1, 1000);

      console.log("Category Response:", response);

      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    }
  };

  // Categories load for dropdown
  // useEffect(() => {
  //   fetchCategories();
  // }, []);
  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory, selectedSupplier, sort]);

  // =============================
  // CREATE
  // =============================
  const handleCreateProduct = async (formData) => {
    try {
      await createProduct(formData);

      toast.success("Product Created Successfully");

      setShowAddModal(false);

      fetchProducts();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to create product"
      );
    }
  };

  // =============================
  // UPDATE
  // =============================
  const handleUpdateProduct = async (formData) => {
    try {
      await updateProduct(selectedProduct._id, formData);

      toast.success("Product Updated Successfully");

      setShowEditModal(false);

      setSelectedProduct(null);

      fetchProducts();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update product"
      );
    }
  };

  // =============================
  // DELETE
  // =============================
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(selectedProduct._id);

      toast.success("Product Deleted Successfully");

      setShowDeleteModal(false);

      setSelectedProduct(null);

      fetchProducts();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to delete product"
      );
    }
  };

  console.log("Products State:", products);
  console.log("View:", view);
  console.log("Loading:", loading);
  console.log("Products Length:", products.length);
  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg p-2 w-72"
        />


        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg p-2"
        >

          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}

        </select>



        {/* Supplier Filter */}
        <select
          value={selectedSupplier}
          onChange={(e) => {
            setSelectedSupplier(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg p-2"
        >

          <option value="">
            All Suppliers
          </option>

          {suppliers.map((supplier) => (
            <option
              key={supplier._id}
              value={supplier._id}
            >
              {supplier.supplierName}
            </option>
          ))}

        </select>




        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg p-2"
        >

          <option value="-createdAt">
            Newest
          </option>

          <option value="createdAt">
            Oldest
          </option>

          <option value="productName">
            A - Z
          </option>

          <option value="-productName">
            Z - A
          </option>

          <option value="sellingPrice">
            Price Low → High
          </option>

          <option value="-sellingPrice">
            Price High → Low
          </option>

          <option value="stock">
            Stock Low → High
          </option>

          <option value="-stock">
            Stock High → Low
          </option>

        </select>




        {/* View Toggle */}

        <div className="flex gap-2">

          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-lg ${view === "table"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
              }`}
          >
            Table
          </button>


          <button
            onClick={() => setView("card")}
            className={`px-4 py-2 rounded-lg ${view === "card"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
              }`}
          >
            Card
          </button>

        </div>


        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          🖨 Print QR
        </button>

        {/* Add Product */}

        <button
          onClick={() => {
            setShowAddModal(true)
            console.log("Add Button Clicked");
          }

          }

          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </button>


      </div>





      {/* ================= PRODUCT VIEW ================= */}


      {view === "table" && (
        <ProductTable
          products={products}
          loading={loading}
          onEdit={(product) => {
            setSelectedProduct(product);
            setShowEditModal(true);
          }}
          onDelete={(product) => {
            setSelectedProduct(product);
            setShowDeleteModal(true);
          }}
        />
      )}

      <div className="hidden print:block" ref={printRef}>
        <div>
          <h2 style={{ textAlign: "center" }}>
            Product QR Codes
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "30px",
              padding: "20px",
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  textAlign: "center",
                  border: "1px solid #ddd",
                  padding: "15px",
                }}
              >
                <QRCode
                  value={JSON.stringify({
                    id: product._id,
                    sku: product.sku,
                    name: product.productName,
                  })}
                  size={150}
                />

                <h4>{product.productName}</h4>

                <p>SKU: {product.sku}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />




      {view === "card" && (

        <ProductCard
          products={products}
          loading={loading}

          onEdit={(product) => {

            setSelectedProduct(product);
            setShowEditModal(true);

          }}

          onDelete={(product) => {

            setSelectedProduct(product);
            setShowDeleteModal(true);

          }}

        />

      )}




      {/* ================= MODALS ================= */}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleCreateProduct}
      />




      <EditProductModal
        isOpen={showEditModal}
        product={selectedProduct}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleUpdateProduct}
      />

      {/* <ProductTable
        ref={printRef}
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      /> */}


      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        onDelete={handleDeleteProduct}
      />



    </div>
  );
}


export default Products;