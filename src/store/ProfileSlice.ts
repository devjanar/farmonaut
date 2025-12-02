// store/profileModalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const profileModalSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    openProfileModal: (state) => {
      state.isOpen = true;
    },
    closeProfileModal: (state) => {
      state.isOpen = false;
    },
    toggleModal: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openProfileModal, closeProfileModal, toggleModal } = profileModalSlice.actions;
export default profileModalSlice.reducer;
