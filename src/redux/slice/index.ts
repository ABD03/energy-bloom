import { combineReducers } from "@reduxjs/toolkit";
import AuthSlice from "./userSlice";
import VisitSlice from "./visitSlice";
import DataSlice from "./dataSlice";
const Slices = combineReducers({
  Auth: AuthSlice,
  Visits: VisitSlice,
  Data: DataSlice,
});
export default Slices;
