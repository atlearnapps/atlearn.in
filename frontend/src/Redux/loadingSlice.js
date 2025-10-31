import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageLoading: true, // Default state for page loader
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload; // Update page loading state
    },
  },
});

export const { setPageLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
