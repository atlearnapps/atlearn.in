import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { userSlice } from "./userSlice";
import addonPlanReducer from "./addonplanSlice";
import searchBlogSlice from "./searchBlogSlice";
import loadingReducer from './loadingSlice';
const rootReducer = combineReducers({
  user: userSlice.reducer,
  addonPlan: addonPlanReducer,
  searchBlog: searchBlogSlice,
  loading: loadingReducer,
});

const store = configureStore({
  reducer: rootReducer,
});
export default store;
