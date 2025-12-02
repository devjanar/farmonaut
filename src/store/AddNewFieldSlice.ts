// store/AddNewFieldSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const AddNewFieldSlice = createSlice({
  name: "newfield",
  initialState,
  reducers: {
    openNewField: (state) => {
      state.isOpen = true;
    },
    closeNewField: (state) => {
      state.isOpen = false;
    },
    toggleNewField: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openNewField, closeNewField, toggleNewField } = AddNewFieldSlice.actions;
export default AddNewFieldSlice.reducer;
