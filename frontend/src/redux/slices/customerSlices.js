import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerName: "",
  customerPhone: "",
  guests: 0,
  table: null,
};

const customerSlices = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { name, phone, guests } = action.payload;
      state.orderId = `${Date.now()}`;
      state.customerName = name;
      state.customerPhone = phone;
      state.guests = guests;
    },

    removeCustomer: (state, action) => {
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null;
    },

    updatedTable: (state, action) => {
      state.table = action.payload.table;
    },
  },
});

export const { setCustomer, removeCustomer, updatedTable } =
  customerSlices.actions;

export default customerSlices.reducer;
