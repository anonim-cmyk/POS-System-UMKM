import { IoHomeOutline } from "react-icons/io5";
import { CiShoppingBasket } from "react-icons/ci";
import { MdOutlineTableBar } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDish } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Modal from "./Modal";
import { setCustomer } from "../../redux/slices/customerSlices";

const BottomNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path) => location.pathname === path;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const increment = () => {
    setGuestCount((prev) => prev + 1);
  };

  const decrement = () => {
    if (guestCount <= 0) return;
    setGuestCount((prev) => prev - 1);
  };

  const handleCreateOrder = () => {
    dispatch(setCustomer({ name, phone, guests: guestCount }));
    navigate("/tables");
  };
  return (
    <section className="fixed bottom-0 left-0 right-0 h-16 p-2 flex justify-around items-center bg-[#262626] text-white">
      <button
        className={`flex items-center justify-center py-2 gap-2 w-[200px] ${
          isActive("/") ? "bg-[#343434] rounded-md" : "text-[#ababab]"
        }`}
        onClick={() => navigate("/")}
      >
        <IoHomeOutline size={30} />
        Home
      </button>
      <button
        className={`flex items-center justify-center py-2 gap-2 w-[200px] ${
          isActive("/orders") ? "bg-[#343434] rounded-md" : "text-[#ababab]"
        }`}
        onClick={() => navigate("/orders")}
      >
        <CiShoppingBasket size={30} />
        Orders
      </button>
      <button
        className={`flex items-center justify-center py-2 gap-2 w-[200px] ${
          isActive("/tables") ? "bg-[#343434] rounded-md" : "text-[#ababab]"
        }`}
        onClick={() => navigate("/tables")}
      >
        <MdOutlineTableBar size={30} />
        Tables
      </button>
      <button
        className={`flex items-center justify-center py-2 gap-2 w-[200px] ${
          isActive("/more") ? "bg-[#343434] rounded-md" : "text-[#ababab]"
        }`}
      >
        <CiCircleMore size={30} />
        More
      </button>
      <button
        className="bg-[#f6b100] rounded-full text-white p-3 absolute items-center bottom-2"
        onClick={openModal}
      >
        <BiSolidDish size={30} />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={"Create Order"}>
        <div>
          <label className="block text-white mb-2 text-sm font-medium">
            Customer Name
          </label>
          <div className="flex items-center justify-center">
            <input
              className="bg-transparent flex-1 text-white focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter Customer Name"
            />
          </div>
          <label className="block text-white mb-2 mt-4 text-sm font-medium">
            Customer Phone
          </label>
          <div className="flex items-center justify-center">
            <input
              className="bg-transparent flex-1 text-white focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              placeholder="Ex: +62"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 mt-4 text-sm font-medium text-white">
            Guest
          </label>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
            <button onClick={decrement}>&minus;</button>
            <span>{guestCount} Person</span>
            <button onClick={increment}>&#43;</button>
          </div>
        </div>
        <button
          className="w-full bg-[#f6b100] px-4 py-2 rounded-lg mt-8"
          onClick={handleCreateOrder}
        >
          Create Order
        </button>
      </Modal>
    </section>
  );
};

export default BottomNav;
