//WeatherSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const WeatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    openWeather: (state) => {
      state.isOpen = true;
    },
    closeWeather: (state) => {
      state.isOpen = false;
    },
    toggleWeather: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openWeather, closeWeather, toggleWeather } = WeatherSlice.actions;
export default WeatherSlice.reducer;
