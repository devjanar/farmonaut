// store/videoModalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const videoModalSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    openVideoModal: (state) => {
      state.isOpen = true;
    },
    closeVideoModal: (state) => {
      state.isOpen = false;
    },
    toggleModal: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openVideoModal, closeVideoModal, toggleModal } = videoModalSlice.actions;
export default videoModalSlice.reducer;
