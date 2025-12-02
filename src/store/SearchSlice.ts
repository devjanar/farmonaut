// store/searchModalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const searchModalSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    openSearchModal: (state) => {
      state.isOpen = true;
    },
    closeSearchModal: (state) => {
      state.isOpen = false;
    },
    toggleModal: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openSearchModal, closeSearchModal, toggleModal } = searchModalSlice.actions;
export default searchModalSlice.reducer;
