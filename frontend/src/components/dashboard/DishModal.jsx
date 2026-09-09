import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useDishForm } from "../../hooks/useDishForm";

const DishModal = ({ setIsDishesModalOpen, editingDish, setEditingDish }) => {
  const handleClose = () => {
    setIsDishesModalOpen(false);
    setEditingDish(null);
    // setDishData({ name: "", price: "", category: "", stock: 0 });
    // setImageFile(null);
    // setPreview(null);
  };

  const {
    dishData,
    categories,
    preview,
    isLoading,
    isSubmitting,
    handleChange,
    handleImageChange,
    handleSubmit,
  } = useDishForm({
    editingDish,
    onSuccessClose: handleClose,
  });

  if (isLoading) {
    return <p className="text-white p-6">Loading categories...</p>;
  }

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
            {editingDish ? "Edit Dish" : "Add Dish"}
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
            placeholder="Dish name"
            className="w-full p-2 rounded bg-[#1f1f1f] text-white outline-none"
            value={dishData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 rounded bg-[#1f1f1f] text-white outline-none"
            value={dishData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stock"
            className="w-full p-2 rounded bg-[#1f1f1f] text-white outline-none"
            value={dishData.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            required
          />

          <div>
            <label className="text-white text-sm">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 rounded bg-[#1f1f1f] text-white outline-none mt-1"
              onChange={handleImageChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded border border-gray-600"
              />
            )}
          </div>

          <select
            className="w-full p-2 rounded bg-[#1f1f1f] text-white outline-none"
            value={dishData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded font-bold ${
              isSubmitting
                ? "bg-yellow-300 text-gray-700 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            {isSubmitting
              ? editingDish
                ? "Updating..."
                : "Saving..."
              : editingDish
              ? "Update Dish"
              : "Save Dish"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default DishModal;
