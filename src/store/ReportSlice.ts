//ReportSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const ReportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    openReport: (state) => {
      state.isOpen = true;
    },
    closeReport: (state) => {
      state.isOpen = false;
    },
    toggleReport: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openReport, closeReport, toggleReport } = ReportSlice.actions;
export default ReportSlice.reducer;
