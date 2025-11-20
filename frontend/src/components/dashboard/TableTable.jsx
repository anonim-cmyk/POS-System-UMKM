import { BiEdit, BiTrash } from "react-icons/bi";
import FullScreenLoader from "../shared/FullScreenLoader";
import { useTables } from "../../hooks/useTables";
const TableTable = ({ onAdd, onEdit }) => {
  const { tables, isLoading, deleteTable } = useTables();

  if (isLoading) return <FullScreenLoader />;

  return (
    <div className="mx-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-white text-2xl font-semibold">Tables</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          onClick={onAdd}
        >
          Add Table
        </button>
      </div>

      <table className="min-w-full text-white border-collapse text-center">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="px-4 py-2">Table No</th>
            <th className="px-4 py-2">Seats</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tables.map((table) => (
            <tr key={table._id} className="border-b border-gray-600">
              <td className="px-4 py-2">{table.tableNo}</td>
              <td className="px-4 py-2">{table.seats}</td>

              <td className="px-4 py-2">
                <div className="inline-flex gap-2">
                  <button
                    className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => onEdit(table)}
                  >
                    <BiEdit size={20} />
                  </button>

                  <button
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => {
                      if (window.confirm(`Delete table No ${table.tableNo}?`)) {
                        deleteTable(table._id);
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

export default TableTable;
