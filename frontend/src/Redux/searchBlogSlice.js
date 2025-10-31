// searchBlogSlice.js
import { createSlice } from '@reduxjs/toolkit';

const searchBlogSlice = createSlice({
  name: 'searchBlog',
  initialState: {
    searchQuery: '',
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setSearchResults,
  setLoading,
  setError,
} = searchBlogSlice.actions;

export default searchBlogSlice.reducer;
