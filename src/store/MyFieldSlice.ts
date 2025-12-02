// store/MyFieldSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const myFieldSlice = createSlice({
  name: "myfield",
  initialState,
  reducers: {
    openMyField: (state) => {
      state.isOpen = true;
    },
    closeMyField: (state) => {
      state.isOpen = false;
    },
    toggleMyField: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openMyField, closeMyField, toggleMyField } = myFieldSlice.actions;
export default myFieldSlice.reducer;
