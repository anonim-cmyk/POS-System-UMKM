import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { addDish, updateDish, getCategories } from "../../https";

const DishModal = ({ setIsDishesModalOpen, editingDish, setEditingDish }) => {
  const queryClient = useQueryClient();

  const [dishData, setDishData] = useState({
    name: "",
    price: "",
    category: "",
    stock: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch categories
  const { data: categoriesRaw, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res.data?.data || res.data || [];
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];

  // Prefill data jika editing
  useEffect(() => {
    if (editingDish) {
      setDishData({
        name: editingDish.name,
        price: editingDish.price,
        category: editingDish.category?._id || editingDish.category || "",
        stock: editingDish.stock || 0,
      });
      setPreview(editingDish.imageUrl || null);
    }
  }, [editingDish]);

  // Mutation Add/Update Dish
  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (editingDish?._id) {
        return updateDish({ dishId: editingDish._id, ...payload });
      }
      return addDish(payload);
    },
    onSuccess: () => {
      enqueueSnackbar(
        editingDish ? "Dish updated successfully" : "Dish added successfully",
        { variant: "success" }
      );
      queryClient.invalidateQueries(["dishes"]);
      setIsDishesModalOpen(false);
      setEditingDish(null);
    },
    onError: () => {
      enqueueSnackbar("Failed to save dish", { variant: "error" });
    },
  });

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dishData.name || !dishData.price || !dishData.category) {
      enqueueSnackbar("Name, price, and category are required", {
        variant: "warning",
      });
      return;
    }

    try {
      let imageUrl = preview;

      if (imageFile) {
        const formDataCloud = new FormData();
        formDataCloud.append("file", imageFile);
        formDataCloud.append("upload_preset", "dishes");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dsszoqt88/image/upload",
          { method: "POST", body: formDataCloud }
        );
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const payload = {
        name: dishData.name,
        price: Number(dishData.price),
        stock: Number(dishData.stock),
        category:
          typeof dishData.category === "object"
            ? dishData.category._id
            : dishData.category,
        imageUrl,
      };

      mutation.mutate(payload);
    } catch (err) {
      enqueueSnackbar("Image upload failed", { variant: "error" });
      console.error(err);
    }
  };

  const handleClose = () => {
    setIsDishesModalOpen(false);
    setEditingDish(null);
    setDishData({ name: "", price: "", category: "", stock: 0 });
    setImageFile(null);
    setPreview(null);
  };

  if (catLoading)
    return <p className="text-white p-6">Loading categories...</p>;

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
            onChange={(e) => setDishData({ ...dishData, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 rounded bg-[#1f1f1f] text-white outline-none"
            value={dishData.price}
            onChange={(e) =>
              setDishData({ ...dishData, price: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Stock"
            className="w-full p-2 rounded bg-[#1f1f1f] text-white outline-none"
            value={dishData.stock}
            onChange={(e) =>
              setDishData({ ...dishData, stock: Number(e.target.value) })
            }
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
            onChange={(e) =>
              setDishData({ ...dishData, category: e.target.value })
            }
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
            className="w-full py-2 bg-yellow-400 font-bold rounded hover:bg-yellow-500 transition"
          >
            {editingDish ? "Update Dish" : "Add Dish"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default DishModal;
