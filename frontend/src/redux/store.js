import { configureStore } from "@reduxjs/toolkit";
import customerSlices from "./slices/customerSlices";
import cartSlices from "./slices/cartSlices";
import userSlices from "./slices/userSlices";

const store = configureStore({
  reducer: {
    customer: customerSlices,
    cart: cartSlices,
    user: userSlices,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;
