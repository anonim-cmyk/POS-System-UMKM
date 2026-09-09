import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlices";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth.api";

const Login = () => {
  const [formData, setIsFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setIsFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    console.time("login");
    loginMutation.mutate(formData);
    setIsFormData({
      email: "",
      password: "",
    });
  };

  const loginMutation = useMutation({
    mutationFn: (reqData) => login(reqData),
    onSuccess: (res) => {
      console.timeEnd("login_total");
      const { data } = res;
      const { userId, name, email, phone, role } = data.data;
      dispatch(setUser({ userId, name, email, phone, role }));
      navigate("/");
    },
    onError: (error) => {
      console.timeEnd("login_total");
      const { response } = error;
      enqueueSnackbar(response.data.message, { variant: "error" });
    },
  });

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-white mb-2 mt-3 text-sm font-medium">
            Employee Email
          </label>
          <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="text"
              value={formData.email}
              onChange={handleChange}
              name="email"
              placeholder="Enter employe email"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-white mb-2 mt-3 text-sm font-medium">
            Password
          </label>
          <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className={`w-full mt-6 px-4 py-3 rounded-lg font-bold transition
    ${
      loginMutation.isPending
        ? "bg-yellow-300 text-gray-700 cursor-not-allowed"
        : "bg-yellow-400 text-gray-900"
    }`}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
