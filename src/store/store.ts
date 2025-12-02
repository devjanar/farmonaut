// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import profileModalReducer from "./ProfileSlice";
import videoModalSlice from "./VideoSlice";
import searchModalSlice from "./SearchSlice";
import myFieldSlice from "./MyFieldSlice";
import farmAdvisorSlice from "./FarmAdvisorSlice";
import addNewFieldSlice from "./AddNewFieldSlice";
import homeSlice from "./HomeSlice";
import fieldDetailSlice from "./FieldDetailSlice";
import farmListSlice from "./FarmListSlice"
import mapControlSlice from "./MapControlSlice";
import farmIndexResultSlice from "./FarmIndexResultSlice";
import ReportSlice from "./ReportSlice";
import WeatherSlice from "./WeatherSlice";

export const store = configureStore({
  reducer: {
    profile: profileModalReducer,
    video: videoModalSlice,
    search: searchModalSlice,
    myfield: myFieldSlice,
    farmadvisor: farmAdvisorSlice,
    newfield: addNewFieldSlice, 
    home: homeSlice, 
    fielddetail: fieldDetailSlice, 
    farmlist: farmListSlice,
    mapcontrol: mapControlSlice,
    farmindexresult: farmIndexResultSlice,
    report: ReportSlice,
    weather: WeatherSlice,
  },
});

// Infer types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
