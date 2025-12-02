// store/FarmIndexResultSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const FarmIndexResultSlice = createSlice({
  name: "farmindexresult",
  initialState,
  reducers: {
    openFarmIndexResult: (state) => {
      state.isOpen = true;
    },
    closeFarmIndexResult: (state) => {
      state.isOpen = false;
    },
    toggleFarmIndexResult: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openFarmIndexResult, closeFarmIndexResult, toggleFarmIndexResult } = FarmIndexResultSlice.actions;
export default FarmIndexResultSlice.reducer;
