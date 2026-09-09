import { configureStore } from "@reduxjs/toolkit";
import customerSlices from "./slices/customerSlices";
import cartSlices from "./slices/cartSlices";
import userSlices from "./slices/userSlices";
import searchReducer from "./slices/searchSlice";

const store = configureStore({
  reducer: {
    customer: customerSlices,
    cart: cartSlices,
    user: userSlices,
    search: searchReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export default store;
