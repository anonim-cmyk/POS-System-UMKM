import { CiSearch } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { IoIosLogOut } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { removeUser } from "../../redux/slices/userSlices";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { logout } from "../../api/auth.api";
import { useLowStockNotifications } from "../../hooks/useLowStockNotification";
import { useState } from "react";
import { BiRestaurant } from "react-icons/bi";
import { setSearchTerm } from "../../redux/slices/searchSlice";

const Badge = ({ count }) => (
  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
    {count}
  </span>
);

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const userData = useSelector((state) => state.user);

  const search = searchParams.get("search") || "";

  const navigate = useNavigate();

  const { lowStockItems, count } = useLowStockNotifications();

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      console.log(data);
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-[#1a1a1a] px-8 py-4 text-white font-poppins flex items-center justify-between">
      {/* Nanti disini Logo */}
      <div onClick={() => navigate("/")} className="hover:cursor-pointer">
        <BiRestaurant size={32} />
      </div>
      {/* Disini Search */}
      <div className="flex items-center gap-2 w-[500px] bg-[#1f1f1f] rounded-md px-5 py-2">
        <CiSearch size={32} />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearchParams((prev) => {
              const params = new URLSearchParams(prev);
              params.set("search", e.target.value);
              return params;
            })
          }
          className="bg-[#1f1f1f] text-[#f5f5f5] px-2 py-1 rounded-md outline-none"
        />
      </div>

      {/* Disini LogoUser */}
      <div className="flex items-center justify-center gap-7">
        {userData.role === "Admin" && (
          <MdDashboard
            size={32}
            className="cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
        )}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="cursor-pointer relative hover:opacity-80 transition-opacity"
          >
            <CiBellOn size={32} />
            {count > 0 && <Badge count={count} />}
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-72 bg-[#262626] text-white rounded-lg shadow-2xl overflow-hidden z-50 border border-[#3a3a3a]"
              >
                {/* Header */}
                <div className="bg-[#2a2a2a] px-4 py-3 border-b border-[#3a3a3a]">
                  <h4 className="font-semibold text-base flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Low Stock Alert
                  </h4>
                </div>

                {/* Content */}
                <div className="p-4 max-h-80 overflow-y-auto">
                  {lowStockItems.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">✓</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        All stocks are safe
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {lowStockItems.map((item, index) => (
                        <motion.li
                          key={item._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex justify-between items-center p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#303030] transition-colors"
                        >
                          <span className="text-sm font-medium truncate pr-2">
                            {item.name}
                          </span>
                          <span className="text-red-400 font-semibold text-sm bg-red-500/10 px-2 py-1 rounded">
                            {item.stock}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <CgProfile size={32} />
        <div className="flex flex-col items-start">
          <h1 className="font-poppins font-semibold text-white">
            {userData.name || "N/A"}
          </h1>
          <p className="font-poppins text-white">{userData.role || "N/A"}</p>
        </div>
        <IoIosLogOut
          onClick={() => handleLogout()}
          size={32}
          className="text-white"
        />
      </div>
    </header>
  );
};

export default Header;
