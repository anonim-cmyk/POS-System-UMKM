import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { addCategory, updateCategory } from "../../api";

const CategoryModal = ({
  setIsCategoryModalOpen,
  editingCategory,
  setEditingCategory,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    bgColor: "#1d2569",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingCategory) {
      const { name, icon, bgColor } = editingCategory;
      setFormData({ name, icon, bgColor });
    }
  }, [editingCategory]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (editingCategory?._id) {
        return updateCategory({ categoryId: editingCategory._id, ...payload });
      }
      return addCategory(payload);
    },
    onSuccess: () => {
      enqueueSnackbar(
        editingCategory
          ? "Category updated successfully"
          : "Category created successfully",
        { variant: "success" }
      );
      queryClient.invalidateQueries(["categories"]);
      handleClose();
    },
    onError: () => {
      enqueueSnackbar("Failed to save category", { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleClose = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", icon: "", bgColor: "#1d2569" });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">
            {editingCategory ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-red-500"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <input
            type="text"
            placeholder="Category name"
            className="w-full p-2 rounded bg-[#1f1f1f] text-white outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Icon (ex: 🍔)"
            className="w-full p-2 rounded bg-[#1f1f1f] text-white outline-none"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            required
          />

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium w-24 text-white">
              Background:
            </label>
            <input
              type="color"
              value={formData.bgColor}
              onChange={(e) =>
                setFormData({ ...formData, bgColor: e.target.value })
              }
              className="w-12 h-10 rounded cursor-pointer"
            />
            <span className="text-white">{formData.bgColor}</span>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full py-2 font-bold rounded transition ${
              mutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            {mutation.isPending
              ? "Saving..."
              : editingCategory
              ? "Update Category"
              : "Add Category"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CategoryModal;
