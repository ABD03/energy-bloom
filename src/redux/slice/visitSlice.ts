import { createSlice } from "@reduxjs/toolkit";
const VisitSlice = createSlice({
  name: "visits",
  initialState: {
    visitor: true,
    current: null,
    fcm_token: null,
  },
  reducers: {
    setDate: (state, action) => {
      state.current = action.payload;
    },
    setFCMToken: (state, action) => {
      state.fcm_token = action.payload;
    },
  },
});

export const { setDate, setFCMToken } = VisitSlice.actions;
export default VisitSlice.reducer;
