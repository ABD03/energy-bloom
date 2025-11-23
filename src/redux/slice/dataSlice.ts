import { createSlice } from "@reduxjs/toolkit";
const DataSlice = createSlice({
  name: "Data",
  initialState: {
    settings: {},
  },
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
  },
});

export const { setSettings } = DataSlice.actions;
export default DataSlice.reducer;
