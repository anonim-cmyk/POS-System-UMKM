import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDishes, deleteDish } from "../../https";
import { BiEdit, BiTrash } from "react-icons/bi";
import { enqueueSnackbar } from "notistack";
import FullScreenLoader from "../shared/FullScreenLoader";
import { useDishes } from "../../hooks/useDishes";

const DishTable = ({ onAdd, onEdit }) => {
  const { dishes, isLoading, deleteDish } = useDishes();

  if (isLoading) return <FullScreenLoader />;

  return (
    <div className="mx-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-white text-2xl font-semibold">Dishes</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          onClick={onAdd}
        >
          Add Dish
        </button>
      </div>

      <table className="min-w-full text-white border-collapse align-middle text-center">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish) => (
            <tr key={dish._id} className="border-b border-gray-600">
              {/* Image */}
              <td className="px-4 py-2">
                {dish.imageUrl ? (
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-16 h-16 object-cover rounded mx-auto"
                  />
                ) : (
                  "No Image"
                )}
              </td>

              {/* Text Columns */}
              <td className="px-4 py-2">{dish.name}</td>
              <td className="px-4 py-2">{dish.category?.name || "N/A"}</td>
              <td className="px-4 py-2">{dish.price}</td>
              <td className="px-4 py-2">{dish.stock || 0}</td>

              {/* Actions */}
              <td className="px-4 py-2">
                <div className="inline-flex gap-2 justify-center items-center">
                  {/* Edit Button */}
                  <button
                    className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => onEdit(dish)}
                  >
                    <BiEdit size={20} />
                  </button>

                  {/* Delete Button */}
                  <button
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => {
                      if (window.confirm(`Delete "${dish.name}"?`)) {
                        deleteDish(dish._id);
                      }
                    }}
                  >
                    <BiTrash size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DishTable;
