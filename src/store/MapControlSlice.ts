// store/MapControlSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  dataControl: null,
}

const initialState: ModalState = {
  isOpen: false,
  dataControl: null,
};

const MapControlSlice = createSlice({
  name: "mapcontrol",
  initialState,
  reducers: {
    openMapControl: (state) => {
      state.isOpen = true;
    },
    closeMapControl: (state) => {
      state.isOpen = false;
    },
    toggleMapControl: (state) => {
      state.isOpen = !state.isOpen;
    },
    openMapControlWithData: (state, action: PayloadAction<any>) => {
      state.isOpen = true;
      state.dataControl = action.payload;
    },
  },
});

export const { openMapControl, closeMapControl, toggleMapControl, openMapControlWithData } = MapControlSlice.actions;
export default MapControlSlice.reducer;
