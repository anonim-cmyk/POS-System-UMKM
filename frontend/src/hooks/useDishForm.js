import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { addDish, updateDish } from "../api";
import { useCategories } from "./useCategories";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dsszoqt88/image/upload";

const INITIAL_STATE = {
  name: "",
  price: "",
  category: "",
  stock: 0,
};

export const useDishForm = ({ editingDish, onSuccessClose }) => {
  const queryClient = useQueryClient();
  const { categories, isLoading } = useCategories();

  const [dishData, setDishData] = useState(INITIAL_STATE);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =====================
      Prefill Edit Mode
  ====================== */
  useEffect(() => {
    if (!editingDish) return;

    setDishData({
      name: editingDish.name,
      price: editingDish.price,
      category: editingDish.category?._id ?? editingDish.category,
      stock: editingDish.stock ?? 0,
    });

    setPreview(editingDish.imageUrl ?? null);
  }, [editingDish]);

  /* =====================
      Handlers
  ====================== */
  const handleChange = useCallback((key, value) => {
    setDishData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  const validate = () => {
    if (!dishData.name || !dishData.price || !dishData.category) {
      enqueueSnackbar("Name, price, and category are required", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dishes");

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");

    return data.secure_url;
  };

  /* =====================
      Mutation
  ====================== */
  const mutation = useMutation({
    mutationFn: async (payload) => {
      return editingDish?._id
        ? await updateDish({ dishId: editingDish._id, ...payload })
        : await addDish(payload);
    },

    onSuccess: () => {
      enqueueSnackbar(
        editingDish ? "Dish updated successfully" : "Dish added successfully",
        { variant: "success" }
      );

      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-dishes"] });
      resetForm();
      onSuccessClose();
    },

    onError: () => {
      enqueueSnackbar("Failed to save dish", { variant: "error" });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const imageUrl = imageFile ? await uploadImage(imageFile) : preview;

      await mutation.mutateAsync({
        name: dishData.name,
        price: Number(dishData.price),
        stock: Number(dishData.stock),
        category: dishData.category,
        imageUrl,
      });
      resetForm();
      onSuccessClose();
    } catch {
      enqueueSnackbar("Image upload failed", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDishData(INITIAL_STATE);
    setImageFile(null);
    setPreview(null);
  };

  return {
    dishData,
    categories,
    preview,
    isLoading,
    isSubmitting,
    handleChange,
    handleImageChange,
    handleSubmit,
  };
};
