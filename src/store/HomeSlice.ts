// store/HomeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for modal data
interface HomeModalData {
  [key: string]: any; // replace with specific fields if known, e.g., id, name
}

interface ModalState {
  isOpen: boolean;
  data: HomeModalData | null;
}

const initialState: ModalState = {
  isOpen: true,
  data: null,
};

const HomeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    // Open modal without data
    openHome: (state) => {
      state.isOpen = true;
      // state.data = null;
    },

    // Open modal with data
    openHomeWithData: (state, action: PayloadAction<HomeModalData>) => {
      state.isOpen = true;
      state.data = action.payload;
    },

    // Close modal
    closeHome: (state) => {
      state.isOpen = false;
      // state.data = null;
    },

    // Toggle modal open/close (keeps existing data)
    toggleHome: (state) => {
      state.isOpen = !state.isOpen;
    },

    // Optional: update data without changing modal state
    setHomeData: (state, action: PayloadAction<HomeModalData>) => {
      state.data = action.payload;
    },
  },
});

export const {
  openHome,
  openHomeWithData,
  closeHome,
  toggleHome,
  setHomeData,
} = HomeSlice.actions;

export default HomeSlice.reducer;
