import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { addTable, updatedTable } from "../../api/table.api";

const Modal = ({ setIsTableModalOpen, editingTable, setEditingTable }) => {
  console.log(editingTable);

  const [tableData, setTableData] = useState({ tableNo: "", seats: "" });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingTable) {
      setTableData(editingTable);
    }
  }, [editingTable]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      return editingTable
        ? updatedTable({ _id: editingTable._id, ...tableData })
        : addTable(tableData);
    },

    onMutate: async () => {
      await queryClient.cancelQueries(["tables"]);
      const previousTables = queryClient.getQueryData(["tables"]);

      if (editingTable) {
        queryClient.setQueryData(["tables"], (old) => ({
          ...old,
          data: old.data.map((t) =>
            t._id === editingTable._id ? { ...t, ...tableData } : t
          ),
        }));
      }

      return { previousTables };
    },

    onSuccess: (res) => {
      enqueueSnackbar(res.data.message, { variant: "success" });
      handleClose();
    },

    onError: (err, _, context) => {
      queryClient.setQueryData(["tables"], context.previousTables);
      enqueueSnackbar(err.response.data.message, { variant: "error" });
    },

    onSettled: () => {
      if (!editingTable) {
        queryClient.invalidateQueries(["tables"]);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleClose = () => {
    setIsTableModalOpen(false);
    setEditingTable(null);
    setTableData({ tableNo: "", seats: "" });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96"
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">
            {editingTable ? "Edit Table" : "Add Table"}
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-red-500"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="text-white text-sm">Table Number</label>
            <input
              type="number"
              name="tableNo"
              value={tableData.tableNo}
              onChange={handleInputChange}
              required
              className="w-full bg-[#1f1f1f] text-white p-3 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-white text-sm">Seats</label>
            <input
              type="number"
              name="seats"
              value={tableData.seats}
              onChange={handleInputChange}
              required
              className="w-full bg-[#1f1f1f] text-white p-3 rounded mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full font-bold py-3 rounded transition ${
              mutation.isPending
                ? "bg-yellow-300 text-gray-700 cursor-not-allowed"
                : "bg-yellow-400 text-black"
            }`}
          >
            {mutation.isPending
              ? editingTable
                ? "Updating..."
                : "Saving..."
              : editingTable
              ? "Update Table"
              : "Add Table"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;
