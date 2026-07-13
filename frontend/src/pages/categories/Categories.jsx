import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category.service";

import AddCategoryModal from "../../components/category/AddCategoryModal";
import EditCategoryModal from "../../components/category/EditCategoryModal";
import DeleteCategoryModal from "../../components/category/DeleteCategoryModal";
import CategoryTable from "../../components/category/CategoryTable";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

const fetchCategories = async () => {
  try {
    setLoading(true);

    const response = await getCategories(
      page,
      limit,
      search,
      sort
    );

    console.log("Category Response:", response);
    console.log("Category Data:", response.data);
    console.log("Categories:", response.data.categories);
    console.log("Count:", response.data.categories.length);

    setCategories(response.data.categories);
    setTotalPages(response.data.totalPages);

  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to fetch categories"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCategories();
  }, [page, search, sort]);

  const handleCreateCategory = async (data) => {
    try {
      await createCategory(data);

      toast.success("Category Created Successfully");

      setShowAddModal(false);

      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create category"
      );
    }
  };

  const handleUpdateCategory = async (data) => {
    try {
      await updateCategory(selectedCategory._id, data);

      toast.success("Category Updated Successfully");

      setShowEditModal(false);

      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update category"
      );
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory._id);

      toast.success("Category Deleted Successfully");

      setShowDeleteModal(false);

      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search Category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded w-80"
          />

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Name (A-Z)</option>
            <option value="za">Name (Z-A)</option>
          </select>

        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          + Add Category
        </button>

      </div>

      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={(category) => {
          setSelectedCategory(category);
          setShowEditModal(true);
        }}
        onDelete={(categoryId) => {
          const category = categories.find(
            (item) => item._id === categoryId
          );

          setSelectedCategory(category);
          setShowDeleteModal(true);
        }}
      />

      <div className="flex justify-center items-center gap-4 mt-6">

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleCreateCategory}
      />

      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateCategory}
        category={selectedCategory}
      />

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteCategory}
      />

    </div>
  );
}

export default Categories;