// store/FarmAdvisorSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const farmAdvisorSlice = createSlice({
  name: "farmadvisor",
  initialState,
  reducers: {
    openFarmAdvisor: (state) => {
      state.isOpen = true;
    },
    closeFarmAdvisor: (state) => {
      state.isOpen = false;
    },
    toggleFarmAdvisor: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openFarmAdvisor, closeFarmAdvisor, toggleFarmAdvisor } = farmAdvisorSlice.actions;
export default farmAdvisorSlice.reducer;
