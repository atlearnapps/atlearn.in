// addonPlanSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  duration: null,
  storage: null,
  userDetails: null,
};

export const addonPlanSlice = createSlice({
  name: "addonPlan",
  initialState,
  reducers: {
    setDurationplan: (state, action) => {
      state.duration = action.payload;
    },
    setStoragePlan: (state, action) => {
      state.storage = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    clearDuration: (state) => {
      state.duration = null;
    },
    clearStorage: (state) => {
      state.storage = null;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
  },
});

export const {
  setDurationplan,
  setStoragePlan,
  setUserDetails,
  clearDuration,
  clearStorage,
  clearUserDetails,
} = addonPlanSlice.actions;
export default addonPlanSlice.reducer;
