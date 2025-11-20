import { useCategories } from "../../hooks/useCategories";
import FullScreenLoader from "../shared/FullScreenLoader";
import { BiEdit, BiTrash } from "react-icons/bi";

const CategoryTable = ({ onAdd, onEdit }) => {
  const { categories, isLoading, deleteCategory } = useCategories();

  if (isLoading) return <FullScreenLoader />;

  return (
    <div className="mx-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-white text-2xl font-semibold">Categories</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          onClick={onAdd}
        >
          Add Category
        </button>
      </div>

      <table className="min-w-full text-white border-collapse text-center">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Color</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="border-b border-gray-700">
              <td className="px-4 py-2 text-xl">{cat.icon || "📦"}</td>
              <td className="px-4 py-2">{cat.name}</td>
              <td className="px-4 py-2">{cat.description || "-"}</td>
              <td className="px-4 py-2">
                <span
                  className="px-3 py-1 rounded text-black"
                  style={{ backgroundColor: cat.bgColor || "#f0f0f0" }}
                >
                  {cat.bgColor}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="inline-flex gap-2">
                  <button
                    className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => onEdit(cat)}
                  >
                    <BiEdit size={20} />
                  </button>
                  <button
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => {
                      if (window.confirm(`Delete "${cat.name}"?`)) {
                        deleteCategory(cat._id);
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

export default CategoryTable;
