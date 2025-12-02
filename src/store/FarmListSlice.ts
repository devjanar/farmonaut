// store/FarmListSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const FarmListSlice = createSlice({
  name: "farmlist",
  initialState,
  reducers: {
    openFarmList: (state) => {
      state.isOpen = true;
    },
    closeFarmList: (state) => {
      state.isOpen = false;
    },
    toggleFarmList: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openFarmList, closeFarmList, toggleFarmList } = FarmListSlice.actions;
export default FarmListSlice.reducer;
