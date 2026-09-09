import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItems: (state, action) => {
      const { dishId, quantity, pricePerQuantity } = action.payload;

      const existingItem = state.find((item) => item.dishId === dishId);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = existingItem.quantity * pricePerQuantity;
      } else {
        state.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      return state.filter((item) => item.dishId != action.payload);
    },
    removeAllItems: (state, action) => {
      return [];
    },
  },
});

export const getTotalPrice = (state) =>
  state.cart.reduce((total, item) => total + item.price, 0);

export const { addItems, removeItem, removeAllItems } = cartSlice.actions;
export default cartSlice.reducer;
