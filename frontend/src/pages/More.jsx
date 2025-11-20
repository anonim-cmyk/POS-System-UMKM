import BottomNav from "../components/shared/BottomNav";

const More = () => {
  return (
    <div className="p-4 text-white bg-[#262626] min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Utilities</h2>
      <div className="flex flex-col gap-4">
        <button className="bg-[#343434] px-4 py-3 rounded-lg text-left">
          Backup Data
        </button>
        <button className="bg-[#343434] px-4 py-3 rounded-lg text-left">
          POS Settings
        </button>
        <button className="bg-[#343434] px-4 py-3 rounded-lg text-left">
          About
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default More;
