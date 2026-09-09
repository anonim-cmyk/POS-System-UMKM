import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { register } from "../../api/auth.api";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "",
};
const Register = ({ setIsRegistration }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const handleRoleSelection = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const registerMutation = useMutation({
    mutationFn: (reqData) => register(reqData),
    onSuccess: (res) => {
      const { data } = res;
      enqueueSnackbar(data.message, { variant: "success" });
      setFormData(INITIAL_FORM);

      setTimeout(() => {
        setIsRegistration(false);
      }, 1500);
    },
    onError: (error) => {
      const { response } = error;
      enqueueSnackbar(response.data.message, { variant: "error" });
    },
  });
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-white mb-2 mt-3 text-sm font-medium">
            Employee Name
          </label>
          <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employe name"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-white mb-2 mt-3 text-sm font-medium">
            Employee Phone
          </label>
          <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter employe phone"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-white mb-2 mt-3 text-sm font-medium">
            Employee Email
          </label>
          <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
        <label className="block text-white mb-2 mt-3 text-sm font-medium">
          Choose your role
        </label>
        <div className="flex items-center gap-3 mt-4">
          {["Cashier", "Admin"].map((role) => (
            <button
              className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] ${
                formData.role === role ? "bg-indigo-900" : ""
              }`}
              onClick={() => handleRoleSelection(role)}
              type="button"
              key={role}
            >
              {role}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full mt-6 px-4 py-3 rounded-lg bg-yellow-400 text-gray-900 font-bold"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
