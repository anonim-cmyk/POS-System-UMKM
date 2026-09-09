import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  isAuth: false,
  authChecked: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userId, name, email, phone, role } = action.payload;
      state.userId = userId;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.role = role;
      state.isAuth = true;
      state.authChecked = true;
    },
    removeUser: (state) => {
      state.userId = "";
      state.name = "";
      state.email = "";
      state.phone = "";
      state.role = "";
      state.isAuth = false;
      state.authChecked = true;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
