import { GrTableAdd } from "react-icons/gr";
import { TbCategoryPlus } from "react-icons/tb";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import { useState } from "react";
import Modal from "../components/dashboard/Modal";

const buttons = [
  { label: "Add Table", icon: <GrTableAdd />, action: "table" },
  { label: "Add Category", icon: <TbCategoryPlus />, action: "category" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];
const tabs = ["Metrics", "Orders", "Payments"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Metrics");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const handleOpenModal = (action) => {
    if (action === "table") setIsTableModalOpen(true);
  };
  return (
    <div className="bg-[#1f1f1f] h-[calc(100vh)]">
      <div className="mx-auto flex items-center justify-between py-14 px-6 md:px-4">
        <div className="flex items-center gap-3">
          {buttons.map(({ label, icon, action }) => (
            <button
              className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-white font-semibold text-xl flex items-center gap-4"
              onClick={() => handleOpenModal(action)}
            >
              {label} {icon}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {tabs.map((item) => (
            <button
              onClick={() => setActiveTab(item)}
              className={`px-8 py-3 rounded-lg text-white font-semibold text-xl flex items-center gap-4 ${
                activeTab === item
                  ? "bg-[#262626]"
                  : "bg-[#1a1a1a] hover:bg-[#262626]"
              } `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Orders" && <RecentOrders />}

      {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen} />}
    </div>
  );
};

export default Dashboard;
