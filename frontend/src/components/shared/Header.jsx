import { CiSearch } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { IoIosLogOut } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlices";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        <h3>L O G O</h3>
      </div>
      {/* Disini Search */}
      <div className="flex items-center gap-2 w-[500px] bg-[#1f1f1f] rounded-md px-5 py-2">
        <CiSearch size={32} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-[#1f1f1f] text-[#f5f5f5] px-2 py-1 rounded-md outline-none"
        />
      </div>

      {/* Disini LogoUser */}
      <div className="flex items-center justify-center gap-7">
        {userData.role === "admin" && (
          <MdDashboard
            size={32}
            className="cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
        )}
        <CiBellOn size={32} />
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
