// store/FieldDetailSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const FieldDetailSlice = createSlice({
  name: "fielddetail",
  initialState,
  reducers: {
    openFieldDetail: (state) => {
      state.isOpen = true;
    },
    closeFieldDetail: (state) => {
      state.isOpen = false;
    },
    toggleFieldDetail: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openFieldDetail, closeFieldDetail, toggleFieldDetail } = FieldDetailSlice.actions;
export default FieldDetailSlice.reducer;
