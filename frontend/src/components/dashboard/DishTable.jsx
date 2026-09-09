import { BiEdit, BiTrash } from "react-icons/bi";
import FullScreenLoader from "../shared/FullScreenLoader";
import { useDishes } from "../../hooks/useDishes";
import { usePaginationParams } from "../../hooks/usePaginationParams";
import { useDebounce } from "../../hooks/useDebounce";

const DishTable = ({ onAdd, onEdit }) => {
  const { page, setPage, search } = usePaginationParams();

  const debouncedSearch = useDebounce(search, 400);
  const { dishes, meta, isLoading, deleteDish } = useDishes({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  if (isLoading && !dishes.length) return <FullScreenLoader />;

  return (
    <div className="p-6">
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

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(meta?.totalPages || 1)].map((_, i) => {
          const p = i + 1;
          const isActive = p === page;

          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              disabled={isActive}
              className={`px-3 py-1 rounded transition ${
                isActive
                  ? "bg-blue-600 text-white font-semibold cursor-default"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === meta?.totalPages}
          className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DishTable;
