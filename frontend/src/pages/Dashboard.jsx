import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import DishTable from "../components/dashboard/DishTable";
import { useState } from "react";
import Modal from "../components/dashboard/Modal";
import DishModal from "../components/dashboard/DishModal";
import CategoryModal from "../components/dashboard/CategoryModal";
import CategoryTable from "../components/dashboard/CategoryTable";
import TableTable from "../components/dashboard/TableTable";
import PaymentTable from "../components/dashboard/PaymentTable";
import { useSearchParams } from "react-router-dom";
import Report from "../components/dashboard/Report";

const buttons = [
  // { label: "Add Table", icon: <GrTableAdd />, action: "table" },
  // { label: "Add Category", icon: <TbCategoryPlus />, action: "category" },
  // { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = [
  "Metrics",
  "Orders",
  "Payments",
  "Report",
  "Dishes",
  "Categories",
  "Tables",
];

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "metrics";

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDishesModalOpen, setIsDishesModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  const TAB_WITH_PAGINATION = ["orders", "payments", "dishes"];
  const handleTabChange = (tab) => {
    const lowerTab = tab.toLowerCase();
    const params = { tab: lowerTab };
    if (TAB_WITH_PAGINATION.includes(lowerTab)) {
      params.page = "1";
    }
    setSearchParams(params);
  };

  return (
    <div className="bg-[#1f1f1f] min-h-screen">
      {/* Header with Tabs */}
      <div className="sticky top-0 z-10 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="mx-auto px-4 md:px-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-1 py-3">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => handleTabChange(item)}
                className={`relative px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === item.toLowerCase()
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300 hover:bg-[#262626]/50"
                }`}
              >
                {item}
                {activeTab === item.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Navigation - Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto hide-scrollbar">
            <div className="flex gap-1 min-w-max py-3">
              {tabs.map((item) => (
                <button
                  key={item}
                  onClick={() => handleTabChange(item)}
                  className={`relative px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === item.toLowerCase()
                      ? "text-white bg-[#262626]"
                      : "text-gray-400"
                  }`}
                >
                  {item}
                  {activeTab === item.toLowerCase() && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (if any) */}
      {buttons.length > 0 && (
        <div className="px-4 md:px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {buttons.map(({ label, icon, action }) => (
              <button
                key={label}
                className="bg-[#262626] hover:bg-[#2d2d2d] px-4 md:px-6 py-2.5 rounded-lg text-white font-medium text-sm flex items-center gap-2 transition-colors"
                onClick={() => handleOpenModal(action)}
              >
                {label} {icon}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="px-4 md:px-6 pb-6">
        {activeTab === "metrics" && <Metrics />}
        {activeTab === "orders" && <RecentOrders />}
        {activeTab === "payments" && <PaymentTable />}
        {activeTab === "report" && <Report />}
        {activeTab === "dishes" && (
          <DishTable
            onAdd={() => setIsDishesModalOpen(true)}
            onEdit={(dish) => {
              setEditingDish(dish);
              setIsDishesModalOpen(true);
            }}
          />
        )}
        {activeTab === "categories" && (
          <CategoryTable
            onAdd={() => setIsCategoryModalOpen(true)}
            onEdit={(category) => {
              setEditingCategory(category);
              setIsCategoryModalOpen(true);
            }}
          />
        )}
        {activeTab === "tables" && (
          <TableTable
            onAdd={() => setIsTableModalOpen(true)}
            onEdit={(table) => {
              setEditingTable(table);
              setIsTableModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Modals */}
      {isTableModalOpen && (
        <Modal
          setIsTableModalOpen={setIsTableModalOpen}
          editingTable={editingTable}
          setEditingTable={setEditingTable}
        />
      )}
      {isCategoryModalOpen && (
        <CategoryModal
          setIsCategoryModalOpen={setIsCategoryModalOpen}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
        />
      )}
      {isDishesModalOpen && (
        <DishModal
          setIsDishesModalOpen={setIsDishesModalOpen}
          editingDish={editingDish}
          setEditingDish={setEditingDish}
        />
      )}
    </div>
  );
};

export default Dashboard;
